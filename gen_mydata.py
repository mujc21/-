import os

import numpy as np
import pickle
import torch
import utility_reg
import glob
import os.path as osp
import open3d as o3d
import argparse

# def get_3DMatch_name(txt_path):
#     with open(txt_path, 'r') as f:
#         lines = f.readlines()
#         line0 = lines[0]
#         ori_data_name = line0.split()[0]
#     return ori_data_name

def ensure_dir(path):
    if not osp.exists(path):
        os.makedirs(path)

root_dir = '/home2/mujuncheng/3DMatch'
root_items = os.listdir(root_dir)
# ori_data_list = os.listdir('/home2/mujuncheng/otherworks/GeoTransformer/data/3DMatch/data/train')
# ori_data_list = [x for x in ori_data_list if x[0] != 'a']
predator_root = "/home2/mujuncheng/otherworks/GeoTransformer/data/3DMatch/data/train"
already_have = os.listdir("/home2/mujuncheng/my_data")

data_index = 1
for root_item in root_items:
    print(root_item + f'\t:\t{data_index}/{len(root_items)}')
    data_index += 1

    match = glob.glob(osp.join(predator_root, root_item + '*'))
    match = [osp.split(x)[-1] for x in match]
    match = [x for x in match if x not in already_have]
    need_to_gen = 0
    for item in match:
        if item not in already_have:
            need_to_gen = 1
    if need_to_gen == 0:
        continue

    path = osp.join(root_dir, root_item)
    pcds = utility_reg.gen_integrated_pcd_from_rgbd_images(path)
    pcd_trees = {key: o3d.geometry.KDTreeFlann(value) for key, value in pcds.items()}
    for data in match:
        save_folder = osp.join('/home2/mujuncheng/my_data', data)
        ensure_dir(save_folder)
        predator_data_dir = osp.join(predator_root, data)
        clouds = glob.glob(osp.join(predator_data_dir, "*.pth"))
        cloud_index = 0
        NN = len(clouds)
        for cloud in clouds:
            print(f'{cloud_index}/{NN}')
            cloud_index += 1
            new_color = []
            new_points = []
            cloud_name = osp.split(cloud)[-1].replace('.pth', '.npy')
            save_path = osp.join(save_folder, cloud_name)
            txt_save_path = save_path.replace('.npy', '.info.txt')
            pose = cloud.replace('pth', 'info.txt')
            with open(pose, 'r') as f:
                with open(txt_save_path, 'w') as f2:
                    lines = f.readlines()
                    line0 = lines[0]
                    seq_id = line0.split()[1]
                    ori_data_name = line0.split()[0]
                    for line in lines[1:]:
                        f2.write(line)
            cloud_np = torch.load(cloud)
            num_point = cloud_np.shape[0]
            ones = np.ones((num_point, 1))
            new_pcd = np.concatenate([cloud_np, ones], 1)
            trans_mat = np.loadtxt(txt_save_path)
            new_pcd = trans_mat @ (np.transpose(new_pcd))
            new_pcd = np.transpose(new_pcd)[:, :3]
            for point in new_pcd:
                [_, idx, _] = pcd_trees[seq_id].search_knn_vector_3d(point, 1)
                new_color.append(np.asarray(pcds[seq_id].colors)[idx])
                new_points.append(np.asarray(pcds[seq_id].points)[idx])

            point_with_color = np.concatenate([cloud_np, np.concatenate(new_color, 0)], 1)
            # np.save("/home2/mujuncheng/pcd.npy", np.asarray(new_points))
            # np.save("/home2/mujuncheng/color.npy", np.asarray(new_color))
            np.save(save_path, point_with_color)
