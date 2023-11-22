from functools import partial

import numpy as np
import torch

from geotransformer.modules.ops import grid_subsample, radius_search
from geotransformer.utils.torch import build_dataloader


# Stack mode utilities

# def precompute_data_stack_mode(points, lengths, num_stages, voxel_size, radius, neighbor_limits):
# step into 1.2.1.1 ： 预计算数据
def precompute_data_stack_mode(points, dps, lengths, num_stages, voxel_size, radius, neighbor_limits):
    assert num_stages == len(neighbor_limits)

    points_list = []  # 装有各个阶段的下采样点
    dps_list = []  # 装有各个阶段的dps
    lengths_list = []  # 各个阶段的list
    neighbors_list = []
    subsampling_list = []  # 下采样？？？
    upsampling_list = []  # 上采样？？？

    # grid subsampling
    for i in range(num_stages):  # 四个阶段
        if i > 0:  # 如果不是第一阶段
            # step into 1.2.1.1.1 : 下采样
            points, dps, lengths = grid_subsample(points, dps, lengths, voxel_size=voxel_size)
            # points, lengths = grid_subsample(points, lengths, voxel_size=voxel_size)
        # 如果是第一阶段直接跳到这里，不进行下采样
        points_list.append(points)
        dps_list.append(dps)
        lengths_list.append(lengths)
        voxel_size *= 2  # 为什么要乘2，是为了每次下采样能获得更少的点吗？？？

    # radius search
    for i in range(num_stages):
        cur_points = points_list[i]
        cur_lengths = lengths_list[i]
        # step into 1.2.1.1.2 ： 半径内搜索
        neighbors = radius_search(
            cur_points,
            cur_points,
            cur_lengths,
            cur_lengths,
            radius,
            neighbor_limits[i],
        )
        # neighbors (Tensor): the k nearest neighbors of q_points in s_points (N, k).
        # Filled with M if there are less than k neighbors.
        # （60000,max_neighbors），储存了每个点的临点索引，超过某点临点的凑数索引用60000代替,对应22行的话
        # 注意这个points既包含src又包含ref，而交叉的索引是没有意义的，所以这个neighbors只是记录了两片点云各自的结构信息
        neighbors_list.append(neighbors)  # 每个阶段的临点索引存起来

        if i < num_stages - 1:  # 如果不是最后一个阶段
            sub_points = points_list[i + 1]  # 通过这个阶段的点下采样得来的点
            sub_lengths = lengths_list[i + 1]
            # 为什么要存这些？？？
            subsampling = radius_search(  # 查询下采样点在当前点云中的邻居
                sub_points,
                cur_points,
                sub_lengths,
                cur_lengths,
                radius,
                neighbor_limits[i],
            )
            subsampling_list.append(subsampling)

            upsampling = radius_search(  # 查询当前点在下采样点云中的邻居
                cur_points,
                sub_points,
                cur_lengths,
                sub_lengths,
                radius * 2,  # 在下采样点云中找，半径要乘2
                neighbor_limits[i + 1],
            )
            upsampling_list.append(upsampling)

        radius *= 2  # 进行下一步，半径乘2？？？

    return {
        'points': points_list,
        'dps': dps_list,
        'lengths': lengths_list,
        'neighbors': neighbors_list,
        'subsampling': subsampling_list,
        'upsampling': upsampling_list,
    }


