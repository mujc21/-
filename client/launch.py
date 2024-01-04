import open3d as o3d
import numpy as np
import utility_reg
import crop_png
import sys
import time


def take_png(vis):
    file_name_time=str(time.time())
    png_path="output_screen_image/"+file_name_time+".png"
    vis.capture_screen_image(png_path)
    vis.destroy_window()
    crop_png.crop_png_save(png_path)

    print(png_path)

    return False

def launch_scene(filepath):

    pcd = np.load(filepath)
    pcd = utility_reg.n2o(pcd)
    # 创建一个可视化器
    vis = o3d.visualization.VisualizerWithKeyCallback()
    # 添加点云到可视化器
    vis.create_window(window_name="请为发布的三维模型截取预览图，按P截图")
    vis.add_geometry(pcd)
    # 添加键盘回调函数
    vis.register_key_callback(ord("P"), take_png)

    # 运行可视化器
    vis.run()


# 获取命令行参数列表
args = sys.argv
# 判断是否有足够的参数
if len(args) > 1:
    # 获取第一个参数
    param1 = args[1]
    param1=str(param1)
else:
    param1 = ''

launch_scene(param1)