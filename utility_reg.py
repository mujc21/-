import glob
import os

import open3d as o3d
import numpy as np
import time
import math,random
from math import sin, cos
import imageio
import cv2

voxel_size = 1.0
ransac_n = 3
distance_threshold = 1.8
num_iter = 10000

def get_rot_matrix(theta, axis):
    R = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]
    if axis == 'x':
        R = [
            [1, 0, 0],
            [0, cos(theta), -sin(theta)],
            [0, sin(theta), cos(theta)],
        ]
    elif axis == 'y':
        R = [
            [cos(theta), 0, sin(theta)],
            [0, 1, 0],
            [-sin(theta), 0, cos(theta)],
        ]
    elif axis =='z':
        R = [
            [cos(theta), -sin(theta), 0],
            [sin(theta), cos(theta), 0],
            [0, 0, 1]
        ]
    return np.asarray(R)
# 对于一系列的角度和旋转轴得到一个整体的旋转矩阵
def get_rot_matrix_composed(deg, axis):
    assert len(deg) == len(axis)
    R = get_rot_matrix(0, 'I')  # 这就是拿了个单位阵
    for k, theta in enumerate(deg):
        R = R @ get_rot_matrix(math.radians(theta), axis[k])
    return R

# 这个函数是干什么的？？？
def ext_fpfh(pcd, dp, radius_normal, radius_feature):

    pcd.estimate_normals(
        o3d.geometry.KDTreeSearchParamHybrid(radius=radius_normal, max_nn=30 * 5))

    radius_feature = voxel_size * 5
    # radius_feature = voxel_size * 25
    # print(":: Compute FPFH feature with search radius %.3f." % radius_feature)
    pcd_fpfh = o3d.pipelines.registration.compute_fpfh_feature(
        pcd,
        o3d.geometry.KDTreeSearchParamHybrid(radius=radius_feature, max_nn=100 * 5))


    pcd.normals = o3d.utility.Vector3dVector(dp)
    pcd_c_fpfh = o3d.pipelines.registration.compute_fpfh_feature(
        pcd,
        o3d.geometry.KDTreeSearchParamHybrid(radius=radius_feature, max_nn=100 * 5))

    return pcd_fpfh, pcd_c_fpfh

def preprocess_point_cloud_with_ext_fpfh(pcd, dp, voxel_size):
    # print(":: Downsample with a voxel size %.3f." % voxel_size)
    # pcd_down = pcd.voxel_down_sample(voxel_size)
    pcd_down = pcd
    radius_normal = voxel_size * 2
    # radius_normal = voxel_size * 10
    # print(":: Estimate normal with search radius %.3f." % radius_normal)

    radius_feature = voxel_size * 5
    # radius_feature = voxel_size * 25
    # print(":: Compute FPFH feature with search radius %.3f." % radius_feature)

    fpfh, cfpfh = ext_fpfh(pcd, dp, radius_normal, radius_feature)

    return pcd_down, fpfh, cfpfh

def preprocess_point_cloud(pcd, voxel_size):
    # print(":: Downsample with a voxel size %.3f." % voxel_size)
    # pcd_down = pcd.voxel_down_sample(voxel_size)
    pcd_down = pcd
    radius_normal = voxel_size * 2
    # radius_normal = voxel_size * 10
    # print(":: Estimate normal with search radius %.3f." % radius_normal)
    pcd_down.estimate_normals(
        o3d.geometry.KDTreeSearchParamHybrid(radius=radius_normal, max_nn=30 * 5))

    radius_feature = voxel_size * 5
    # radius_feature = voxel_size * 25
    # print(":: Compute FPFH feature with search radius %.3f." % radius_feature)
    pcd_fpfh = o3d.pipelines.registration.compute_fpfh_feature(
        pcd_down,
        o3d.geometry.KDTreeSearchParamHybrid(radius=radius_feature, max_nn=100 * 5))

    return pcd_down, pcd_fpfh
# 怎么感觉颜色信息没有用上呀？？？
def draw_registration_result_np(pcd0_np, pcd1_np):
    pcd0 = o3d.geometry.PointCloud()
    pcd1 = o3d.geometry.PointCloud()
    pcd0.points = o3d.utility.Vector3dVector(pcd0_np)
    pcd1.points = o3d.utility.Vector3dVector(pcd1_np)
    points0 = pcd0_np
    points1 = pcd1_np
    color1 = np.array([1, 0, 0]).reshape(1, -1)
    color1 = np.repeat(color1, points0.shape[0], axis=0)
    color2 = np.array([0, 0, 1]).reshape(1, -1)
    color2 = np.repeat(color2, points1.shape[0], axis=0)
    pcd0.colors = o3d.utility.Vector3dVector(color1)
    pcd1.colors = o3d.utility.Vector3dVector(color2)
    o3d.visualization.draw_geometries([pcd0, pcd1])

