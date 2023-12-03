import open3d as o3d
import numpy as np
import utility_reg

def pick_points(pcd):
    print("")
    print("1) Please pick points using [shift + left click]")
    print("   Press [shift + right click] to undo point picking")
    print("2) After picking points, press 'Q' to close the window")
    vis = o3d.visualization.VisualizerWithEditing()
    vis.create_window()
    vis.add_geometry(pcd)
    vis.run()  # user picks points
    vis.destroy_window()
    print("")
    return vis.get_picked_points()

# 创建一个随机点云
pcd1 = np.load('output/my_src_740.npy')
n1 = len(pcd1)
# pcd1 = utility_reg.n2o(pcd1)

pcd2 = np.load('output/my_ref_740.npy')
n2 = len(pcd2)
# pcd2 = utility_reg.n2o(pcd2)

pcd = np.concatenate((pcd1, pcd2), axis=0)
pcd = utility_reg.n2o(pcd)


def move_points_right(vis):
    params = vis.get_view_control().convert_to_pinhole_camera_parameters()
    front = params.extrinsic[:3, 2]  # 第三列是front向量
    up = params.extrinsic[:3, 1]  # 第二列是up向量
    # 计算右侧的方向
    right = np.cross(front, up)
    print(right)
    points = np.asarray(pcd.points)
    points[-n2:] += right * 0.1

    # 更新点云的点
    pcd.points = o3d.utility.Vector3dVector(points)
    vis.update_geometry(pcd)
    vis.poll_events()
    vis.update_renderer()
    return False
def move_points_left(vis):
    # 移动后n2个点
    points = np.asarray(pcd.points)
    # 移动后n2个点
    points[-n2:] += np.array([0.1, 0, 0])  # 向x轴正方向移动
    # 更新点云的点
    pcd.points = o3d.utility.Vector3dVector(points)
    vis.update_geometry(pcd)
    vis.poll_events()
    vis.update_renderer()
    return False
def move_points_up(vis):
    # 移动后n2个点
    points = np.asarray(pcd.points)
    # 移动后n2个点
    points[-n2:] += np.array([0.1, 0, 0])  # 向x轴正方向移动
    # 更新点云的点
    pcd.points = o3d.utility.Vector3dVector(points)
    vis.update_geometry(pcd)
    vis.poll_events()
    vis.update_renderer()
    return False
def move_points_down(vis):
    # 移动后n2个点
    points = np.asarray(pcd.points)
    # 移动后n2个点
    points[-n2:] += np.array([0.1, 0, 0])  # 向x轴正方向移动
    # 更新点云的点
    pcd.points = o3d.utility.Vector3dVector(points)
    vis.update_geometry(pcd)
    vis.poll_events()
    vis.update_renderer()
    return False

# 创建一个可视化器
vis = o3d.visualization.VisualizerWithKeyCallback()
# 添加点云到可视化器
vis.create_window()
vis.add_geometry(pcd)
# 添加键盘回调函数
vis.register_key_callback(ord("w"), move_points_up)
vis.register_key_callback(ord("S"), move_points_down)
vis.register_key_callback(ord("A"), move_points_left)
vis.register_key_callback(ord("D"), move_points_right)
# 运行可视化器
vis.run()
