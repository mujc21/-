import open3d as o3d
import numpy as np
import os
import utility_reg

def mesh2pcd(obj_name):
    # 读取 OBJ 文件
    mesh = o3d.io.read_triangle_mesh(obj_name)

    # 确保 mesh 是三角化的
    if not mesh.has_triangles():
        mesh = mesh.triangulate()

    # 对 mesh 进行采样，这里使用泊松磁盘采样方法
    # number_of_points 是你想要采样的点的数量
    # init_factor 是初始化泊松磁盘采样的因子，通常设置为5到10
    # 你可以根据需要调整这些参数
    # pcd = mesh.sample_points_poisson_disk(number_of_points=200000, init_factor=5)
    # 均匀采样
    pcd = mesh.sample_points_uniformly(number_of_points=200000)

    o3d.io.write_point_cloud('test/tmp2.ply', pcd)

