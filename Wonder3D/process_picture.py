

from rembg import remove
import sys



# 读取原始图片
input_path = f'./example_images/{sys.argv[1]}'
pic_name = sys.argv[1][:-4]
output_path = f'./example_images/{pic_name}.png'

with open(input_path, 'rb') as i:
    input_data = i.read()

# 使用rembg移除背景
output_data = remove(input_data)

# 将结果保存为PNG
with open(output_path, 'wb') as o:
    o.write(output_data)

