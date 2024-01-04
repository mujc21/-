import open3d as o3d
import numpy as np
import utility_reg

from tkinter import Tk
from tkinter.filedialog import asksaveasfilename, askopenfilename
import crop_png
degree = 10
step = 0.1
n2 = 0

def composite_pcd(filename1, filename2):
    global degree
    global step
    global n2
    degree = 10
    step = 0.1
    # 初始化Tkinter窗口，但不显示
    Tk().withdraw()

    # 弹出第一个文件选择对话框
    # filename1 = askopenfilename(title="选择第一片点云(npy)", filetypes=[("Numpy files", "*.npy")])
    #
    # # 弹出第二个文件选择对话框
    # filename2 = askopenfilename(title="选择第二片点云(npy)", filetypes=[("Numpy files", "*.npy")])
    #
    # if not filename1 or not filename2:
    #     return

    # 加载并处理文件
    pcd1 = utility_reg.read_ply_get_npy(filename1)
    pcd2 = utility_reg.read_ply_get_npy(filename2)
        # 在这里添加你的代码来处理data1和data2
    # 创建一个随机点云
    # pcd1 = np.load(pcd1_path)
    #
    # pcd2 = np.load(pcd2_path)
    n2 = len(pcd2)

    pcd = np.concatenate((pcd1, pcd2), axis=0)
    pcd = utility_reg.n2o(pcd)

    # def move_points_right(vis):
    #     params = vis.get_view_control().convert_to_pinhole_camera_parameters()
    #     front = params.extrinsic[:3, 2]  # 第三列是front向量
    #     up = params.extrinsic[:3, 1]  # 第二列是up向量
    #     # 计算右侧的方向
    #     right = np.cross(front, up)
    #     print(right)
    #     points = np.asarray(pcd.points)
    #     points[-n2:] += right * 0.1
    #
    #     # 更新点云的点
    #     pcd.points = o3d.utility.Vector3dVector(points)
    #     vis.update_geometry(pcd)
    #     vis.poll_events()
    #     vis.update_renderer()
    #     return False



    def add_step(vis):
        global step
        step = step + 0.01
        print(step)

    def minus_step(vis):
        global step
        if step > 1e-4:
            step = step - 0.01
        print(step)


    def x_plus(vis):
        # 移动后n2个点
        points = np.asarray(pcd.points)
        # 移动后n2个点
        points[-n2:] += np.array([step, 0, 0])  # 向x轴正方向移动
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False

    def x_minus(vis):
        # 移动后n2个点
        points = np.asarray(pcd.points)
        # 移动后n2个点
        points[-n2:] -= np.array([step, 0, 0])  # 向x轴正方向移动
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False

    def y_plus(vis):
        # 移动后n2个点
        points = np.asarray(pcd.points)
        # 移动后n2个点
        points[-n2:] += np.array([0, step, 0])  # 向x轴正方向移动
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False

    def y_minus(vis):
        # 移动后n2个点
        points = np.asarray(pcd.points)
        # 移动后n2个点
        points[-n2:] -= np.array([0, step, 0])  # 向x轴正方向移动
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False

    def z_plus(vis):
        # 移动后n2个点
        points = np.asarray(pcd.points)
        # 移动后n2个点
        points[-n2:] += np.array([0, 0, step])  # 向x轴正方向移动
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False

    def z_minus(vis):
        # 移动后n2个点
        points = np.asarray(pcd.points)
        # 移动后n2个点
        points[-n2:] -= np.array([0, 0, step])  # 向x轴正方向移动
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False




    def rotate_x_plus(vis):
        # 获取点云
        points_ori = np.asarray(pcd.points)

        points = points_ori[-n2:]
        # 计算质心
        centroid = points.mean(axis=0)

        # 创建旋转矩阵
        theta = np.radians(degree)  # 将角度转换为弧度
        rotation_matrix = np.array([[1, 0, 0],
                                    [0, np.cos(theta), -np.sin(theta)],
                                    [0, np.sin(theta), np.cos(theta)]])

        # 将点云移动到原点，旋转，然后移动回原来的位置
        points = points - centroid  # 移动到原点
        points = np.dot(points, rotation_matrix)  # 旋转
        points = points + centroid  # 移动回原来的位置

        points_ori[-n2:] = points
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points_ori)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False

    def rotate_x_minus(vis):
        # 获取点云
        points_ori = np.asarray(pcd.points)

        points = points_ori[-n2:]
        # 计算质心
        centroid = points.mean(axis=0)

        # 创建旋转矩阵
        theta = np.radians(-degree)  # 将角度转换为弧度
        rotation_matrix = np.array([[1, 0, 0],
                                    [0, np.cos(theta), -np.sin(theta)],
                                    [0, np.sin(theta), np.cos(theta)]])

        # 将点云移动到原点，旋转，然后移动回原来的位置
        points = points - centroid  # 移动到原点
        points = np.dot(points, rotation_matrix)  # 旋转
        points = points + centroid  # 移动回原来的位置

        points_ori[-n2:] = points
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points_ori)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False

    def rotate_y_plus(vis):
        # 获取点云
        points_ori = np.asarray(pcd.points)

        points = points_ori[-n2:]
        # 计算质心
        centroid = points.mean(axis=0)

        # 创建旋转矩阵
        theta = np.radians(degree)  # 将角度转换为弧度
        rotation_matrix = np.array([[np.cos(theta), 0, np.sin(theta)],
                                      [0, 1, 0],
                                      [-np.sin(theta), 0, np.cos(theta)]])

        # 将点云移动到原点，旋转，然后移动回原来的位置
        points = points - centroid  # 移动到原点
        points = np.dot(points, rotation_matrix)  # 旋转
        points = points + centroid  # 移动回原来的位置

        points_ori[-n2:] = points
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points_ori)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False

    def rotate_y_minus(vis):
        # 获取点云
        points_ori = np.asarray(pcd.points)

        points = points_ori[-n2:]
        # 计算质心
        centroid = points.mean(axis=0)

        # 创建旋转矩阵
        theta = np.radians(-degree)  # 将角度转换为弧度
        rotation_matrix = np.array([[np.cos(theta), 0, np.sin(theta)],
                                    [0, 1, 0],
                                    [-np.sin(theta), 0, np.cos(theta)]])

        # 将点云移动到原点，旋转，然后移动回原来的位置
        points = points - centroid  # 移动到原点
        points = np.dot(points, rotation_matrix)  # 旋转
        points = points + centroid  # 移动回原来的位置

        points_ori[-n2:] = points
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points_ori)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False


    def rotate_z_plus(vis):
        # 获取点云
        points_ori = np.asarray(pcd.points)

        points = points_ori[-n2:]
        # 计算质心
        centroid = points.mean(axis=0)

        # 创建旋转矩阵
        theta = np.radians(degree)  # 将角度转换为弧度
        rotation_matrix = np.array([[np.cos(theta), -np.sin(theta), 0],
                                      [np.sin(theta), np.cos(theta), 0],
                                      [0, 0, 1]])

        # 将点云移动到原点，旋转，然后移动回原来的位置
        points = points - centroid  # 移动到原点
        points = np.dot(points, rotation_matrix)  # 旋转
        points = points + centroid  # 移动回原来的位置

        points_ori[-n2:] = points
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points_ori)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False

    def rotate_z_minus(vis):
        # 获取点云
        points_ori = np.asarray(pcd.points)

        points = points_ori[-n2:]
        # 计算质心
        centroid = points.mean(axis=0)

        # 创建旋转矩阵
        theta = np.radians(-degree)  # 将角度转换为弧度
        rotation_matrix = np.array([[np.cos(theta), -np.sin(theta), 0],
                                    [np.sin(theta), np.cos(theta), 0],
                                    [0, 0, 1]])

        # 将点云移动到原点，旋转，然后移动回原来的位置
        points = points - centroid  # 移动到原点
        points = np.dot(points, rotation_matrix)  # 旋转
        points = points + centroid  # 移动回原来的位置

        points_ori[-n2:] = points
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points_ori)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False



    def scale_up(vis):
        # 获取点云
        points_ori = np.asarray(pcd.points)

        points = points_ori[-n2:]
        # 计算质心
        centroid = points.mean(axis=0)

        # 将点云移动到原点，旋转，然后移动回原来的位置
        points = points - centroid  # 移动到原点

        points = points * 1.1


        points = points + centroid  # 移动回原来的位置

        points_ori[-n2:] = points
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points_ori)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False


    def scale_down(vis):
        # 获取点云
        points_ori = np.asarray(pcd.points)

        points = points_ori[-n2:]
        # 计算质心
        centroid = points.mean(axis=0)

        # 将点云移动到原点，旋转，然后移动回原来的位置
        points = points - centroid  # 移动到原点

        points = points * 0.9

        points = points + centroid  # 移动回原来的位置

        points_ori[-n2:] = points
        # 更新点云的点
        pcd.points = o3d.utility.Vector3dVector(points_ori)
        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False





    def add_degree(vis):
        global degree
        degree = degree + 1
        print(degree)

    def minus_degree(vis):
        global degree
        if degree > 1e-4:
            degree = degree - 1
        print(degree)

    def change_pcd(vis):
        global n2
        # 获取点云
        points = np.asarray(pcd.points)
        points_second = points[-n2:]
        points_first = points[:-n2]
        points = np.concatenate((points_second, points_first), axis=0)
        pcd.points = o3d.utility.Vector3dVector(points)

        colors = np.asarray(pcd.colors)
        colors_second = colors[-n2:]
        colors_first = colors[:-n2]
        colors = np.concatenate((colors_second, colors_first), axis=0)
        pcd.colors = o3d.utility.Vector3dVector(colors)

        n2 = len(points_first)
        # 更新点云的点

        vis.update_geometry(pcd)
        vis.poll_events()
        vis.update_renderer()
        return False


    def save(vis):
        vis.capture_screen_image("screenshot.png")
        crop_png.crop_png_save('screenshot.png')
        # 初始化Tkinter窗口，但不显示
        Tk().withdraw()

        # # 弹出保存文件对话框
        # filename = asksaveasfilename(defaultextension=".npy")
        #
        # # 如果用户输入了文件名，则保存文件
        # if filename:
        #     np.save(filename, utility_reg.o2n(pcd))
        o3d.io.write_point_cloud('test/tmp3.ply', pcd)
        vis.destroy_window()
        return False

    # 创建一个可视化器
    vis = o3d.visualization.VisualizerWithKeyCallback()
    # 添加点云到可视化器
    vis.create_window()
    vis.add_geometry(pcd)
    # 添加键盘回调函数
    vis.register_key_callback(ord("A"), x_plus)
    vis.register_key_callback(ord("S"), x_minus)
    vis.register_key_callback(ord("D"), y_plus)
    vis.register_key_callback(ord("F"), y_minus)
    vis.register_key_callback(ord("G"), z_plus)
    vis.register_key_callback(ord("H"), z_minus)
    vis.register_key_callback(ord("J"), add_step)
    vis.register_key_callback(ord("K"), minus_step)

    # 缩放
    vis.register_key_callback(ord("U"), scale_up)
    vis.register_key_callback(ord("I"), scale_down)

    vis.register_key_callback(ord("1"), rotate_x_plus)
    vis.register_key_callback(ord("2"), rotate_x_minus)
    vis.register_key_callback(ord("3"), rotate_y_plus)
    vis.register_key_callback(ord("4"), rotate_y_minus)
    vis.register_key_callback(ord("5"), rotate_z_plus)
    vis.register_key_callback(ord("6"), rotate_z_minus)
    vis.register_key_callback(ord("7"), add_degree)
    vis.register_key_callback(ord("8"), minus_degree)


    vis.register_key_callback(ord("C"), change_pcd)



    vis.register_key_callback(ord("P"), save)
    # 运行可视化器
    vis.run()

if __name__ == '__main__':
    path1 = '../pcds/room.npy'
    path2 = '../pcds/redman.npy'
    composite_pcd(path1, path2)

