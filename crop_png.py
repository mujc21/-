from PIL import Image
import numpy as np

def crop_png_save(imagePath):
    image = Image.open(imagePath)  # 打开tiff图像
    ImageArray = np.array(image)
    row = ImageArray.shape[0]
    col = ImageArray.shape[1]
    # 先计算所有图片的裁剪范围，然后再统一裁剪并输出图片
    x_left = row
    x_top = col
    x_right = 0
    x_bottom = 0
    # 上下左右范围
    """
    Image.crop(left, up, right, below)
    left：与左边界的距离
    up：与上边界的距离
    right：还是与左边界的距离
    below：还是与上边界的距离
    简而言之就是，左上右下。
    """
    for r in range(row):
        for c in range(col):
            #if ImageArray[row][col][0] < 255 or ImageArray[row][col][0] ==0:
            if ImageArray[r][c][0] < 255 and ImageArray[r][c][0] !=0: #外框有个黑色边框，增加条件判断
                if x_top > r:
                    x_top = r  # 获取最小x_top
                if x_bottom < r:
                    x_bottom = r  # 获取最大x_bottom
                if x_left > c:
                    x_left = c  # 获取最小x_left
                if x_right < c:
                    x_right = c  # 获取最大x_right
     # image = Image.open(imagePath)  # 打开tiff图像
    cropped = image.crop((x_left-5, x_top-5, x_right+5, x_bottom+5))  # (left, upper, right, lower)
    cropped.save(imagePath)
