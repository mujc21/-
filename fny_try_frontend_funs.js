//获取一个模型的预览图
handleGetOneModelPreviewPicture = (modelID) => {  //返回值为其预览图的路径
  const our_url = "/api/fnyGetModelPreviewPicture/" + modelID;

  return new Promise((resolve, reject) => {
      axios.post(our_url, {
          responseType: 'arraybuffer'
      })
      .then(res => {
          if (res.data === "unexpected error") {  //出错
              alert("数据库查询失败");
              resolve('');
          }
          else if (res.data === "model not exist") {  //出错
            alert("未找到指定模型");
            resolve('');
          }
          else {
              const blob = new Blob([res.data], { type: 'application/octet-stream' });
              const url = URL.createObjectURL(blob);
              resolve(url);
          }
      })
      .catch(e => {
          alert("404 GetModelPreviewPicture响应失败: " + e.message);
          resolve('');
      });
  });
};


//给出用户，返回其所有私有模型的列表
let model_list=[]
handleGetUserModels = async (username) => {
  try{
    await axios.post("/api/fnyGetUserModel",{  //注意修改这个post路径，改完告我一声
      username
    })
    .then(res=>{
      if(res.data.text === "error when finding user"){
        alert("错误：找不到用户")
        return
      }
      else if(res.data.text === "user not found"){
        alert("用户不存在")
        return
      }
      else if(res.data.text === "error when searching models"){
        alert("错误：查询私有模型失败")
        return
      }
      else if(res.data.text === "successful"){
        model_list=res.data.model_list
        return
      }
    })
    .catch(e=>{
      alert("404 fnyGetUserModel响应失败: " + e.message);
    })
  }
  catch{
    
  }
  finally{
    
  }
};

//给出用户和模型ID，从用户的私有列表里删去这个模型
handleDeleteOneUserModel = async (username,modelID) => {  //返回值为其预览图的路径
  try{
    await axios.post("/api/fnyDeleteOneUserModel",{  //注意修改这个post路径，改完告我一声
      username,modelID
    })
    .then(res=>{
      if(res.data === "error when finding user"){
        alert("错误：找不到用户")
        return
      }
      else if(res.data === "user not found"){
        alert("用户不存在")
        return
      }
      else if(res.data === "unexpected error"){
        alert("删除失败，请重试")
        return
      }
      else if(res.data === "successful"){
        return
      }
    })
    .catch(e=>{
      alert("404 DeleteOneUserModel响应失败: " + e.message);
    })
  }
  catch{
    
  }
  finally{
    
  }
};

//请求一个模型的点云文件
handleGetFileOfOneModel = (modelID) => {  //返回值为模型的路径
  const our_url = "/api/fnyGetFileOfOneModel/" + modelID;

  return new Promise((resolve, reject) => {
      axios.post(our_url, {
          responseType: 'arraybuffer'
      })
      .then(res => {
          if (res.data === "unexpected error") {  //出错
              alert("数据库查询失败");
              resolve('');
          }
          else if (res.data === "model not exist") {  //出错
            alert("未找到指定模型");
            resolve('');
          }
          else {
              const blob = new Blob([res.data], { type: 'application/octet-stream' });
              const url = URL.createObjectURL(blob);
              resolve(url);
          }
      })
      .catch(e => {
          alert("404 GetFileOfOneModel响应失败: " + e.message);
          resolve('');
      });
  });
};

//创建新模型
//model和preview_picture形如selectedfile
handleAddNewModel = async (username,preview_picture,model) => {  //给出用户名，模型，预览图，加到私有库里
  try{
    let modelID=-1

    //传模型
    const formData = new FormData()
    formData.append('model', model);

    await axios.post("/api/fnyAddNewModel/"+username,formData)
    .then(res=>{
      if(res.data.text === "error when finding user"){
        alert("错误：找不到用户")
        return
      }
      else if(res.data.text === "user not found"){
        alert("用户不存在")
        return
      }
      else if(res.data.text === "error when inserting new model"){
        alert("错误：创建新模型失败")
        return
      }
      else if(res.data.text === "error when creating user_model"){
        alert("错误：加入私有库失败")
        return
      }
      else if(res.data.text === "successful"){
        modelID=res.data.modelID
        return
      }
    })
    .catch(e=>{
      alert("404 GetModelPreviewPicture响应失败: " + e.message);
      return
    })

    //传预览图
    const formData_ = new FormData()
    formData_.append('preview_picture', preview_picture);
    await axios.post("/api/fnyUplodeModelPreviewPicture/"+modelID,formData_)
    .then(res=>{
      if(res.data === "update preview picture path failed"){
        alert("预览图片存储失败")
        return
      }
      else if(res.data === "successful"){
        return
      }
    })
    .catch(e=>{
      alert("404 UplodeModelPreviewPicture响应失败: " + e.message);
      return
    })
  }
  catch{
    
  }
  finally{

  }
};

