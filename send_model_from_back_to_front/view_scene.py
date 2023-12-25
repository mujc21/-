import utility_reg
import numpy as np
import open3d as o3d
import os
import sys


def view_scene(filestring, use_color=True, edit=False):
    filestring=filestring.split('_')
    rank_num=int(filestring[0])
    col_num=int(filestring[1])
    np_list=[]
    for i in range(rank_num):
        temp_list=[]
        for j in range(col_num):
            temp_list.append(float(filestring[i*col_num+j+2]))
        np_list.append(temp_list)

    pcd = np.array(np_list)
    print(pcd)

    pcd = utility_reg.n2o(pcd)
    if not use_color:
        pcd.paint_uniform_color(utility_reg.get_color('custom_yellow'))
    pcd.estimate_normals()
    if edit:
        o3d.visualization.draw_geometries_with_editing([pcd])
    else:
        o3d.visualization.draw_geometries([pcd])


def save_npy(filepath):
    pcd = o3d.io.read_point_cloud(filepath)
    pcd = utility_reg.ply2npy(pcd)
    os.remove(filepath)
    filepath = filepath.replace('.ply', '.npy')
    np.save(filepath, pcd)
    filepath = filepath.replace('.npy', '.json')
    if os.path.exists(filepath):
        os.remove(filepath)


# 获取命令行参数列表
args = sys.argv
# 判断是否有足够的参数
if len(args) > 1:
    # 获取第一个参数
    param1 = args[1]
    param1=str(param1)
    if len(args)>2:
        param2=args[2]
        if param2=='false' or param2== 'False':
            param2=False
        else:
            param2=True
        if len(args)>3:
            param3=args[3]
            if param3=='false' or param3== 'False':
                param3=False
            else:
                param3=True
        else:
            param3=True
    else:
        param2=True
        param3=True
else:
    param1 = ''
    param2 = True
    param3 = True


param1=input()
view_scene(param1, param2, param3)
