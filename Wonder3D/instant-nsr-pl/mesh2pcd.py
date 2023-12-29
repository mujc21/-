import open3d as o3d
import numpy as np
import os


obj_name = os.listdir('exp/save')[0]
obj_path = os.path.join('exp/save', obj_name)
# 读取 OBJ 文件
mesh = o3d.io.read_triangle_mesh(obj_path)

# 确保 mesh 是三角化的


# 对 mesh 进行采样，这里使用泊松磁盘采样方法
# number_of_points 是你想要采样的点的数量
# init_factor 是初始化泊松磁盘采样的因子，通常设置为5到10
# 你可以根据需要调整这些参数
# pcd = mesh.sample_points_poisson_disk(number_of_points=200000, init_factor=5)
# 均匀采样
pcd = mesh.sample_points_uniformly(number_of_points=200000)

# 保存采样后的点云
cords = np.array(pcd.points)
colors = np.array(pcd.colors)
pcd = np.concatenate((cords, colors), -1)
np.save('../tmp.npy', pcd)

