import numpy as np
import matplotlib.pyplot as plt
import utility_reg
import open3d as o3d

# 创建两个示例点云
# i = [1625,1538,1527,1295,1366,1511,740]
i = 1001
# point
points1 = np.load(f'output/my_src_{i}.npy')
points2 = np.load(f'output/my_ref_{i}.npy')

# corr1 = np.load(f'output/src_corr_{i}.npy')
# corr2 = np.load(f'output/ref_corr_{i}.npy')
# right_pairs = np.load(f'output/right_pairs_{i}.npy')

# corr1 = np.load(f'output/geo_src_corr_{i}.npy')
# corr2 = np.load(f'output/geo_ref_corr_{i}.npy')
# right_pairs = np.load(f'output/geo_right_pairs_{i}.npy')


# node
# points1 = np.load(f'output/my_src_{i}.npy')
# points2 = np.load(f'output/my_ref_{i}.npy')

# corr1 = np.load(f'output/patch_src_corr_{i}.npy')
# corr2 = np.load(f'output/patch_ref_corr_{i}.npy')
# right_pairs = np.load(f'output/patch_right_pairs_{i}.npy')

# estimate_transform = np.load(f'output/estimate_transform_{i}.npy')
# src_ori = np.load(f'output/src_ori_{i}.npy')

# points1 = np.load(f'output/geo_src_{i}.npy')
# points2 = np.load(f'output/geo_ref_{i}.npy')

corr1 = np.load(f'output/patch_geo_src_corr_{i}.npy')
corr2 = np.load(f'output/patch_geo_ref_corr_{i}.npy')
right_pairs = np.load(f'output/patch_geo_right_pairs_{i}.npy')

# estimate_transform = np.load(f'output/geo_estimate_transform_{i}.npy')
# src_ori = np.load(f'output/src_ori_{i}.npy')
# points1 = utility_reg.apply_transform_np(src_ori, estimate_transform)
num = len(corr1)
transform = np.array([
    [1, 0, 0, 1],
    [0, 1, 0, -1],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
])
points1 = utility_reg.apply_transform_np(points1, transform)
corr1 = utility_reg.apply_transform_np(corr1, transform)

# 创建两个示例点云
voxel_size = 0.05
pcd1 = o3d.geometry.PointCloud()
pcd1.points = o3d.utility.Vector3dVector(points1[:, :3])



# pcd1.points = o3d.utility.Vector3dVector(utility_reg.apply_transform_np(points1[:, :3], estimate_transform))

# pcd1.colors = o3d.utility.Vector3dVector(points1[:, 3:])
pcd1.paint_uniform_color(utility_reg.get_color('custom_yellow'))
pcd1 = pcd1.voxel_down_sample(voxel_size)
pcd1.estimate_normals()




pcd2 = o3d.geometry.PointCloud()
pcd2.points = o3d.utility.Vector3dVector(points2[:, :3])
# pcd2.colors = o3d.utility.Vector3dVector(points2[:, 3:])
pcd2.paint_uniform_color(utility_reg.get_color('custom_blue'))
pcd2 = pcd2.voxel_down_sample(voxel_size)
pcd2.estimate_normals()

# 创建点云对应线
index_1 = np.array(range(num)).reshape(-1, 1)
index_2 = (index_1 + num).reshape(-1, 1)
pairs = np.concatenate((index_1, index_2), axis=1)
correspondences = o3d.utility.Vector2iVector(pairs)


points = np.concatenate((pcd1.points, pcd2.points), axis=0)
# 创建一个形状相同的三维数组，并初始化为红色 (255, 0, 0)
result = np.zeros((len(right_pairs), 3))
result[right_pairs] = [0, 1, 0]
# 将布尔值为False的行设置为红色
result[~right_pairs] = [1, 0, 0]

# 创建 Open3D Visualizer
vis = o3d.visualization.Visualizer()
vis.create_window()


sphere_radius = 0.05  # 球体的半径
colors = np.concatenate((pcd1.colors, pcd2.colors), axis=0)

for i in range(len(points)):
    point = points[i]
    sphere = o3d.geometry.TriangleMesh.create_sphere(radius=sphere_radius)
    sphere.compute_vertex_normals()
    sphere.paint_uniform_color(colors[i])
    sphere.translate(point)  # 将球体移动到点的位置
    vis.add_geometry(sphere)




lines = o3d.geometry.LineSet()
lines.points = o3d.utility.Vector3dVector(np.concatenate((corr1, corr2), axis=0))
lines.lines = correspondences
vis.add_geometry(lines)
lines.colors = o3d.utility.Vector3dVector(result)

# axes = o3d.geometry.TriangleMesh.create_coordinate_frame(size=1, origin=[0, 0, 0])
# vis.add_geometry(axes)
# 显示可视化窗口
vis.run()
vis.destroy_window()
