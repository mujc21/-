from matplotlib import pyplot as plt
import numpy as np
import sys
 
# 获取命令行参数列表
args = sys.argv
 
# 判断是否有足够的参数
if len(args) > 1:
    # 获取第一个参数
    param1 = args[1]
    param1=int(param1)
    print(param1)
else:
    param1 = 1

x=np.array([i for i in range(0,param1)])
y=[i**2 for i in x]
plt.plot(x,y)
print("before show")
plt.show()
print("after show")

