import os.path

import numpy as np
import open3d as o3d
import utility_reg
import numpy
import mytool
import torch
import os.path as osp
import pickle
import pdb
from vedo import *
rootdir = 'D:\\UniversityFiles\\otherworks\\my_data\\data'
with open('3DLoMatch.pkl', 'rb') as f:
    # 1469:1709
    # data = pickle.load(f)[1500:1709]
    data = pickle.load(f)
    check = [1625, 1527, 1295]
    for i in check:
        i = 1001
        item = data[i]
        print(i)
        #     rotation = item['rotation']
        #     translation = item['translation']
        #     ref = np.load(osp.join(rootdir, item['pcd0']))
        #     src = np.load(osp.join(rootdir, item['pcd1']))
        #     src = utility_reg.apply_transform_np(src, rotation=rotation, translation=translation)
        #     utility_reg.draw_registration_result_point_with_color(src, ref, use_color0=True)
        #     utility_reg.draw_registration_result_point_with_color(src, ref, use_color0=True, use_color1=True)
        rotation = item['rotation']
        translation = item['translation']
        ref = np.load(osp.join(rootdir, item['pcd0']))
        src = np.load(osp.join(rootdir, item['pcd1']))

        # utility_reg.draw_single_pcd(ref, use_color=True)
        # utility_reg.draw_single_pcd(ref)
        # utility_reg.draw_single_pcd(src, use_color=True)
        # utility_reg.draw_single_pcd(src)
        src = utility_reg.apply_transform_np(src, rotation=rotation, translation=translation)
        utility_reg.draw_single_pcd(src, True)
        utility_reg.draw_registration_result_point_with_color(src, ref, use_color0=True)
        # utility_reg.draw_registration_result_point_with_color(src, ref)
        # utility_reg.draw_registration_result_point_with_color(src, ref, use_color0=True, use_color1=True)
