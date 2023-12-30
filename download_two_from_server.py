import paramiko
import sys

def download_file(model1_remote_path, model2_remote_path):

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    ssh.connect("43.138.68.84", username="ubuntu", password=":Bhj{@J5@2~-K")
    
    sftp = ssh.open_sftp()
    
    # file_path = "/path/to/file.jpg"  # 待上传的文件路径
    # remote_path = "/path/to/file.jpg"  # 上传后保存的文件名
    print('/'.split(model1_remote_path)[-1])
    sftp.get(model1_remote_path, 'local_models/'+ model1_remote_path.split('/')[-1])  # 上传文件
    sftp.get(model2_remote_path, 'local_models/'+model2_remote_path.split('/')[-1])
    
    sftp.close()
    ssh.close()
    
args = sys.argv
 
# 判断是否有足够的参数
if len(args) > 1:
    # 获取第一个参数
    param1 = args[1]
    param1=str(param1)
    if len(args)>2:
        param2=args[2]
        param2=str(param2)
    else:
        param2= ''
else:
    param1 = ''

if not os.path.exists('local_models/'+param1.split('/')[-1]) or not os.path.exists('local_models/'+param2.split('/')[-1]):
    download_file(param1, param2)
