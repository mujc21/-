import imageio
import numpy as np
import utility_reg
import open3d as o3d

camera_matrix = np.zeros(shape=(3, 3))
camera_matrix[0, 0] = 5.4765313594010649e+02
camera_matrix[0, 2] = 3.2516069906172453e+02
camera_matrix[1, 1] = 5.4801781476172562e+02
camera_matrix[1, 2] = 2.4794113960783835e+02
camera_matrix[2, 2] = 1
# camera_matrix = np.loadtxt("./depth_estimate/matrix.txt")
img_path = './depth_estimate/test3.jpg'
depth_path = './depth_estimate/depth.png'
# depth_path = 'frame-000163.depth.png'
img = imageio.imread(img_path)[10:-10, 10:-10]
# depth = imageio.imread(depth_path)
depth = np.load('./depth_estimate/depth.npy')[10:-10, 10:-10]
img = img / 255.0
points, color = utility_reg._back_projection(img, depth, camera_matrix)
utility_reg.draw_single_pcd(np.concatenate((points, color), axis=-1), use_color=True)
