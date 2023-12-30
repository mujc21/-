import utility_reg
import numpy as np
import open3d as o3d
import os



def view_scene(filepath, use_color=True, edit=False):
    # pcd = utility_reg.read_ply_get_npy(filepath)
    pcd = o3d.io.read_point_cloud(filepath)
    if not use_color:
        pcd.paint_uniform_color(utility_reg.get_color('custom_yellow'))
    pcd.estimate_normals()
    if edit:
        o3d.visualization.draw_geometries_with_editing([pcd])
    else:
        o3d.visualization.draw_geometries([pcd])





if __name__ == '__main__':
    filepath = '../TMP.npy'
    view_scene(filepath, edit=True)
    # save_npy('../test.ply')

