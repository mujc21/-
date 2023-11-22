import numpy as np
import utility_reg
import open3d as o3d
import os
import glob
import imageio
base_folder = 'data'
intrisic_path = os.path.join(base_folder, 'camera-intrinsics.txt')
intrinsic = np.loadtxt(intrisic_path)

all_pts = []
all_clr = []
image_files = glob.glob(os.path.join(base_folder, '*.color.png'))
NN = len(image_files)
for k in range(NN):
    img_path = image_files[k]
    depth_path = img_path.replace('color', 'depth')
    pose_path = img_path.replace('color', 'pose').replace('png', 'txt')
    img = imageio.imread(img_path)
    depth = imageio.imread(depth_path)
    pose = np.loadtxt(pose_path)
    img = img / 255.0
    # pc_pts, pc_clr, img, dmin, dmax = _back_projection(img, depth, intrinsic, pose)
    pc_pts, pc_clr = utility_reg._back_projection(img, depth, intrinsic, pose)
    pcd_tmp = utility_reg.n2o(pc_pts, pc_clr)
    # pcd_tmp = pcd_tmp.voxel_down_sample(0.01)
    pc_pts, pc_clr = utility_reg.o2n(pcd_tmp)
    all_pts.append(pc_pts)
    all_clr.append(pc_clr)
np_pts = np.concatenate(all_pts, 0)
np_clr = np.concatenate(all_clr, 0)

# np.save('gen.npy', np.concatenate((np_pts, np_clr), axis=-1))
pcd = utility_reg.n2o(np_pts, np_clr)

# pcd.estimate_normals()
o3d.visualization.draw_geometries_with_vertex_selection([pcd])

