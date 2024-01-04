import paramiko
import sys
import os
import logging

def download_file(model_remote_path):

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    ssh.connect("43.138.68.84", username="ubuntu", password=":Bhj{@J5@2~-K")
    
    sftp = ssh.open_sftp()
    
    # file_path = "/path/to/file.jpg"  # 待上传的文件路径
    # remote_path = "/path/to/file.jpg"  # 上传后保存的文件名
    sftp.get(model_remote_path, './local_models/'+ model_remote_path.split('/')[-1]) 
    
    sftp.close()
    ssh.close()

args = sys.argv
if not os.path.exists('./local_models/'+args[1].split('/')[-1]):
    # logging.error(os.path.abspath('./local_models/'+args[1].split('/')[-1]))
    download_file(args[1])
