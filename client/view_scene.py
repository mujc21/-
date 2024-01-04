import utility_reg
import paramiko
import numpy as np
import open3d as o3d
import os
import sys


def view_scene(filepath, use_color=True, edit=False):
    pcd = o3d.io.read_point_cloud(filepath)
    if not use_color:
        pcd.paint_uniform_color(utility_reg.get_color('custom_yellow'))
    pcd.estimate_normals()
    if edit:
        o3d.visualization.draw_geometries_with_editing([pcd])
    else:
        o3d.visualization.draw_geometries([pcd])

args = sys.argv

args = sys.argv
 
# 判断是否有足够的参数
if len(args) > 1:
    # 获取第一个参数
    # param1 = args[1]
    # param1=str(param1)
    if len(args)>2:
        param2=args[2]
        if param2=='false' or param2=='False':
            param2=False
        else:
            param2=True
        if len(args)>3:
            param3=args[3]
            if param3=='false' or param3=='False':
                param3=False
            else:
                param3=True
        else:
            param3=True
    else:
        param2=True
else:
    # param1 = ''
    param2=True
    param3=True

view_scene('./local_models/'+args[1].split('/')[-1], param2, param3)