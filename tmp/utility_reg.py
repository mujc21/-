import glob
import os

import imageio
import open3d as o3d
import numpy as np
import time
import math,random
from math import sin, cos
import torch
import matplotlib as plt
import cv2

voxel_size = 1.0
ransac_n = 3
distance_threshold = 1.8
num_iter = 10000

def read_ply_get_npy(file_path):
    pcd = o3d.io.read_point_cloud(file_path)
    pcd = o2n(pcd)
    return pcd

def n2o(__points) -> o3d.geometry.PointCloud:
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(__points[:, :3])
    if __points.shape[1] == 6:
        pcd.colors = o3d.utility.Vector3dVector(__points[:, 3:])
    return pcd

def o2n(__pcd):
    return np.concatenate((np.asarray(__pcd.points), np.asarray(__pcd.colors)), axis=-1)

def apply_transform_np(points, transform=None, rotation=None, translation=None):
    if transform is not None:
        rotation = transform[:3, :3]
        translation = transform[:3, 3]
    cord = points[:, :3]
    cord = np.transpose(rotation @ np.transpose(cord) + translation.reshape(3, 1))
    return np.concatenate((cord, points[:, 3:]), -1)


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

def get_color(color_name):
    if color_name == "custom_yellow":
        return np.asarray([255.0, 204.0, 102.0]) / 255.0
    if color_name == "custom_blue":
        return np.asarray([102.0, 153.0, 255.0]) / 255.0
    assert color_name in plt.colors.CSS4_COLORS
    return np.asarray(plt.colors.to_rgb(plt.colors.CSS4_COLORS[color_name]))

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
def draw_registration_result_point_with_color(pcd0_np, pcd1_np, use_color0=False, use_color1=False, transform = None):
    # pcd0是src点云
    if transform is not None:
        src_points = pcd0_np[:, :3]
        src_points = apply_transform_np(src_points, transform)
        pcd0_np = np.concatenate([src_points, pcd0_np[:, 3:]], 1)
    pcd0 = o3d.geometry.PointCloud()
    pcd1 = o3d.geometry.PointCloud()
    if use_color0:
        pcd0.points = o3d.utility.Vector3dVector(pcd0_np[:, :3])
    else:
        pcd0.points = o3d.utility.Vector3dVector(pcd0_np[:, :3])
    if use_color1:
        pcd1.points = o3d.utility.Vector3dVector(pcd1_np[:, :3])
    else:
        pcd1.points = o3d.utility.Vector3dVector(pcd1_np[:, :3])
    pcd0.estimate_normals()
    pcd1.estimate_normals()
    if use_color0:
        color0 = pcd0_np[:, 3:]
        pcd0.colors = o3d.utility.Vector3dVector(color0)
    else:
        pcd0.paint_uniform_color(get_color('custom_blue'))
    if use_color1:
        color1 = pcd1_np[:, 3:]
        pcd1.colors = o3d.utility.Vector3dVector(color1)
    else:
        pcd1.paint_uniform_color(get_color('custom_yellow'))
    o3d.visualization.draw_geometries([pcd0, pcd1])



def draw_single_pcd(pcd_np, use_color=False):
    pcd = o3d.geometry.PointCloud()
    if use_color:
        pcd.points = o3d.utility.Vector3dVector(pcd_np[:, :3])
    else:
        pcd.points = o3d.utility.Vector3dVector(pcd_np[:, :3])
    pcd.estimate_normals()
    if use_color:
        color = pcd_np[:, 3:]
        pcd.colors = o3d.utility.Vector3dVector(color)
    else:
        pcd.paint_uniform_color(get_color("custom_blue"))
    o3d.visualization.draw_geometries([pcd])

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

def get_rotation_matrix_from_axis_and_degree(axis_of_rotation, angle_degrees):  # 旋转角度（以度为单位）
    angle_radians = np.radians(angle_degrees)  # 将角度转换为弧度
    # 使用 Rodrigues' 公式计算旋转矩阵
    rotation_matrix = np.eye(3) + np.sin(angle_radians) * np.cross(np.eye(3), axis_of_rotation) + (
                1 - np.cos(angle_radians)) * np.outer(axis_of_rotation, axis_of_rotation)
    return rotation_matrix