def single_collate_fn_stack_mode(
    data_dicts, num_stages, voxel_size, search_radius, neighbor_limits, precompute_data=True
):
    r"""Collate function for single point cloud in stack mode.

    Points are organized in the following order: [P_1, ..., P_B].
    The correspondence indices are within each point cloud without accumulation.

    Args:
        data_dicts (List[Dict])
        num_stages (int)
        voxel_size (float)
        search_radius (float)
        neighbor_limits (List[int])
        precompute_data (bool=True)

    Returns:
        collated_dict (Dict)
    """
    batch_size = len(data_dicts)
    # merge data with the same key from different samples into a list
    collated_dict = {}
    for data_dict in data_dicts:
        for key, value in data_dict.items():
            if isinstance(value, np.ndarray):
                value = torch.from_numpy(value)
            if key not in collated_dict:
                collated_dict[key] = []
            collated_dict[key].append(value)

    # handle special keys: feats, points, normals
    if 'normals' in collated_dict:
        normals = torch.cat(collated_dict.pop('normals'), dim=0)
    else:
        normals = None
    feats = torch.cat(collated_dict.pop('feats'), dim=0)
    points_list = collated_dict.pop('points')
    lengths = torch.LongTensor([points.shape[0] for points in points_list])
    points = torch.cat(points_list, dim=0)

    if batch_size == 1:
        # remove wrapping brackets if batch_size is 1
        for key, value in collated_dict.items():
            collated_dict[key] = value[0]

    if normals is not None:
        collated_dict['normals'] = normals
    collated_dict['features'] = feats
    if precompute_data:
        input_dict = precompute_data_stack_mode(points, lengths, num_stages, voxel_size, search_radius, neighbor_limits)
        collated_dict.update(input_dict)
    else:
        collated_dict['points'] = points
        collated_dict['lengths'] = lengths
    collated_dict['batch_size'] = batch_size

    return collated_dict

# step into 1.2.1配准整理函数（用于整理数据），一般来说是把numpy等转换成tensor
def registration_collate_fn_stack_mode(
    data_dicts, num_stages, voxel_size, search_radius, neighbor_limits, precompute_data=True
):
    r"""Collate function for registration in stack mode.

    Points are organized in the following order: [ref_1, ..., ref_B, src_1, ..., src_B].
    The correspondence indices are within each point cloud without accumulation.

    Args:
        data_dicts (List[Dict])
        num_stages (int)
        voxel_size (float)
        search_radius (float)
        neighbor_limits (List[int])
        precompute_data (bool)

    Returns:
        collated_dict (Dict)
    """
    batch_size = len(data_dicts)  # 从传进来的一个batch读出batch_size（1）
    # merge data with the same key from different samples into a list
    collated_dict = {}
    for data_dict in data_dicts:  # 从batch里拿出每个数据
        for key, value in data_dict.items():
            if isinstance(value, np.ndarray):
                value = torch.from_numpy(value)  # 变成tensor
            if key not in collated_dict:
                collated_dict[key] = []  # 建立一个新key
            collated_dict[key].append(value)

    # handle special keys: [ref_feats, src_feats] -> feats, [ref_points, src_points] -> points, lengths
    feats = torch.cat(collated_dict.pop('ref_feats') + collated_dict.pop('src_feats'), dim=0)  # pop会删除对应key，返回其value
    points_list = collated_dict.pop('ref_points') + collated_dict.pop('src_points')  # 一个[两个列表]
    lengths = torch.LongTensor([points.shape[0] for points in points_list])  # (2,.):(ref点数量，src点数量)
    points = torch.cat(points_list, dim=0)  # 合成一整个，分界点通过lengths来找

    if 'ref_dps' in collated_dict:
        dps_list = collated_dict.pop('ref_dps') + collated_dict.pop('src_dps')
        dps = torch.cat(dps_list, dim=0)

    if batch_size == 1:
        # remove wrapping brackets if batch_size is 1 ：把中括号去了
        for key, value in collated_dict.items():
            collated_dict[key] = value[0]

    collated_dict['features'] = feats
    if precompute_data:
        # step into 1.2.1.1 ： 预计算数据
        input_dict = precompute_data_stack_mode(points, dps, lengths, num_stages, voxel_size, search_radius, neighbor_limits)
        # input_dict :
        # {
        #     'points': points_list,
        #     'dps': dps_list,
        #     'lengths': lengths_list,
        #     'neighbors': neighbors_list,
        #     'subsampling': subsampling_list,
        #     'upsampling': upsampling_list,
        # }
        # input_dict = precompute_data_stack_mode(points, lengths, num_stages, voxel_size, search_radius, neighbor_limits)
        collated_dict.update(input_dict)  # 拓展字典
    else:
        collated_dict['points'] = points
        collated_dict['lengths'] = lengths
    collated_dict['batch_size'] = batch_size

    return collated_dict

