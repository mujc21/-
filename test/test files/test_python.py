import unittest

from unittest import TestCase
from upload import upload_pcd
from utility_reg import *
from mesh2pcd import mesh2pcd
from crop_png import crop_png_save
from view_scene import view_scene
from launch import launch_scene
from create_new_pcd import composite_pcd
import os
import numpy as np


# from utils.register_params_check import register_params_check
# 把点云文件导入进来

# 写完之后用第一次作业的simpleBBS环境运行这个py文件即可


class BasicTestCase(TestCase):
    def test_upload(self):
        upload_pcd()
        self.assertEqual(os.path.exists("test/screenshot1.png"), True)
        self.assertEqual(os.path.exists('test/out1.ply'), True)

    def test_mesh2pcd(self):
        mesh2pcd('test/rabbit.obj')
        self.assertEqual(os.path.exists('test/tmp2.ply'), True)


    def test_crop_png(self):
        crop_png_save('test/screenshot2.png')
        self.assertEqual(os.path.exists('test/screenshot2.png'), True)

    def test_view_scene(self):
        view_scene('test/qq.ply')
        view_scene('test/qq.ply', use_color=False)
        view_scene('test/qq.ply', edit=True)

    def test_launch_scene(self):
        launch_scene('test/qq.ply')
        self.assertEqual(os.path.exists('test/screenshot3.png'), True)

    def test_composite_pcd(self):
        composite_pcd('test/guoba.ply', 'test/qq.ply')
        self.assertEqual(os.path.exists('test/tmp3.ply'), True)

    def test_read_ply_get_npy(self):
        pcd = read_ply_get_npy('test/qq.ply')
        is_npy = isinstance(pcd, np.ndarray)
        self.assertEqual(is_npy, True)


    def test_n2o(self):
        pcd = np.load('test/redman.npy')
        pcd = n2o(pcd)
        is_o3d = isinstance(pcd, o3d.geometry.PointCloud)
        self.assertEqual(is_o3d, True)

    def test_o2n(self):
        pcd = o3d.io.read_point_cloud('test/qq.ply')
        pcd = o2n(pcd)
        is_npy = isinstance(pcd, np.ndarray)
        self.assertEqual(is_npy, True)

    def test_get_color_yellow(self):
        color = get_color("custom_yellow")
        yellow = np.asarray([255.0, 204.0, 102.0]) / 255.0
        self.assertTrue(np.array_equal(color, yellow))

    def test_get_color_blue(self):
        color = get_color("custom_blue")
        blue = np.asarray([102.0, 153.0, 255.0]) / 255.0
        self.assertTrue(np.array_equal(color, blue))





if __name__ == "__main__":
    unittest.main()