def draw_registration_result(pcd0, pcd1):
    # return
    points0 = np.array(pcd0.points)
    points1 = np.array(pcd1.points)
    color1 = np.array([1, 0, 0]).reshape(1, -1)
    color1 = np.repeat(color1, points0.shape[0], axis=0)
    color2 = np.array([0, 0, 1]).reshape(1, -1)
    color2 = np.repeat(color2, points1.shape[0], axis=0)
    pcd0.colors = o3d.utility.Vector3dVector(color1)
    pcd1.colors = o3d.utility.Vector3dVector(color2)
    o3d.visualization.draw_geometries([pcd0, pcd1])

def prepare_dataset(source_path, target_path, voxel_size):

    source = o3d.io.read_point_cloud(source_path)
    target = o3d.io.read_point_cloud(target_path)
    # the visualization of the input point cloud
    # draw_registration_result(source, target)

    source_down, source_fpfh = preprocess_point_cloud(source, voxel_size)
    target_down, target_fpfh = preprocess_point_cloud(target, voxel_size)

    return source, target, source_down, target_down, source_fpfh, target_fpfh

def prepare_dataset_np(src_np, tar_np, voxel_size):


    source = o3d.geometry.PointCloud()
    target = o3d.geometry.PointCloud()
    source.points = o3d.utility.Vector3dVector(src_np)
    target.points = o3d.utility.Vector3dVector(tar_np)


    source_down, source_fpfh = preprocess_point_cloud(source, voxel_size)
    target_down, target_fpfh = preprocess_point_cloud(target, voxel_size)

    return source, target, source_down, target_down, source_fpfh, target_fpfh

def prepare_dataset_np_with_ext_fpfh(src_np, tar_np, src_dp, tar_dp, voxel_size):


    source = o3d.geometry.PointCloud()
    target = o3d.geometry.PointCloud()
    source.points = o3d.utility.Vector3dVector(src_np)
    target.points = o3d.utility.Vector3dVector(tar_np)


    source_down, source_fpfh, source_cfpfh = preprocess_point_cloud_with_ext_fpfh(source, src_dp, voxel_size)
    target_down, target_fpfh, target_cfpfh = preprocess_point_cloud_with_ext_fpfh(target, tar_dp, voxel_size)

    return source, target, source_down, target_down, source_fpfh, target_fpfh, source_cfpfh, target_cfpfh

# 基于ransac来进行全局配准？？？
def execute_global_registration(source_down, target_down, source_fpfh,
                                target_fpfh, ransac_n, distance_threshold, num_iter):
    # print(":: RANSAC registration on downsampled point clouds.")
    # print("   Since the downsampling voxel size is %.3f," % voxel_size)
    # print("   we use a liberal distance threshold %.3f." % distance_threshold)
    '''
    The pose computation is based on correspondences, which are generated by querying
    the nearest neighbor in the 33-dimensional FPFH feature space.
    '''
    result = o3d.pipelines.registration.registration_ransac_based_on_feature_matching(
        source_down, target_down, source_fpfh, target_fpfh, True,
        distance_threshold,
        o3d.pipelines.registration.TransformationEstimationPointToPoint(False),
        ransac_n, [
            # prune out outlier correspondences
            o3d.pipelines.registration.CorrespondenceCheckerBasedOnEdgeLength(
                0.9),
            o3d.pipelines.registration.CorrespondenceCheckerBasedOnDistance(
                distance_threshold)
        ], o3d.pipelines.registration.RANSACConvergenceCriteria(num_iter, 0.999))
    return result

def apply_transformation(source, transformation, debug=False):
    if debug:
        print(transformation)
        print("")
    src_np = np.asarray(source.points)
    T = transformation
    t_src_np = np.ones((src_np.shape[0], 4))
    t_src_np[:, :3] = src_np
    t_src_np = t_src_np @ np.transpose(T) # 矩阵乘法
    source.points = o3d.utility.Vector3dVector(t_src_np[:, :3])
    return source
# icp算法进行局部配准
def run_icp(src, tar):
    # return src, tar
    move_th = 1.0
    trans_init = np.identity(4)
    reg_p2p = o3d.pipelines.registration.registration_icp(
        src, tar, move_th, trans_init,
        o3d.pipelines.registration.TransformationEstimationPointToPoint()
    )
    src.transform(reg_p2p.transformation)
    # src = apply_transformation(src, reg_p2p.transformation)
    print(reg_p2p)
    return src, tar, reg_p2p

