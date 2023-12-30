import paramiko
import sys
import os

def upload_file(model_file_path, model_remote_path, png_file_path, png_remote_path):

    if os.path.exists(png_file_path):
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        ssh.connect("43.138.68.84", username="ubuntu", password=":Bhj{@J5@2~-K")
        
        sftp = ssh.open_sftp()
        
        # file_path = "/path/to/file.jpg"  # 待上传的文件路径
        # remote_path = "/path/to/file.jpg"  # 上传后保存的文件名
        model_remote_path='/home/ubuntu/software/data/'+model_remote_path
        png_remote_path='/home/ubuntu/software/data/'+png_remote_path

        sftp.put(model_file_path, model_remote_path)  # 上传文件
        sftp.put(png_file_path, png_remote_path)
        
        sftp.close()
        ssh.close()
    else:
        sys.exit(1)


# 获取命令行参数列表
args = sys.argv
# 判断是否有足够的参数
upload_file(args[1], args[2], args[3], args[4])
