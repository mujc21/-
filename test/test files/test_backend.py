import requests

# 注册
url = 'http://43.138.68.84:8082/api/register'
response = requests.post(url, {
    'username': '111',
    'password': '2222',
    'confirmPassword': '2222'
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 登录
url = 'http://43.138.68.84:8082/api/login'
response = requests.post(url, {
    'username': '111',
    'password': '2222',
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 个人主页数字信息获取
username = 'guowei'
url = f'http://43.138.68.84:8082/api/mypagenumber/{username}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 个人主页头像信息获取
username = 'guowei'
url = f'http://43.138.68.84:8082/api/mypageavatar/{username}'
response = requests.get(url)
if response.status_code == 200:
    result = response
    print(result.status_code)
else:
    print('请求失败，状态码:', response.status_code)



# 更改头像
username = 'guowei'
url = f'http://43.138.68.84:8082/api/change-avatar/{username}'
files = {'avatar': open('test.png', 'rb')} 
response = requests.post(url, files=files)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 修改用户名
username = 'guowei'
newUsername = 'b'
url = f'http://43.138.68.84:8082/api/change-username/{username}/{newUsername}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 修改密码
url = f'http://43.138.68.84:8082/api/change-password'
response = requests.post(url,{
    'username': 'guowei',
    'password': 'qqqqqqqq',
    'newPassword': '2'
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 发现页面帖子数量获取
url = 'http://43.138.68.84:8082/api/discover-postnum'
response = requests.get(url,params={
    'Search_String': '2',
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 发现页面帖子头像获取
currentPage = 1
ordinal = 2
url = f'http://43.138.68.84:8082/api/discover-postavatar/{currentPage}/{ordinal}'
response = requests.get(url, params={
    'select_Bar_State': '点赞最多',
    'Search_String': '',
})
if response.status_code == 200:
    result = response
    print(result.status_code)
else:
    print('请求失败，状态码:', response.status_code)


# 发现页面帖子预览图获取
currentPage = 1
ordinal = 2
url = f'http://43.138.68.84:8082/api/discover-postpicture/{currentPage}/{ordinal}'
response = requests.get(url, params={
    'select_Bar_State': '点赞最多',
    'Search_String': '',
})
if response.status_code == 200:
    result = response
    print(result.status_code)
else:
    print('请求失败，状态码:', response.status_code)



# 发现页面帖子string信息获取
currentPage = 1
ordinal = 2
url = f'http://43.138.68.84:8082/api/discover-poststring/{currentPage}/{ordinal}'
response = requests.get(url, params={
    'select_Bar_State': '点赞最多',
    'Search_String': '',
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 我的页面下栏帖子数量获取
username = 'guowei'
mode = '收藏'
url = f'http://43.138.68.84:8082/api/MyListNumber/{username}/{mode}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 我的页面下栏帖子头像获取
username = 'guowei'
mode = '发帖'
ordinal = 1
url = f'http://43.138.68.84:8082/api/MyListAvatar/{username}/{mode}/{ordinal}'
response = requests.get(url)
if response.status_code == 200:
    result = response
    print(result.status_code)
else:
    print('请求失败，状态码:', response.status_code)



# 我的页面下栏帖子图片获取
username = 'guowei'
mode = '发帖'
ordinal = 1
url = f'http://43.138.68.84:8082/api/MyListPicture/{username}/{mode}/{ordinal}'
response = requests.get(url)
if response.status_code == 200:
    result = response
    print(result.status_code)
else:
    print('请求失败，状态码:', response.status_code)



# 我的页面下栏帖子string获取
username = 'guowei'
mode = '发帖'
ordinal = 1
url = f'http://43.138.68.84:8082/api/MyListString/{username}/{mode}/{ordinal}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 我的关注用户数量获取
username = 'guowei'
url = f'http://43.138.68.84:8082/api/AttentionListNumber/{username}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 我的关注用户头像获取
username = '22'
ordinal = 1
url = f'http://43.138.68.84:8082/api/AttentionListAvatar/{username}/{ordinal}'
response = requests.get(url)
if response.status_code == 200:
    result = response
    print(result.status_code)
else:
    print('请求失败，状态码:', response.status_code)



# 我的关注用户用户名获取
username = '22'
ordinal = 1
url = f'http://43.138.68.84:8082/api/AttentionListUsername/{username}/{ordinal}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 帖子内部发送者头像获取
postid = 1
url = f'http://43.138.68.84:8082/api/postcontentavatar/{postid}'
response = requests.get(url)
if response.status_code == 200:
    result = response
    print(result.status_code)
else:
    print('请求失败，状态码:', response.status_code)



# 帖子内部预览图获取
postid = 1
url = f'http://43.138.68.84:8082/api/postcontentpicture/{postid}'
response = requests.get(url)
if response.status_code == 200:
    result = response
    print(result.status_code)
else:
    print('请求失败，状态码:', response.status_code)



# 帖子内部文字信息获取
postid = 1
url = f'http://43.138.68.84:8082/api/postcontentstring/{postid}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 帖子是否是我发的
postid = 1
myname = 'guowei'
url = f'http://43.138.68.84:8082/api/postcontentwhetherIpost/{postid}/{myname}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 帖子是否被我点赞
postid = 1
myname = 'guowei'
url = f'http://43.138.68.84:8082/api/postcontentwhetherlike/{postid}/{myname}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 帖子是否被我收藏
postid = 1
myname = 'guowei'
url = f'http://43.138.68.84:8082/api/postcontentwhetherstore/{postid}/{myname}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 我是否关注了作者
postid = 1
myname = 'guowei'
url = f'http://43.138.68.84:8082/api/postcontentwhetherattention/{postid}/{myname}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 帖子内部所有评论id获取
postid = 1
url = f'http://43.138.68.84:8082/api/postcontentcommentnumber/{postid}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 帖子内部评论头像获取
postid = 1
ordinal = 1
url = f'http://43.138.68.84:8082/api/postcontentcommentavatar/{postid}/{ordinal}'
response = requests.get(url)
if response.status_code == 200:
    result = response
    print(result.status_code)
else:
    print('请求失败，状态码:', response.status_code)



# 帖子内部评论string信息获取
postid = 1
ordinal = 1
url = f'http://43.138.68.84:8082/api/postcontentcommentstring/{postid}/{ordinal}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 帖子内部评论刷新时头像获取
commentid = 1
url = f'http://43.138.68.84:8082/api/postcontentrefreshcommentavatar/{commentid}/'
response = requests.get(url)
if response.status_code == 200:
    result = response
    print(result.status_code)
else:
    print('请求失败，状态码:', response.status_code)



# 帖子内部评论刷新时string信息获取
commentid = 1
url = f'http://43.138.68.84:8082/api/postcontentrefreshcommentstring/{commentid}/'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 发评论
url = 'http://43.138.68.84:8082/api/postcomment'
response = requests.post(url, {
    'comment_text': 'haha',
    'postid': '1',
    'username': 'qq'
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 我的粉丝数量获取
username = 'qq'
url = f'http://43.138.68.84:8082/api/FansNumber/{username}/'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 我的粉丝头像获取
username = 'qq'
ordinal = 1
url = f'http://43.138.68.84:8082/api/FansAvatar/{username}/{ordinal}'
response = requests.get(url)
if response.status_code == 200:
    result = response
    print(result.status_code)
else:
    print('请求失败，状态码:', response.status_code)



# 我的粉丝用户名获取
username = 'qq'
ordinal = 1
url = f'http://43.138.68.84:8082/api/FansUsername/{username}/{ordinal}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 我是否关注了列表里的某个用户
anothername = 'qq'
myname = 'guowei'
url = f'http://43.138.68.84:8082/api/listwhetherattention/{anothername}/{myname}'
response = requests.get(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 帖子里关注
url = 'http://43.138.68.84:8082/api/fnyAttention'
response = requests.post(url, {
    'add_or_delete': '1',
    'postID': '1',
    'username': 'qq'
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 列表里关注
url = 'http://43.138.68.84:8082/api/listAttention'
response = requests.post(url, {
    'add_or_delete': '1',
    'anothername': 'guowei',
    'username': 'qq'
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 用户上传一个图片，由此生成模型，放到它的私有库里
username = 'guowei'
url = f'http://43.138.68.84:8082/api/generateModel/{username}'
files = {'generate_picture': open('/test.png', 'rb')} 
response = requests.post(url, files=files)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 请求一个模型的预览图
model_id = 1
url = f'http://43.138.68.84:8082/api/fnyGetModelPreviewPicture/{model_id}'
response = requests.get(url)
if response.status_code == 200:
    result = response
    print(result.status_code)
else:
    print('请求失败，状态码:', response.status_code)



# 给出用户，返回其所有私有库的列表
url = 'http://43.138.68.84:8082/api/fnyGetUserModel'
response = requests.post(url, {
    'username': 'qq'
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 给出用户和模型ID，从用户的私有列表里删去这个模型
url = 'http://43.138.68.84:8082/api/fnyDeleteOneUserModel'
response = requests.post(url, {
    'username': 'qq',
    'modelID' : 1,
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 请求一个模型的点云文件
modelId = 1
url = f'http://43.138.68.84:8082/api/fnyGetFileOfOneModel/{modelId}'
response = requests.post(url)
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 创建新模型(发送点云文件)
url = 'http://43.138.68.84:8082/api/fnyAddNewModel'
response = requests.post(url, {
    'username': 'qq',
    'model_path' : 'test.ply',
    'preview_path' : 'test.png'
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 发布帖子
url = 'http://43.138.68.84:8082/fnyReleasePost'
response = requests.post(url, {
    'username': 'qq',
    'modelID' : 1,
    'text' : 'haha',
    'canEdit' : 1
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 点赞
url = 'http://43.138.68.84:8082/fnyAddOrDeleteLike'
response = requests.post(url, {
    'add_or_delete': 1,
    'postID' : 1,
    'username' : 'qq',
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 收藏
url = 'http://43.138.68.84:8082/fnyAddOrDeleteStore'
response = requests.post(url, {
    'add_or_delete': 1,
    'postID' : 1,
    'username' : 'qq',
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 转发
url = 'http://43.138.68.84:8082/fnyTransmit'
response = requests.post(url, {
    'postID' : 1,
    'username' : 'qq',
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 公共库挪进自己的
url = 'http://43.138.68.84:8082/fnyAddToPrivateModel'
response = requests.post(url, {
    'username' : 'qq',
    'model_id' : 1
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 最新一条聊天信息
url = 'http://43.138.68.84:8082/fnyGetLastChatMessage'
response = requests.post(url, {
    'username' : 'qq',
    'ano_username' : 'guowei'
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 聊天信息
url = 'http://43.138.68.84:8082/fnyGetChatMessages'
response = requests.post(url, {
    'username' : 'qq',
    'ano_username' : 'guowei'
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 增加一条聊天记录
url = 'http://43.138.68.84:8082/fnyAddChatMessage'
response = requests.post(url, {
    'username' : 'qq',
    'ano_username' : 'guowei',
    'text' : 'haha'
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)



# 给出用户，返回所有与其互关的人
url = 'http://43.138.68.84:8082/fnyGetTwoSideAttentionList'
response = requests.post(url, {
    'username' : 'qq',
})
if response.status_code == 200:
    result = response.text
    print(result)
else:
    print('请求失败，状态码:', response.status_code)