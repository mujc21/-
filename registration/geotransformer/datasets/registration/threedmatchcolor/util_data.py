import open3d as o3d
import numpy as np
import copy
# from helpers import *
from sklearn.neighbors import KDTree
import open3d as o3d
# from geotransformer.datasets.registration.threedmatchcolor.utility import *
# from utility_reg import *
# from utility_reg import run_icp
import os.path as osp

import torch
import open3d as o3d
import numpy as np
from scipy.spatial.transform import Rotation
from geotransformer.modules.ops import apply_transform

def t2n(__tensor):
    return __tensor.detach().cpu().numpy()

def n2t(__nparray, __dtype=None):
    if __dtype is not None:
        return torch.tensor(__nparray, dtype=__dtype)
    else:
        return torch.tensor(__nparray)

def n2o(__points, __colors=None):  # __points:(n,3)
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(__points)
    if __colors is not None:
        pcd.colors = o3d.utility.Vector3dVector(__colors)  # (n,3)
    return pcd

def o2n(__pcd):
    return np.asarray(__pcd.points), np.asarray(__pcd.colors)

def color2hue(__color):
    max, idx = torch.max(__color, 1)
    min, _ = torch.min(__color, 1)

    delta = max - min
    invia = (max == min)

    R = __color[:, 0]
    G = __color[:, 1]
    B = __color[:, 2]

    mask_R = (idx == 0)
    mask_G = (idx == 1)
    mask_B = (idx == 2)

    _H_R = (G-B) / delta
    _H_G = 2.0 + (B - R) / delta
    _H_B = 4.0 + (R - G) / delta
    _H = _H_R * mask_R + _H_G * mask_G + _H_B * mask_B
    _H[invia] = 0
    _H = _H * 60
    mask_neg = (_H < 0)
    mask_exc = (_H > 360)
    _H[mask_neg] += 360
    _H[mask_exc] -= 360
    # H = (_H + 360) *

    return _H




def draw_pc_np(__pc, __color=None):
    pcd = n2o(__pc, __color)
    # color_np = np.zeros((N, 3))
    # color_np[idx_0] = 0
    # color_np[idx_0, 2] = 1
    # pcd.points = o3d.utility.Vector3dVector(pc_np)
    # # pcd.colors = o3d.utility.Vector3dVector(color_np)
    o3d.visualization.draw_geometries([pcd])

    # return None

def np_normalize(vec, soft=False):
    lv = np.sum(vec ** 2, axis=1)
    mask = (lv ==0)
    vec[mask, :]=np.random.randn(np.sum(mask), 3)
    lv = np.sum(vec ** 2, axis=1)
    lv = np.sqrt(lv)
    # lv[lv == 0] = 0.1
    lv = np.expand_dims(lv, axis=1)
    vec = vec / lv
    return vec

def vec_len(vec):
    lv = np.sum(vec ** 2, axis=1)
    lv = np.sqrt(lv)
    lv = np.expand_dims(lv, axis=1)

    return lv

def npmat2euler(mats, seq='zyx'):
    eulers = []
    for i in range(mats.shape[0]):
        r = Rotation.from_matrix(mats[i])
        eulers.append(r.as_euler(seq, degrees=True))
    return np.asarray(eulers, dtype='float32')

def load_meta(meta_path='/home2/lirenjie/GeoTransformer/mydata/raw/meta.txt', sampleN = -1):

    # meta_path = './data/sampled/meta.txt'

    # sampleN = 1000
    # sampleN = 40
    eps = 0.1
    with open(meta_path, 'r') as fin:
        meta = fin.readlines()
        meta = meta[:sampleN]
        meta = map(lambda x: x.split(','), meta)
        meta = [(x[0], x[2], x[3], x[4]) for x in meta]
    print(meta)
    meta = meta[:sampleN]
    return meta

def load_my_data(meta, frame_id,meta_path = '/home2/lirenjie/GeoTransformer/mydata/raw/meta.txt', return_preffix=False):
    # meta_path = load_meta()
    # 497,500,

    path_pref = '/'.join(meta_path.split('/')[:-1])
    meta0 = meta[frame_id]
    pc1 = np.load(osp.join(path_pref, meta0[1]))
    pc2 = np.load(osp.join(path_pref, meta0[2]))
    gt_t = np.load(osp.join(path_pref, meta0[3]))

    pc1_p, pc1_c = pc1[:, :3], pc1[:, 3:]
    pc2_p, pc2_c = pc2[:, :3], pc2[:, 3:]

    pcd1 = n2o(pc1_p, pc1_c)
    pcd2 = n2o(pc2_p, pc2_c)

    if return_preffix:
        return pcd1, pcd2, gt_t, path_pref
    else:
        return pcd1, pcd2, gt_t



def load_dp_meta(meta_path='/home2/lirenjie/GeoTransformer/mydata/raw/dp_meta.txt', sampleN = -1):
    # step into 1.1.1.1 ：load——meta
    # meta_path = './data/sampled/meta.txt'

    # sampleN = 1000
    # sampleN = 40
    eps = 0.1
    with open(meta_path, 'r') as fin:
        meta = fin.readlines()  # 返回一个列表
        meta = meta[:sampleN]  # 只舍去最后一行？
        meta = list(map(lambda x: tuple(y.strip() for y in x.split(',')), meta))  # 返回一个函数作用后的列表，每一行变成了一个元组，每一项是，分割每一行后去除头尾空串

        # meta = [(x[0], x[2], x[3], x[4]) for x in meta]
    # print(meta)
    meta = meta[:sampleN]  # 又删去了最后一个？？？
    return meta

def load_my_data(meta, frame_id, meta_path = '/home2/lirenjie/GeoTransformer/mydata/raw/dp_meta.txt', return_preffix=False):
    # step into 1.1.1.2.1 ：加载

    # meta_path = load_meta()
    # 497,500,

    path_pref = '/'.join(meta_path.split('/')[:-1])  # 删了最后一个具体文件路径
    meta0 = meta[frame_id]
    pc1 = np.load(osp.join(path_pref, meta0[1]))  # 第一个点云
    pc2 = np.load(osp.join(path_pref, meta0[2]))  # 第二个点云
    # 这三个是什么？？？？
    gt_t = np.load(osp.join(path_pref, meta0[3]))
    dp1 = np.load(osp.join(path_pref, meta0[4]))
    dp2 = np.load(osp.join(path_pref, meta0[5]))
    # 拆成了xyz和后面的颜色信息
    pc1_p, pc1_c = pc1[:, :3], pc1[:, 3:]
    pc2_p, pc2_c = pc2[:, :3], pc2[:, 3:]


    # 下面这两个是返回的open3D的pcd对象，里面蕴含点云的位置(points) 、颜色(color)
    pcd1 = n2o(pc1_p, pc1_c)
    pcd2 = n2o(pc2_p, pc2_c)

    if return_preffix:
        return pcd1, pcd2, gt_t, dp1, dp2, path_pref
    else:
        return pcd1, pcd2, gt_t, dp1, dp2
