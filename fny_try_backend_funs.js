//用户
const createTableSql_userInfo = `
    CREATE TABLE userInfo (     
        id INT AUTO_INCREMENT PRIMARY KEY, 
        username VARCHAR(255),
        password VARCHAR(255),
        avatarPath VARCHAR(255),
        attention_num INT DEFAULT 0,
        store_num INT DEFAULT 0,
        transmit_num INT DEFAULT 0,
        totle_post_num INT DEFAULT 0,
        totle_like_num INT DEFAULT 0,
        totle_reported_num INT DEFAULT 0,
        regester_time DATETIME DEFAULT NOW()
    )DEFAULT CHARSET=utf
`;


//帖子
const createTableSql_posts = `
    CREATE TABLE posts (     
        id INT AUTO_INCREMENT PRIMARY KEY, 
        preview_picture_path VARCHAR(255),
        post_time DATETIME DEFAULT NOW(),
        model_path VARCHAR(255),
        post_text TEXT,
        author_id INT, 
        like_num INT DEFAULT 0,
        store_num INT DEFAULT 0,
        reported_num INT DEFAULT 0,
        forward_num INT DEFAULT 0,
        can_edit TINYINT DEFAULT 1
    )DEFAULT CHARSET=utf8
`;


//用户收藏帖子的中间表
const createTableSql_user_post_store = `
    CREATE TABLE user_post_store (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        user_id INT,
        post_id INT,
        store_time DATETIME DEFAULT NOW(),
        constraint fk_post_id foreign key (post_id) references posts (id),
        constraint fk_user_id foreign key (user_id) references userInfo (id)
    )
`;


//用户点赞帖子的中间表
const createTableSql_user_post_like = `
    CREATE TABLE user_post_like (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        user_id INT,
        post_id INT,
        like_time DATETIME DEFAULT NOW(),
        constraint fk_post_id foreign key (post_id) references posts (id),
        constraint fk_user_id foreign key (user_id) references userInfo (id)
    )
`;


//用户关注用户的中间表
const createTableSql_user_attention_user = `
    CREATE TABLE user_attention_user (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        user_id INT, -- 关注主人
        attentioned_user_id INT, -- 被关注者
        attention_time DATETIME DEFAULT NOW(),
        constraint fk_user_id foreign key (user_id) references userInfo (id),  
        constraint fk_attentioned_user_id foreign key (attentioned_user_id) references userInfo (id)  
    )
`;

//评论
const createTableSql_comments = `
    CREATE TABLE comments (
        id INT AUTO_INCREMENT PRIMARY KEY,     
        comment_text TEXT,
        post_id INT, 
        comment_person_id INT,
        comment_time DATETIME DEFAULT NOW(),
        constraint fk_post_id foreign key (post_id) references posts (id),  
        constraint fk_comment_person_id foreign key (comment_person_id) references userInfo (id)  
    )DEFAULT CHARSET=utf8
`;


//模型仓库中的模型
const createTableSql_models_in_repository = `
    CREATE TABLE models_in_repository (
        id INT AUTO_INCREMENT PRIMARY KEY,
        preview_picture_path VARCHAR(255),
        model_path VARCHAR(255)
    )
`;


//模型仓库中的模型和用户的中间表
const createTableSql_user_model_repository = `
    CREATE TABLE user_model_repository (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        repository_time DATETIME DEFAULT NOW(),
        user_id INT, 
        model_id INT,
        constraint fk_model_id foreign key (model_id) references models_in_repository (id),  
        constraint fk_user_id foreign key (user_id) references userInfo (id)  //用户表名称需要修改
    )
`;


//聊天信息
const createTableSql_chat_messages = `
    CREATE TABLE chat_messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        sender_user_id INT,
        receiver_user_id INT,
        send_time DATETIME DEFAULT NOW(),
        message_content TEXT,
        constraint fk_sender_user_id foreign key (sender_user_id) references userInfo (id),  //用户表名称需要修改
        constraint fk_receiver_user_id foreign key (receiver_user_id) references userInfo (id)  //用户表名称需要修改
    )
`;


//以下创建数据库代码加在db.connect后
db.query(createTableSql_userInfo, (err, result) => {
    if (err) throw err;
    console.log('Table userInfo created.');
});

db.query(createTableSql_posts, (err, result) => {
    if (err) throw err;
    console.log('Table posts created.');
});

db.query(createTableSql_user_post_store, (err, result) => {
    if (err) throw err;
    console.log('Table user_post_store created.');
});