# def registration(src_np, tar_np):
#     source, target, source_down, target_down, source_fpfh, target_fpfh = prepare_dataset_np_pt(src_np, tar_np,
#                                                                                          voxel_size, deg, axis, fout)
#     target_raw = o3d.geometry.PointCloud()
#     target_raw.points = o3d.utility.Vector3dVector(tar_np)
#     start = time.time()
#     result_ransac = execute_global_registration(source_down, target_down, source_fpfh, target_fpfh,
#                                                 ransac_n, distance_threshold, num_iter)
#
#     source = apply_transformation(source, result_ransac.transformation)
#     # source.transform(result_ransac.transformation)
#     #
#     # src_np = np.asarray(source.points)
#     # T = result_ransac.transformation
#     # t_src_np = np.ones((src_np.shape[0], 4))
#     # t_src_np[:, :3] = src_np
#     # t_src_np = t_src_np @ np.transpose(T)
#     # source.points = o3d.utility.Vector3dVector(t_src_np[:, :3])
#
#     #
#     if fout is not None:
#         fout.write('''{}\n\n'''.format(result_ransac.transformation))
#     else:
#         print(result_ransac.transformation)
#     end = time.time()
#     source, target = run_icp(source, target, fout)
#     print(f"inference time: {end - start} s")
#     draw_registration_result(source, target_raw)
#
# def reg_partial_partial(src_np, tar_np, deg=(0,0,0), axis='N', fout=None):
#     source, target, source_down, target_down, source_fpfh, target_fpfh = prepare_dataset_np_pp(src_np, tar_np,
#                                                                                          voxel_size, deg, fout)
#     start = time.time()
#     result_ransac = execute_global_registration(source_down, target_down, source_fpfh, target_fpfh,
#                                                 ransac_n, distance_threshold, num_iter)
#     source.transform(result_ransac.transformation)
#     if fout is not None:
#         fout.write('''{}\n\n'''.format(result_ransac.transformation))
#     else:
#         print(result_ransac.transformation)
#     source, target = run_icp(source, target, fout)
#     end = time.time()
#     print(f"inference time: {end - start} s")
#     draw_registration_result(source, target)

def n2o(__points, __colors=None) -> o3d.geometry.PointCloud:
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(__points)
    if __colors is not None:
        pcd.colors = o3d.utility.Vector3dVector(__colors)
    return pcd

def o2n(__pcd):
    return np.asarray(__pcd.points), np.asarray(__pcd.colors)

def _back_projection(img, depth, intrinsic, pose=None):
    # pass
    H, W = depth.shape
    img = cv2.resize(img, (W, H))
    pixels_l = np.meshgrid(list(range(W)), list(range(H)))
    pixels = np.stack(pixels_l, 2).reshape(-1, 2)
    depth = depth.reshape(-1)
    mask = (depth != 0)
    # mask = mask.reshape(-1)
    pixels = pixels[mask]
    depth = depth[mask]
    # depth_max, depth_min = depth.max(), depth.min()
    depth = np.expand_dims(depth, 1)
    depth = depth / 1000.0
    color = img.reshape(-1, 3)[mask]
    homo_pixels = np.concatenate([pixels, np.ones_like(pixels[:, 0:1])], 1)
    # homo_pixels = homo_pixels * depth
    inv_K = np.linalg.inv(intrinsic)
    pts = homo_pixels @ np.transpose(inv_K)[:3, :]
    pts = pts * depth
    homo_pts = np.concatenate([pts[:, :3], np.ones_like(pts[:, 0:1])], 1)
    if pose is not None:
        homo_pts = homo_pts @ np.transpose(pose)
    homo_pts = homo_pts / homo_pts[:, 3:]
    return homo_pts[:, :3], color  # img, depth_min, depth_max
def gen_integrated_pcd_from_rgbd_images(base_folder):
    intrisic_path = os.path.join(base_folder, 'camera-intrinsics.txt')
    intrinsic = np.loadtxt(intrisic_path)
    seq_list = glob.glob(os.path.join(base_folder, 'seq*'))
    pcds = {}
    for seq in seq_list:
        all_pts = []
        all_clr = []
        image_files = glob.glob(os.path.join(seq, '*.color.png'))
        NN = len(image_files)
        for k in range(NN):
            print('''{:04d} / {:04d}'''.format(k, NN))
            img_path = image_files[k]
            depth_path = img_path.replace('color', 'depth')
            pose_path = img_path.replace('color', 'pose').replace('png', 'txt')
            img = imageio.imread(img_path)
            depth = imageio.imread(depth_path)
            pose = np.loadtxt(pose_path)
            img = img / 255.0
            # pc_pts, pc_clr, img, dmin, dmax = _back_projection(img, depth, intrinsic, pose)
            pc_pts, pc_clr = _back_projection(img, depth, intrinsic, pose)
            pcd_tmp = n2o(pc_pts, pc_clr)
            pcd_tmp = pcd_tmp.voxel_down_sample(0.01)
            pc_pts, pc_clr = o2n(pcd_tmp)
            all_pts.append(pc_pts)
            all_clr.append(pc_clr)
        np_pts = np.concatenate(all_pts, 0)
        np_clr = np.concatenate(all_clr, 0)
        pcd = n2o(np_pts, np_clr)
        if len(pcd.points) > 1.6e8:
            pcd = pcd.voxel_down_sample(0.01)
        pcds[os.path.split(seq)[-1]] = pcd
    return pcds
    # add 下采样
    # pcd = pcd.voxel_down_sample(voxel_size=0.01)
    # mesh = o3d.geometry.TriangleMesh.create_from_point_cloud_alpha_shape(pcd, alpha=0.1)

    # o3d.visualization.draw_geometries([pcd])

