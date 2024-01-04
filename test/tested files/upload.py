from tkinter import Tk
from tkinter.filedialog import asksaveasfilename, askopenfilename
import utility_reg
import numpy as np
import open3d as o3d
import os
import crop_png

pcd_glob = None

def take_png(vis):
    global pcd_glob
    vis.capture_screen_image("test/screenshot1.png")
    vis.destroy_window()
    o3d.io.write_point_cloud('test/out1.ply', utility_reg.n2o(pcd_glob))
    crop_png.crop_png_save("test/screenshot1.png")
    return False


def upload_pcd():
    global pcd_glob
    Tk().withdraw()
    # 弹出第一个文件选择对话框
    filename1 = askopenfilename(title="选择要上传的点云(ply)", filetypes=[("Numpy files", "*.ply")])
    pcd = o3d.io.read_point_cloud(filename1)
    pcd = utility_reg.o2n(pcd)
    pcd_glob = np.copy(pcd)
    pcd = utility_reg.n2o(pcd)
    # 创建一个可视化器
    vis = o3d.visualization.VisualizerWithKeyCallback()
    # 添加点云到可视化器
    vis.create_window(window_name="请为上传的三维模型截取预览图，按P截图")
    vis.add_geometry(pcd)
    # 添加键盘回调函数
    vis.register_key_callback(ord("P"), take_png)

    # 运行可视化器
    vis.run()

if __name__ == '__main__':
    file = upload_pcd()