db.query(createTableSql_user_post_like, (err, result) => {
    if (err) throw err;
    console.log('Table user_post_like created.');
});

db.query(createTableSql_user_attention_user, (err, result) => {
    if (err) throw err;
    console.log('Table user_attention_user created.');
});

db.query(createTableSql_comments, (err, result) => {
    if (err) throw err;
    console.log('Table comments created.');
});

db.query(createTableSql_models_in_repository, (err, result) => {
    if (err) throw err;
    console.log('Table models_in_repository created.');
});

db.query(createTableSql_chat_messages, (err, result) => {
    if (err) throw err;
    console.log('Table chat_messages created.');
});


//以下创建新路径代码加在db.connect之前
const model_storage = multer.diskStorage({
    //图片保存路径
    destination: function(req, file, cb){
      cb(null, '/home/ubuntu/software/data/model')
    },
    filename: function(req, file, cb){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload_model = multer({storage: model_storage})

const preview_picture_storage = multer.diskStorage({
    //图片保存路径
    destination: function(req, file, cb){
      cb(null, '/home/ubuntu/software/data/preview_picture')
    },
    filename: function(req, file, cb){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload_preview_picture = multer({storage: preview_picture_storage})



//请求一个模型的预览图
app.post('/api/fnyGetModelPreviewPicture/:model_id', async(req, res) => {
    const {model_id} = req.params.model_id
    const sql_search_model = "select * from models_in_repository where id = ?"
    db.query(sql_search_model,[model_id],(err,result)=>{
        if(err){
            res.json("unexpected error")
            console.log("查找模型预览图出错")
            return
        }
        else if(result.length<=0){
            res.json("model not exist")
            console.log("未找到指定预览图")
            return
        }
        else{
            const preview_picture_path = result[0].model_path
            res.sendFile(preview_picture_path)
            console.log("成功发送指定预览图")
            return
        }
    })
});

//给出用户，返回其所有私有库的列表
app.post('/api/fnyGetUserModel', async(req, res) => {
    const{username} = req.body

    let userID=-1
    //先根据用户名找到用户ID
    const sql_search_username = "select * from userInfo where username = ?"
    db.query(sql_search_username,[username],(err,result)=>{
        if(err){
            res.json({text:"error when finding user"})
            console.log("意外情况：查找用户出错")
            return
        }
        else if(result.length<=0){
            res.json({text:"user not found"})
            console.log("意外情况：找不到用户")
            return
        }
        else{
            userID = result[0].id
            console.log("用户ID查询成功")
        }
    })

    const sql_search_models = "select * from user_model_repository where user_id = ? order by repository_time desc"
    db.query(sql_search_models,[userID],(err,result)=>{
        if(err){
            res.json({text:"error when searching models"})
            console.log("意外情况：查找私有模型列表出错")
            return
        }
        else{
            res.json({
                text: "successful",
                model_list: result.map((item) => {
                    return item.model_id
                })
            })
            console.log("私有模型查询成功")
        }
    })
});

//给出用户和模型ID，从用户的私有列表里删去这个模型
app.post('/api/fnyDeleteOneUserModel', async(req, res) => {
    const{username,modelID} = req.body

    let userID=-1
    //先根据用户名找到用户ID
    const sql_search_username = "select * from userInfo where username = ?"
    db.query(sql_search_username,[username],(err,result)=>{
        if(err){
            res.json("error when finding user")
            console.log("意外情况：查找用户出错")
            return
        }
        else if(result.length<=0){
            res.json("user not found")
            console.log("意外情况：找不到用户")
            return
        }
        else{
            userID = result[0].id
            console.log("用户ID查询成功")
        }
    })

    const sql_delete_one_model = 'delete from user_model_repository where user_id= ? and model_id = ?'
        db.query(sql_delete_one_model,[userID,modelID], (err, result) => {
        if(err){
            res.json("unexpected error")
            console.log("删除私有模型失败")
            return
        }
        res.json("successful")
        console.log("成功删除私有模型")
    })
});

//两个模型的拼接
//请求一个模型的点云文件
app.post('/api/fnyGetFileOfOneModel/:modelId', async(req, res) => {
    const model_id = req.params.modelID
    const sql_search_model = "select * from models_in_repository where model = ?"
    db.query(sql_search_model,[model_id],(err,result)=>{
        if(err){
            res.json("unexpected error")
            console.log("查找指定模型出错")
            return
        }
        else if(result.length<=0){
            res.json("model not exist")
            console.log("未找到指定模型")
            return
        }
        else{
            const modelPath = result[0].model_path
            res.sendFile(modelPath)
            console.log("成功发送指定模型")
            return
        }
    })
});

//创建新模型(发送点云文件)
app.post('/api/fnyAddNewModel/:username',upload_model.single('model'), async(req, res) => {  //post的路径需要修改
    const username = req.params.username
    const model_Path = req.file.path

    let userID=-1
    let modelID=-1
    if(model_Path==null){
      res.json({text:"model wrong"})
      console.log("model wrong")
      return
    }
    else{
        //先根据用户名找到用户ID
        const sql_search_username = "select * from userInfo where username = ?"
        db.query(sql_search_username,[username],(err,result)=>{
            if(err){
                res.json({text:"error when finding user"})
                console.log("意外情况：查找发帖用户出错")
                return
            }
            else if(result.length<=0){
                res.json({text:"user not found"})
                console.log("意外情况：找不到发帖用户")
                return
            }
            else{
                userID = result[0].id
                console.log("发帖用户ID查询成功")
            }
        })

        const sql_insert_model = 'INSERT INTO models_in_repository SET ?';
        db.query(sql_insert_model, {model_path:model_Path,preview_picture_path:""}, (err, result) => {
            if(err){
              res.json({text:"error when inserting new model"})
              console.log("数据库插入新模型失败")
              return
            }
            modelID=result.insertId
            console.log("成功加入新模型")
        })

        const sql_insert_user_model = 'INSERT INTO user_model_repository SET ?';
        db.query(sql_insert_user_model, {model_id:modelID,user_id:userID}, (err, result) => {
            if(err){
              res.json({text:"error when creating user_model"})
              console.log("数据库新建用户-模型关系失败")
              return
            }
            res.json({
                text: "successful",
                modelID: modelID
            })
            console.log("成功新建用户-模型对应关系")
        })
    }
});
//再发送预览图
app.post('/api/fnyUplodeModelPreviewPicture/:modelID',upload_preview_picture.single('preview_picture'), async(req, res) => {  //post的路径需要修改
    const modelID = req.params.modelID
    const preview_Picture_Path = req.file.path

    
    const changePicturePath = 'UPDATE models_in_repository SET preview_picture_path = ? WHERE id = ?'
    db.query(changePicturePath, [preview_Picture_Path, modelID], (err, result) => {
        if (err) {
            res.json("update preview picture path failed")
            console.log("错误：模型存储预览图失败")
            return
        }
        else{
            res.json("successful")
            console.log("成功存储模型预览图")
            return
        }
    });
});

//发布帖子
app.post('/api/fnyReleasePost/:username/:text/:canEdit',upload_model.single('model'), async(req, res) => {  //post的路径需要修改
    const username = req.params.username
    const text = req.params.text
    const canEdit = req.params.canEdit
    const model_Path = req.file.path

    let userID=-1
    if(model_Path==null){
      res.json({text:"model wrong"})
      console.log("model wrong")
      return
    }
    else{
        //先根据用户名找到用户ID
        const sql_search_username = "select * from userInfo where username = ?"
        db.query(sql_search_username,[username],(err,result)=>{
            if(err){
                res.json({text:"error when finding user"})
                console.log("意外情况：查找发帖用户出错")
                return
            }
            else if(result.length<=0){
                res.json({text:"user not found"})
                console.log("意外情况：找不到发帖用户")
                return
            }
            else{
                userID = result[0].id
                console.log("发帖用户ID查询成功")
            }
        })

        const sql_insert = 'INSERT INTO posts SET ?';
            db.query(sql_insert, {author_id:userID,post_text:text,can_edit:canEdit,model_path:model_Path,preview_picture_path:""}, (err, result) => {
            if(err){
              res.json({text:"error when inputing new post to posts"})
              console.log("数据库插入帖子失败")
              return
            }
            res.json({
                text: "successfully release post",
                postID: result.insertId
            })
            console.log("成功发帖")
        })
    }
});
//发帖存预览图片
app.post('/api/fnyUplodePostPreviewPicture/:postID',upload_preview_picture.single('preview_picture'), async(req, res) => {  //post的路径需要修改
    const postID = req.params.postID
    const preview_Picture_Path = req.file.path

    
    const changeAvatar = 'UPDATE posts SET preview_picture_path = ? WHERE id = ?'
    db.query(changeAvatar, [preview_Picture_Path, postID], (err, result) => {
        if (err) {
            res.json("update preview picture path failed")
            console.log("错误：存储预览图失败")
            return
        }
        else{
            res.json("update preview picture success")
            console.log("成功存储预览图")
            return
        }
    });
});

//点赞收藏
app.post('/api/fnyAddOrDeleteLike', async(req, res) => {  //点赞
    const{username,postID,add_or_delete} = req.body
  
    let userID=-1
    //先根据用户名找到用户ID
    const sql_search_username = "select * from userInfo where username = ?"
    db.query(sql_search_username,[username],(err,result)=>{
        if(err){
            res.json("error when finding user")
            console.log("意外情况：查找点赞用户出错")
            return
        }
        else if(result.length<=0){
            res.json("user not found")
            console.log("意外情况：找不到点赞用户")
            return
        }
        else{
            userID = result[0].id
            console.log("点赞用户ID查询成功")
        }
    })

    if(add_or_delete==0){  //add
        const sql_insert_like = 'INSERT INTO user_post_like SET ?';
            db.query(sql_insert_like, {user_id:userID,post_id:postID}, (err, result) => {
            if(err){
              res.json("unexpected error")
              console.log("插入点赞信息失败")
              return
            }
            console.log("成功点赞")
        })
    }
    else{  //delete
        const sql_delete_like = 'delete from user_post_like where user_id= ? and post_id = ?'
            db.query(sql_delete_like,[userID,postID], (err, result) => {
            if(err){
              res.json("unexpected error")
              console.log("删除点赞信息失败")
              return
            }
            console.log("成功删除点赞")
        })
    }

    //点赞引发的相关事件
    //先获得帖子信息
    let new_post_like_num=0
    let authorID=-1
    let new_user_like_num=0
    const sql_search_postinfo = "select * from posts where id = ?"
    db.query(sql_search_postinfo,[postID],(err,result)=>{
        if(err){
            res.json("error when finding post")
            console.log("意外情况：查找帖子失败")
            return
        }
        else if(result.length<=0){
            res.json("post not found")
            console.log("意外情况：找不到帖子")
            return
        }
        else{
            new_post_like_num = result[0].like_num
            authorID = result[0].author_id
            console.log("获取帖子相关信息")
        }
    })
    //帖子总赞数改变
    if(add_or_delete==0){
        new_post_like_num+=1
    }
    else{
        new_post_like_num-=1
    }
    const change_post_like_num = 'UPDATE posts SET like_num = ? WHERE id = ?'
    db.query(change_post_like_num, [new_post_like_num, postID], (err, result) => {
        if (err) {
            res.json("update post like num failed")
            console.log("错误：更新帖子点赞数失败")
            return
        }
        else{
            console.log("成功更新帖子点赞数")
        }
    });

    //发帖用户总赞数改变
    const sql_search_authorinfo = "select * from userInfo where id = ?"
    db.query(sql_search_authorinfo,[authorID],(err,result)=>{
        if(err){
            res.json("error when finding author")
            console.log("意外情况：查找帖子作者失败")
            return
        }
        else if(result.length<=0){
            res.json("author not found")
            console.log("意外情况：找不到帖子作者")
            return
        }
        else{
            new_user_like_num = result[0].totle_like_num
            console.log("获取帖子作者相关信息")
        }
    })
    if(add_or_delete==0){
        new_user_like_num+=1
    }
    else{
        new_user_like_num-=1
    }
    const change_author_like_num = 'UPDATE userInfo SET totle_like_num = ? WHERE id = ?'
    db.query(change_author_like_num, [new_user_like_num, authorID], (err, result) => {
        if (err) {
            res.json("update author like num failed")
            console.log("错误：更新帖子作者点赞数失败")
            return
        }
        else{
            res.json("successful")
            console.log("成功更新帖子作者总点赞数")
        }
    });
});

app.post('/api/fnyAddOrDeleteStore', async(req, res) => {  //收藏
    const{username,postID,add_or_delete} = req.body

    let userID=-1
    let userStoreNum=0
    //先根据用户名找到用户ID
    const sql_search_username = "select * from userInfo where username = ?"
    db.query(sql_search_username,[username],(err,result)=>{
        if(err){
            res.json("error when finding user")
            console.log("意外情况：查找收藏用户出错")
            return
        }
        else if(result.length<=0){
            res.json("user not found")
            console.log("意外情况：找不到收藏用户")
            return
        }
        else{
            userID = result[0].id
            userStoreNum = result[0].store_num
            console.log("收藏用户ID查询成功")
        }
    })

    if(add_or_delete==0){  //add
        const sql_insert_store = 'INSERT INTO user_post_store SET ?';
            db.query(sql_insert_store, {user_id:userID,post_id:postID}, (err, result) => {
            if(err){
              res.json("unexpected error")
              console.log("插入收藏信息失败")
              return
            }
            console.log("成功收藏")
        })
    }
    else{  //delete
        const sql_delete_store = 'delete from user_post_store where user_id= ? and post_id = ?'
            db.query(sql_delete_store,[userID,postID], (err, result) => {
            if(err){
              res.json("unexpected error")
              console.log("删除收藏信息失败")
              return
            }
            console.log("成功删除收藏")
        })
    }

    //收藏引发的相关事件
    //用户收藏数变化
    if(add_or_delete==0){
        userStoreNum+=1
    }
    else{
        userStoreNum-=1
    }
    const change_user_store_num = 'UPDATE userInfo SET store_num = ? WHERE id = ?'
    db.query(change_user_store_num, [userStoreNum, userID], (err, result) => {
        if (err) {
            res.json("update user store num failed")
            console.log("错误：更新用户收藏数失败")
            return
        }
        else{
            console.log("成功更新用户收藏数")
        }
    });

    //先获得帖子信息
    let new_post_store_num=0
    const sql_search_postinfo = "select * from posts where id = ?"
    db.query(sql_search_postinfo,[postID],(err,result)=>{
        if(err){
            res.json("error when finding post")
            console.log("意外情况：查找帖子失败")
            return
        }
        else if(result.length<=0){
            res.json("post not found")
            console.log("意外情况：找不到帖子")
            return
        }
        else{
            new_post_store_num = result[0].store_num
            console.log("获取帖子相关信息")
        }
    })
    //帖子总赞数改变
    if(add_or_delete==0){
        new_post_store_num+=1
    }
    else{
        new_post_store_num-=1
    }
    const change_post_like_num = 'UPDATE posts SET store_num = ? WHERE id = ?'
    db.query(change_post_like_num, [new_post_store_num, postID], (err, result) => {
        if (err) {
            res.json("update post store num failed")
            console.log("错误：更新帖子收藏数失败")
            return
        }
        else{
            res.json("successful")
            console.log("成功更新帖子收藏数")
        }
    });
});


//公共库挪进自己的
app.post('/api/fnyAddToPrivateModel', async(req, res) => {  //收藏
    const{username,model_id} = req.body

    let userID=-1
    //先根据用户名找到用户ID
    const sql_search_username = "select * from userInfo where username = ?"
    db.query(sql_search_username,[username],(err,result)=>{
        if(err){
            res.json("error when finding user")
            console.log("意外情况：查找用户出错")
            return
        }
        else if(result.length<=0){
            res.json("user not found")
            console.log("意外情况：找不到用户")
            return
        }
        else{
            userID = result[0].id
            console.log("用户ID查询成功")
        }
    })

    const sql_insert_user_model = 'INSERT INTO user_model_repository SET ?';
    db.query(sql_insert_user_model, {user_id:userID,model_id:model_id}, (err, result) => {
        if(err){
            res.json("insert error")
            console.log("模型添加到私有库失败")
            return
        }
        res.json("successful")
        console.log("模型添加到私有库成功")
    })
});

//聊天
app.post('/api/fnyGetChatMessages', async(req, res) => {  //我会返回一个已经排好序的列表（发送时间从早到晚），直接显示即可
    //列表的每个元素是一个字典，其中send_or_receive为0表示发送，为1表示接收到的；content表示消息内容
    const{username,ano_username} = req.body

    let userID=-1
    let anoUserID=-1
    //先根据用户名找到用户ID
    const sql_search_username = "select * from userInfo where username = ?"
    db.query(sql_search_username,[username],(err,result)=>{
        if(err){
            res.json({text:"error when finding user"})
            console.log("意外情况：查找用户出错")
            return
        }
        else if(result.length<=0){
            res.json({text:"user not found"})
            console.log("意外情况：找不到用户")
            return
        }
        else{
            userID = result[0].id
            console.log("用户ID查询成功")
        }
    })

    db.query(sql_search_username,[ano_username],(err,result)=>{
        if(err){
            res.json({text:"error when finding user"})
            console.log("意外情况：查找另一个用户出错")
            return
        }
        else if(result.length<=0){
            res.json("user not found")
            console.log("意外情况：找不到另一个用户")
            return
        }
        else{
            anoUserID = result[0].id
            console.log("另一个用户ID查询成功")
        }
    })


    let array1=[]
    let array2=[]
    const sql_search_chat_message = "select * from chat_messages where sender_user_id =? and receiver_user_id = ?"
    db.query(sql_search_username,[userID,anoUserID],(err,result)=>{
        if(err){
            res.json({text:"error when searching chat message"})
            console.log("意外情况：查找发送聊天记录错误")
            return
        }
        else{
            array1 = result
            console.log("发送聊天记录查询成功")
        }
    })

    db.query(sql_search_username,[anoUserID,userID],(err,result)=>{
        if(err){
            res.json({text:"error when searching chat message"})
            console.log("意外情况：查找接收聊天记录错误")
            return
        }
        else{
            array2 = result
            console.log("接收聊天记录查询成功")
        }
    })

    //先整理一下聊天记录，只保留收发和内容
    array1= array1.map((item) => {
        return {
            send_or_receive: 0,  //0表示发，1表示收
            content:item.message_content,
            send_time:item.send_time
        }
    })

    array2= array2.map((item) => {
        return {
            send_or_receive: 1,  //0表示发，1表示收
            content:item.message_content,
            send_time:item.send_time
        }
    })

    let total_array=array1.concat(array2)
    total_array.sort((a, b) => {  return a.send_time - b.send_time;})
    res.json({
        text: "successful",
        chat_message: total_array
    })
    return
});

//赞
app.post('/api/fnyGetLikeStorePostList', async(req, res) => {  //收藏
    const{username} = req.body

    let userID=-1
    //先根据用户名找到用户ID
    const sql_search_username = "select * from userInfo where username = ?"
    db.query(sql_search_username,[username],(err,result)=>{
        if(err){
            res.json({text:"error when finding user"})
            console.log("意外情况：查找用户出错")
            return
        }
        else if(result.length<=0){
            res.json({text:"user not found"})
            console.log("意外情况：找不到用户")
            return
        }
        else{
            userID = result[0].id
            userStoreNum = result[0].store_num
            console.log("用户ID查询成功")
        }
    })

    const sql_search_posts = "select * from posts where author_id = ? order by post_time desc"
    db.query(sql_search_posts,[userID],(err,result)=>{
        if(err){
            res.json({text:"error when finding posts"})
            console.log("意外情况：查找用户已发帖子出错")
            return
        }
        else{
            let returnArray = result.map((one_post) => { 
                return {
                    post_id: one_post.id,
                    like_num: one_post.like_num,
                    store_num: one_post.store_num
                };
            });
            res.json({
                text: "successful",
                array: returnArray
            })
            console.log("用户ID查询成功")
        }
    })
});

//增加一条聊天记录
app.post('/api/fnyAddChatMessage', async(req, res) => {  //我会返回一个已经排好序的列表（发送时间从早到晚），直接显示即可
    //列表的每个元素是一个字典，其中send_or_receive为0表示发送，为1表示接收到的；content表示消息内容
    const{username,ano_username,text} = req.body

    let userID=-1
    let anoUserID=-1
    //先根据用户名找到用户ID
    const sql_search_username = "select * from userInfo where username = ?"
    db.query(sql_search_username,[username],(err,result)=>{
        if(err){
            res.json({text:"error when finding user"})
            console.log("意外情况：查找用户出错")
            return
        }
        else if(result.length<=0){
            res.json({text:"user not found"})
            console.log("意外情况：找不到用户")
            return
        }
        else{
            userID = result[0].id
            console.log("用户ID查询成功")
        }
    })

    db.query(sql_search_username,[ano_username],(err,result)=>{
        if(err){
            res.json({text:"error when finding user"})
            console.log("意外情况：查找另一个用户出错")
            return
        }
        else if(result.length<=0){
            res.json("user not found")
            console.log("意外情况：找不到另一个用户")
            return
        }
        else{
            anoUserID = result[0].id
            console.log("另一个用户ID查询成功")
        }
    })

    const sql_insert_chat_message = 'INSERT INTO chat_messages SET ?';
    db.query(sql_insert_chat_message, {sender_user_id:userID,receiver_user_id:anoUserID,message_content:text}, (err, result) => {
        if(err){
            res.json("insert error")
            console.log("添加聊天记录失败")
            return
        }
        res.json("successful")
        console.log("添加聊天记录成功")
    })
});