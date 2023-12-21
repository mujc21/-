import numpy as np
import utility_reg
import open3d as o3d
import os
import glob
import imageio
from PIL import Image
a = imageio.imread('./data/frame-000264.depth.png')
a = (a - a.min()) / (a.max() - a.min())

# 将数组缩放到0-255之间，并转换为uint8类型
a = (a * 255).astype(np.uint8)
image = Image.fromarray(a)
image.save('output.png')


