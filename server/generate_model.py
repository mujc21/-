import requests
import paramiko
import sys
import os

def put_to_GPU(picture_path, model_path):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    ssh.connect("111.202.73.146", port="6122", username="root", password="Stom@Linliulab421.")
    sftp = ssh.open_sftp()

    picture_remote_path= '/root/3D/connect/picture/' + picture_path.split('/')[-1]
    sftp.put(picture_path, picture_remote_path)  # 上传文件

    # 发送 GET 请求
    response = requests.get("http://111.202.73.146:11122/gpu_service", params={"picture_remote_path": picture_remote_path})


    # 处理响应
    if response.json() == "success":
        model_remote_path = '/root/3D/connect/model/' + model_path.split('/')[-1]
        sftp.get(model_remote_path, model_path)
        print("请求成功")
    else:
        print("请求失败")
    
    sftp.close()
    ssh.close()

# 获取命令行参数列表
args = sys.argv
# 判断是否有足够的参数
put_to_GPU(args[1],args[2])