//发帖
//model和preview_picture形如selectedfile
handleReleasePost = async (username,text,preview_picture,model,canEdit) => {  //给出用户名，模型，预览图，加到私有库里
  try{
    let postID=-1

    //传模型
    const formData = new FormData()
    formData.append('model', model);

    await axios.post("/api/fnyReleasePost/"+username+"/"+text+"/"+canEdit,formData)
    .then(res=>{
      if(res.data.text === "model wrong"){
        alert("模型文件出错")
        return
      }
      else if(res.data.text === "error when finding user"){
        alert("错误：找不到用户")
        return
      }
      else if(res.data.text === "user not found"){
        alert("用户不存在")
        return
      }
      else if(res.data.text === "error when inputing new post to posts"){
        alert("错误：创建新帖子失败")
        return
      }
      else if(res.data.text === "successfully release post"){
        postID=res.data.postID
        return
      }
    })
    .catch(e=>{
      alert("404 GetReleasePost响应失败: " + e.message);
      return
    })

    //传帖子
    const formData_ = new FormData()
    formData_.append('preview_picture', preview_picture);
    await axios.post("/api/fnyUplodePostPreviewPicture/"+postID,formData_)
    .then(res=>{
      if(res.data === "update preview picture path failed"){
        alert("帖子预览图片存储失败")
        return
      }
      else if(res.data === "update preview picture success"){
        return
      }
    })
    .catch(e=>{
      alert("404 UplodePostPreviewPicture响应失败: " + e.message);
      return
    })
  }
  catch{
    
  }
  finally{

  }
};

//点赞
handleLike = async (username,postID,add_or_delete) => {
  try{
    await axios.post("/api/fnyAddOrDeleteLike",{  //注意修改这个post路径，改完告我一声
      username,postID,add_or_delete
    })
    .then(res=>{
      if(res.data === "error when finding user"){
        alert("错误：找不到用户")
        return
      }
      else if(res.data === "user not found"){
        alert("用户不存在")
        return
      }
      else if(res.data === "unexpected error"){
        alert("操作失败")
        return
      }
      else if(res.data === "error when finding post"){
        alert("错误：找不到帖子")
        return
      }
      else if(res.data === "post not found"){
        alert("帖子已不存在")
        return
      }
      else if(res.data === "update post like num failed"){
        alert("更新帖子点赞数失败")
        return
      }
      else if(res.data === "error when finding author"){
        alert("查找帖子作者失败")
        return
      }
      else if(res.data === "author not found"){
        alert("找不到帖子作者")
        return
      }
      else if(res.data === "update author like num failed"){
        alert("更新帖子作者点赞数失败")
        return
      }
      else if(res.data === "successful"){
        return
      }
    })
    .catch(e=>{
      alert("404 AddOrDeleteLike响应失败: " + e.message);
    })
  }
  catch{
    
  }
  finally{
    
  }
};

