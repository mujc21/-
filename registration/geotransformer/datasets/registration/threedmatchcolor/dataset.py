import os.path as osp
import pickle
import random
from typing import Dict

import numpy as np
import torch
import torch.utils.data

from geotransformer.datasets.registration.threedmatchcolor.util_data import *
# from geotransformer.datasets.registration.threedmatchcolor.utility import *

from geotransformer.utils.pointcloud import (
    random_sample_rotation,
    random_sample_rotation_v2,
    get_transform_from_rotation_translation,
)
from geotransformer.utils.registration import get_correspondences

# step into 1.1.1加载数据集
class ThreeDMatchColorPairDataset(torch.utils.data.Dataset):
    def __init__(
        self,
        meta_path,
        dataset_root,
        subset,  # ‘train’
        point_limit=None,
        use_augmentation=False,
        augmentation_noise=0.005,
        augmentation_rotation=1,
        overlap_threshold=None,
        return_corr_indices=False,
        matching_radius=None,
        rotated=False,
        sampleN = -1,
        extra_channel='dps',  # 添加梯度？？
    ):
        super(ThreeDMatchColorPairDataset, self).__init__()
        self.meta_path = meta_path
        self.dataset_root = dataset_root
        self.metadata_root = osp.join(self.dataset_root, 'metadata')
        self.data_root = osp.join(self.dataset_root, 'data')

        self.subset = subset  # ‘train’
        self.point_limit = point_limit
        # self.point_limit = 30000
        self.overlap_threshold = overlap_threshold
        self.rotated = rotated

        self.return_corr_indices = return_corr_indices
        self.matching_radius = matching_radius
        # step into 1.1.1.1 ：load——meta？？？
        self.meta = load_dp_meta(self.meta_path, sampleN)  # 是一个列表，每一项是一个9元组


        # self.meta = self.meta[:10]

        self.use_augmentation = use_augmentation
        self.aug_noise = augmentation_noise
        self.aug_rotation = augmentation_rotation
        self.extra_channel = extra_channel


        pass



    def __len__(self):
        return len(self.meta)

    def _load_point_cloud(self, file_name):
        points = torch.load(osp.join(self.data_root, file_name))
        # NOTE: setting "point_limit" with "num_workers" > 1 will cause nondeterminism.
        if self.point_limit is not None and points.shape[0] > self.point_limit:
            indices = np.random.permutation(points.shape[0])[: self.point_limit]
            points = points[indices]
        return points

    def possibly_downsample(self, points, dps, rgb):
        if self.point_limit is not None and points.shape[0] > self.point_limit:  # 需要进行下采样
            indices = np.random.permutation(points.shape[0])[: self.point_limit]  # 首先随机舍弃一些点直至满足点限制要求
            points = points[indices]  # 保留留下的点
            dps = dps[indices]
            rgb = rgb[indices]
        return points, dps, rgb

    def _augment_point_cloud(self, ref_points, src_points, ref_dps, src_dps, rotation, translation):
        # step into 1.1.1.2.3 ：点云增强--调整数据集
        r"""Augment point clouds.

        ref_points = src_points @ rotation.T + translation

        1. Random rotation to one point cloud.
        2. Random noise.
        """
        if self.subset == 'val':
            return ref_points, src_points, ref_dps, src_dps, rotation, translation
        # step into 1.1.2.3.1 : 随机旋转
        aug_rotation = random_sample_rotation(self.aug_rotation)
        if random.random() > 0.5:  # 对目标点云变换
            ref_points = np.matmul(ref_points, aug_rotation.T)  # 注意这里要转置，因为是行向量
            if self.extra_channel == 'dps':
                ref_dps = np.matmul(ref_dps, aug_rotation.T)
            # 新旋转矩阵和平移矩阵
            rotation = np.matmul(aug_rotation, rotation)
            translation = np.matmul(aug_rotation, translation)
        else:
            src_points = np.matmul(src_points, aug_rotation.T)
            if self.extra_channel == 'dps':
                src_dps = np.matmul(src_dps, aug_rotation.T)
            # 1/2的概率对源点云变换，只需要旋转，不需要平移
            rotation = np.matmul(rotation, aug_rotation.T)  # 旋转矩阵的逆等于转置
        # print('use_aug')

        # ref_points += (np.random.rand(ref_points.shape[0], 3) - 0.5) * self.aug_noise
        # src_points += (np.random.rand(src_points.shape[0], 3) - 0.5) * self.aug_noise

        return ref_points, src_points, ref_dps, src_dps, rotation, translation
    # step into 1.1.1.2 :重载[]
    def __getitem__(self, index):  # 返回一个字典
        # index = 4040
        data_dict = {}

        # metadata
        meta = self.meta
        # metadata: Dict = self.metadata_list[index]
        # data_dict['scene_name'] = metadata['scene_name']
        # data_dict['ref_frame'] = metadata['frag_id0']
        # data_dict['src_frame'] = metadata['frag_id1']
        # data_dict['overlap'] = metadata['overlap']

        # get point cloud
        # step into 1.1.1.2.1 ：加载
        A_pcd_raw, B_pcd_raw, gt_t, A_dp, B_dp = load_my_data(meta, index, meta_path=self.meta_path)  # 前两个是pcd对象，后面是梯度
        src_points, src_rgb = o2n(A_pcd_raw)  # 转成np类型
        ref_points, ref_rgb = o2n(B_pcd_raw)
        # step into 1.1.1.2.2 :如果比point_limit多，需要随机删去一些点
        src_points, src_dps, src_rgb = self.possibly_downsample(src_points, A_dp, src_rgb)
        ref_points, ref_dps, ref_rgb = self.possibly_downsample(ref_points, B_dp, ref_rgb)

        # get transformation
        rotation = gt_t[:3, :3]  # (3,3)
        translation = gt_t[:3, 3]  # (3,)


        # augmentation
        # step into 1.1.1.2.3 ：点云增强，即数据比较少或者其他原因时要进行数据扩充
        if self.use_augmentation:
            ref_points, src_points, ref_dps, src_dps, rotation, translation = self._augment_point_cloud(
                ref_points, src_points, ref_dps, src_dps, rotation, translation
            )

        # if self.rotated:
        #     ref_rotation = random_sample_rotation_v2()
        #     ref_points = np.matmul(ref_points, ref_rotation.T)
        #     rotation = np.matmul(ref_rotation, rotation)
        #     translation = np.matmul(ref_rotation, translation)
        #
        #     src_rotation = random_sample_rotation_v2()
        #     src_points = np.matmul(src_points, src_rotation.T)
        #     rotation = np.matmul(rotation, src_rotation.T)
        # 返回一个（4,4）的transform，前三行有信息，前三列是rotation，第四列是translation
        transform = get_transform_from_rotation_translation(rotation, translation)

        # get correspondences
        if self.return_corr_indices:  # 默认是false
            # 返回一个列表，列表中的元素是源点云中每个点在目标点云中距离小于半径的点的索引对：（i,j）i是源点云编号i的点，j是目标点云中距离小于r的点的编号
            corr_indices = get_correspondences(ref_points, src_points, transform, self.matching_radius)
            data_dict['corr_indices'] = corr_indices

        data_dict['ref_points'] = ref_points.astype(np.float32)
        data_dict['src_points'] = src_points.astype(np.float32)
        # 下面这俩是啥？？？？
        data_dict['ref_feats'] = np.ones((ref_points.shape[0], 1), dtype=np.float32)
        data_dict['src_feats'] = np.ones((src_points.shape[0], 1), dtype=np.float32)

        data_dict['transform'] = transform.astype(np.float32)
        data_dict['_index'] = index

        if self.extra_channel == 'dps':
            data_dict['ref_dps'] = ref_dps.astype(np.float32)
            data_dict['src_dps'] = src_dps.astype(np.float32)
        elif self.extra_channel == 'rgb':
            data_dict['ref_dps'] = ref_rgb.astype(np.float32)
            data_dict['src_dps'] = src_rgb.astype(np.float32)
            # print('using rgb')

        return data_dict
