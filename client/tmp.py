from PIL import Image
import requests
from io import BytesIO
import sys

args = sys.argv

if len(args) > 1:
    param1 = args[1]
    param1=str(param1)
    response = requests.get(param1)
    img = Image.open(BytesIO(response.content))
    if response.status_code == 200:
        # 将文件内容写入本地文件
        with open("downloaded_file.png", "wb") as file:
            file.write(response.content)
        print("File downloaded successfully.")
    else:
        print("Failed to download the file. Status code:", response.status_code)