//收藏
handleStore = async (username,postID,add_or_delete) => {
  try{
    await axios.post("/api/fnyAddOrDeleteStore",{
      username,postID,add_or_delete
    })
    .then(res=>{
      if(res.data === "error when finding user"){
        alert("错误：找不到用户")
        return
      }
      else if(res.data === "user not found"){
        alert("用户不存在")
        return
      }
      else if(res.data === "unexpected error"){
        alert("操作失败")
        return
      }
      else if(res.data === "update user store num failed"){
        alert("更新用户总收藏数失败")
        return
      }
      else if(res.data === "error when finding post"){
        alert("错误：找不到帖子")
        return
      }
      else if(res.data === "post not found"){
        alert("帖子已不存在")
        return
      }
      else if(res.data === "update post store num failed"){
        alert("更新帖子收藏数失败")
        return
      }
      else if(res.data === "successful"){
        return
      }
    })
    .catch(e=>{
      alert("404 AddOrDeleteStore响应失败: " + e.message);
    })
  }
  catch{
    
  }
  finally{
    
  }
};

//公共库挪进自己的库
handleAddToPrivateModel = async (username,model_id) => {
  try{
    await axios.post("/api/fnyAddToPrivateModel",{
      username,model_id
    })
    .then(res=>{
      if(res.data === "error when finding user"){
        alert("错误：找不到用户")
        return
      }
      else if(res.data === "user not found"){
        alert("用户不存在")
        return
      }
      else if(res.data === "insert error"){
        alert("添加模型到私有库失败")
        return
      }
      else if(res.data === "successful"){
        return
      }
    })
    .catch(e=>{
      alert("404 AddToPrivateModel响应失败: " + e.message);
    })
  }
  catch{
    
  }
  finally{
    
  }
};

//获取聊天记录
let chat_message_list=[]  //列表的每个元素是一个字典
// {
//   send_or_receive: 1,  //0表示发，1表示收
//   content:item.message_content,  //一句话的内容
//   send_time:item.send_time  //发送时间
// }
handleGetChatMessages = async (username,ano_username) => {  //username是当前用户，ano_username是他在和谁聊天
  try{
    await axios.post("/api/fnyGetChatMessages",{
      username,ano_username
    })
    .then(res=>{
      if(res.data.text === "error when finding user"){
        alert("错误：找不到用户")
        return
      }
      else if(res.data.text === "user not found"){
        alert("用户不存在")
        return
      }
      else if(res.data.text === "error when searching chat message"){
        alert("错误：查询聊天记录失败")
        return
      }
      else if(res.data.text === "successful"){
        chat_message_list=res.data.chat_message
        return
      }
    })
    .catch(e=>{
      alert("404 fnyGetChatMessages响应失败: " + e.message);
    })
  }
  catch{
    
  }
  finally{
    
  }
};

//获取收到的赞/收藏
let like_store_post_list=[]  //列表的每个元素是一个字典，包含帖子的信息
// 按发布时间从最新开始排序
// {
//   post_id: one_post.id,  //帖子编号
//   like_num: one_post.like_num,  //点赞数
//   store_num: one_post.store_num  //收藏数
// };
handleGetLikeStorePostList = async (username) => {  //username是当前用户，ano_username是他在和谁聊天
  try{
    await axios.post("/api/fnyGetLikeStorePostList",{
      username
    })
    .then(res=>{
      if(res.data.text === "error when finding user"){
        alert("错误：找不到用户")
        return
      }
      else if(res.data.text === "user not found"){
        alert("用户不存在")
        return
      }
      else if(res.data.text === "error when finding posts"){
        alert("错误：查询帖子信息失败")
        return
      }
      else if(res.data.text === "successful"){
        like_store_post_list=res.data.array
        return
      }
    })
    .catch(e=>{
      alert("404 fnyGetLikeStorePostList响应失败: " + e.message);
    })
  }
  catch{
    
  }
  finally{
    
  }
};

//添加聊天记录
handleAddChatMessage = async (username,ano_username,text) => {  //username是当前用户，ano_username是他在和谁聊天
  try{
    await axios.post("/api/fnyAddChatMessage",{
      username,ano_username,text
    })
    .then(res=>{
      if(res.data === "error when finding user"){
        alert("错误：找不到用户")
        return
      }
      else if(res.data === "user not found"){
        alert("用户不存在")
        return
      }
      else if(res.data === "insert error"){
        alert("错误：记录聊天信息失败")
        return
      }
      else if(res.data === "successful"){
        return
      }
    })
    .catch(e=>{
      alert("404 fnyAddChatMessage响应失败: " + e.message);
    })
  }
  catch{
    
  }
  finally{
    
  }
};