# step into 1.2 ：计算邻点限制
def calibrate_neighbors_stack_mode(
    dataset, collate_fn, num_stages, voxel_size, search_radius, keep_ratio=0.8, sample_threshold=2000
):
    # Compute higher bound of neighbors number in a neighborhood
    hist_n = int(np.ceil(4 / 3 * np.pi * (search_radius / voxel_size + 1) ** 3))  # 单位球内的体素个数
    neighbor_hists = np.zeros((num_stages, hist_n), dtype=np.int32)
    max_neighbor_limits = [hist_n] * num_stages  # 这个是把一个数复制num_stages遍放在列表里

    # Get histogram of neighborhood sizes i in 1 epoch max.
    for i in range(len(dataset)):
        # step into 1.2.1配准整理函数（用于整理数据）（一般来说是这个函数）
        data_dict = collate_fn(
            [dataset[i]], num_stages, voxel_size, search_radius, max_neighbor_limits, precompute_data=True
        )

        # update histogram
        counts = [np.sum(neighbors.numpy() < neighbors.shape[0], axis=1) for neighbors in data_dict['neighbors']]  # 这个是在计算有用点的个数（因为没用点都等于shape[0]）【4】（60000，）……
        hists = [np.bincount(c, minlength=hist_n)[:hist_n] for c in counts]  # 【4】（hist_n,）是临点个数为0—hist_n的点分别有多少个
        # np.bincount是统计从0到array数组中最大数字出现的个数的函数，并同样以array数组输出显示，设最大数字是n，则返回数组（n+1,）每个元素是对应数字出现个数
        # minlength是限制返回列表最短长度，不够用0填
        neighbor_hists += np.vstack(hists)  # 按照行垂直（行）方向来堆叠数组，这是在加另一个npy中的点云数据？？？ （4,180）

        if np.min(np.sum(neighbor_hists, axis=1)) > sample_threshold:  # 如果最后一个阶段的累加点的个数都已经超过了定好的阈值，则break
            break

    cum_sum = np.cumsum(neighbor_hists.T, axis=0)  # 按axis方向进行前n项求和，输出和原先数组一致
    # 这里的效果是临点数都计算小于等于该临点数的总邻点数（180,4）

    # 计算四个阶段每个阶段分别需要限制多少个临点才能保证所有点都取在keep_ratio比例下
    neighbor_limits = np.sum(cum_sum < (keep_ratio * cum_sum[hist_n - 1, :]), axis=0)  #　这个keep_ratio是对应论文哪里？？？

    return neighbor_limits

# step into 1.3 :dataloader
def build_dataloader_stack_mode(
    dataset,
    collate_fn,
    num_stages,
    voxel_size,
    search_radius,
    neighbor_limits,
    batch_size=1,
    num_workers=1,
    shuffle=False,
    drop_last=False,
    distributed=False,
    precompute_data=True,
):
    # step into 1.3.1 :dataloader
    dataloader = build_dataloader(
        dataset,
        batch_size=batch_size,
        num_workers=num_workers,
        shuffle=shuffle,
        collate_fn=partial(  # 就是产生一个新函数，这个函数的一些参数是固定好的
            collate_fn,
            num_stages=num_stages,
            voxel_size=voxel_size,
            search_radius=search_radius,
            neighbor_limits=neighbor_limits,
            precompute_data=precompute_data,
        ),
        drop_last=drop_last,
        distributed=distributed,
    )
    return dataloader
