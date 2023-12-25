from matplotlib import pyplot as plt
import numpy as np
import sys
 
# 获取命令行参数列表
args = sys.argv
 
# 判断是否有足够的参数
if len(args) > 1:
    # 获取第一个参数
    param1 = args[1]
    param1=str(param1)
    print(param1)
    if len(args)>2:
        param2=args[2]
        param2=str(param2)
        print(param2)
    else:
        param2= 1
else:
    param1 = 1

x=np.array([i for i in range(0,5+param1+10*param2)])
y=[i**2 for i in x]
plt.plot(x,y)
plt.show()