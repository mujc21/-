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
view_scene('local_models/'+args[1].split('/')[-1], args[2], args[3])