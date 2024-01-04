from functools import partial
from tkinter import Tk
from tkinter.filedialog import asksaveasfilename, askopenfilename
import utility_reg
import numpy as np
import open3d as o3d
import shutil
import crop_png
import os
import platform

pcd_glob = None

def take_png(vis):
    global pcd_glob
    vis.capture_screen_image("./upload_picture.png")
    o3d.io.write_point_cloud('./upload_model.ply', utility_reg.n2o(pcd_glob))
    crop_png.crop_png_save("./upload_picture.png")
    return False

def main():
    Tk().withdraw()

    if os.path.exists("./upload_picture.png"):
        os.remove("./upload_picture.png")
    
    if os.path.exists("./upload_model.ply"):
        os.remove("./upload_model.ply")
    
    # 文件对话框以选择点云文件
    filename1 = askopenfilename(title="选择要上传的点云(ply)", filetypes=[("Numpy files", "*.ply")])

    if filename1 != '':
        pcd = o3d.io.read_point_cloud(filename1)
        pcd = utility_reg.o2n(pcd)
        global pcd_glob
        pcd_glob = np.copy(pcd)
        pcd = utility_reg.n2o(pcd)
        
        # 创建一个可视化窗口
        vis = o3d.visualization.VisualizerWithKeyCallback()
        
        # 将点云添加到可视化器
        vis.create_window(window_name="请为上传的三维模型截取预览图，按P截图")
        vis.add_geometry(pcd)
        
        # 注册键盘回调函数
        if platform.system() == 'Darwin':
            vis.register_key_callback(ord("P"), partial(take_png, vis))
        elif platform.system() == 'Windows':
            vis.register_key_callback(ord("P"), take_png)
        
        # 开始可视化
        vis.run()

if __name__ == "__main__":
    main()



