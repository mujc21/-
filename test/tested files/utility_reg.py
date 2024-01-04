import glob
import os

import imageio
import open3d as o3d
import numpy as np
import time
import math,random
from math import sin, cos
import torch
import matplotlib as plt
import cv2

voxel_size = 1.0
ransac_n = 3
distance_threshold = 1.8
num_iter = 10000

def read_ply_get_npy(file_path):
    pcd = o3d.io.read_point_cloud(file_path)
    pcd = o2n(pcd)
    return pcd

def n2o(__points) -> o3d.geometry.PointCloud:
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(__points[:, :3])
    if __points.shape[1] == 6:
        pcd.colors = o3d.utility.Vector3dVector(__points[:, 3:])
    return pcd

def o2n(__pcd):
    return np.concatenate((np.asarray(__pcd.points), np.asarray(__pcd.colors)), axis=-1)

def get_color(color_name):
    if color_name == "custom_yellow":
        return np.asarray([255.0, 204.0, 102.0]) / 255.0
    if color_name == "custom_blue":
        return np.asarray([102.0, 153.0, 255.0]) / 255.0
    assert color_name in plt.colors.CSS4_COLORS
    return np.asarray(plt.colors.to_rgb(plt.colors.CSS4_COLORS[color_name]))





