import sys
import numpy as np
import time

# 获取命令行参数列表
args = sys.argv
# 判断是否有足够的参数
if len(args) > 1:
    # 获取第一个参数
    param1 = args[1]
    param1=str(param1)
else:
    param1 = ''

# print(param1)
# /home/ubuntu/software/data/model/000.npy

loaded_data = np.load(param1)

# 输出加载的数据
# print(loaded_data.shape)
print(loaded_data.shape[0],end='_')
print(loaded_data.shape[1],end='_')
for i in range(loaded_data.shape[0]):
    for j in range(loaded_data.shape[1]):
        print(loaded_data[i][j],end='_')
