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

dp_knn = 10

def t2n(__tensor):
    return __tensor.detach().cpu().numpy()

def n2t(__nparray, __dtype=None):
    if __dtype is not None:
        return torch.tensor(__nparray, dtype=__dtype)
    else:
        return torch.tensor(__nparray)

def n2o(__points, __colors=None):
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(__points)
    if __colors is not None:
        pcd.colors = o3d.utility.Vector3dVector(__colors)
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

def load_meta(meta_path='/home/lirenjie/GeoTransformer/mydata/raw/meta.txt', sampleN=-1):

    # meta_path = './data/sampled/meta.txt'

    # sampleN = 40
    eps = 0.1
    with open(meta_path, 'r') as fin:
        meta = fin.readlines()
        meta = meta[:sampleN]
        meta = map(lambda x: x.split(','), meta)
        meta = [(x[0], x[2], x[3], x[4]) for x in meta]
    print(meta)
    meta = meta[:sampleN]
    # meta_path = meta_path[:1000]
    return meta

def load_my_data(meta, frame_id,meta_path = '/home/lirenjie/GeoTransformer/mydata/raw/meta.txt', return_preffix=False):
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


def calc_dp(pc_np):
    KNN = dp_knn
    N, _ = pc_np.shape
    pc = torch.tensor(pc_np[:, :3], dtype=torch.double)
    color_np = pc_np[:, 3:]

    color = n2t(color_np).cuda()
    hue = color2hue(color)

    pc = pc.cuda()
    pc_tree = KDTree(pc_np)
    dist, idx = pc_tree.query(pc_np, KNN)
    # dist, idx = pc_tree.query_radius(pc_np, voxel_size * 3)
    ps = pc[idx, :]
    hues = hue[idx]
    pc_x_r = torch.unsqueeze(pc, 1).repeat(1, KNN, 1)
    hue_x_r = torch.unsqueeze(hue, 1).repeat(1, KNN)
    A0 = pc_x_r - ps
    B0 = hues - hue_x_r
    dp = torch.linalg.lstsq(A0, B0).solution

    dp_np = t2n(dp)
    dp_np = np_normalize(dp_np, soft=True)
    return dp_np

def extract_dp(pcd):
    pc_p, pc_c = o2n(pcd)
    pc_np = np.concatenate([pc_p, pc_c], 1)
    dp = calc_dp(pc_np)
    return dp


if __name__ == '__main__':
    meta_path = '/home/lirenjie/data/3DMatchNPY/raw/meta0506.txt'
    meta = load_meta(meta_path)
    l_meta = len(meta)
    print(l_meta)
    for k in range(len(meta)):
        if k % 100 == 0:
            print('''{} / {}'''.format(k, l_meta))
        frame = meta[k]
        A_pcd_raw, B_pcd_raw, gt_t, prefix = load_my_data(meta, k, meta_path=meta_path, return_preffix=True)
        dp_A = extract_dp(A_pcd_raw)
        dp_B = extract_dp(B_pcd_raw)
        frame_id = int(frame[0])
        np.save(osp.join(prefix, '''{:07d}_0_dp{}.npy'''.format(frame_id, dp_knn)), dp_A)
        np.save(osp.join(prefix, '''{:07d}_1_dp{}.npy'''.format(frame_id, dp_knn)), dp_B)
        print('''{}/{}, saving to {}'''.format(k, l_meta, prefix))

        # nameA = osp.basename()
        pass