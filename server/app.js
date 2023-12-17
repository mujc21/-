const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

const storage = multer.diskStorage({
  //图片保存路径
  destination: function(req, file, cb){
    cb(null, '/home/ubuntu/software/data/photo')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({storage: storage})

// 创建MySQL连接
const db = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '20030415', // MySQL密码
  database: 'user' // 数据库名称
});

// 连接到MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected');
});


//注册
app.post('/api/register', (req, res) => {
    const{username,password,confirmPassword} = req.body
    if(username.length < 2 || username.length > 15){
      res.json("username length wrong")
      console.log("username length wrong")
    }
    else if(password.length < 8 || password.length > 15){
      res.json("password length wrong")
      console.log("password length wrong")
    }
    else if(password != confirmPassword){
      res.json("different password")
      console.log("different password")
    }
    else{
      const sql_search = "select * from userInfo where username=?"
      db.query(sql_search,[username],(err,result)=>{
        if(err){
          res.json("数据库查询失败")
          console.log("数据库查询失败")
        }
        else if(result.length>0){
          res.json("用户被占用")
          console.log("用户被占用")
        }
        else{
          const sql_insert = 'INSERT INTO userInfo SET ?';
          db.query(sql_insert, {username:username,password:password}, (err, result) => {
            if(err){
              res.json("数据库插入失败")
              console.log("数据库插入失败")
              return
            }
            res.json("成功创建用户")
            console.log("成功创建用户")
          })
        }
      })
      
    }
});

//登录
app.post('/api/login', async(req, res) => {
  const{username,password} = req.body
  const sql_search = "select * from userInfo where username=?"

  db.query(sql_search,[username],(err,result)=>{
    if(err){
      res.json("数据库查询失败")
      console.log("数据库查询失败")
      return
    }
    else if(result.length<=0){
      res.json("该用户未注册")
      console.log("该用户未注册")
      return
    }
    else if(password != result[0].password){
      res.json("密码错误！")
      console.log("密码错误！")
      return
    }
    else{
      res.json("登录成功！")
      console.log("登录成功！")
      return
    }
  })

  
});

//个人主页数字信息获取
app.get('/api/mypagenumber/:username', async(req, res) => {
  const username = req.params.username
  const sql_search = "select * from userInfo where username = ?"
  db.query(sql_search,[username],(err,result)=>{
    if(err){
      res.json("数据库查询失败")
      console.log("数据库查询失败")
      return
    }
    else if(result.length<=0){
      res.json("该用户不存在")
      console.log("该用户不存在")
      return
    }
    else{
      const user = result[0]
      res.json({
        attention_num: user.attention_num,
        store_num: user.store_num, 
        transmit_num: user.transmit_num
      });
      console.log("个人主页数字信息查询成功")
      return
    }
  })

});

//个人主页头像信息获取
app.get('/api/mypageavatar/:username', async(req, res) => {
  const username = req.params.username
  const sql_search = "select * from userInfo where username = ?"
  db.query(sql_search,[username],(err,result)=>{
    if(err){
      res.json("数据库查询失败")
      console.log("数据库查询失败")
      return
    }
    else if(result.length<=0){
      res.json("该用户不存在")
      console.log("该用户不存在")
      return
    }
    else{
      const avatarPath = result[0].avatarPath;
      res.sendFile(avatarPath);
      console.log("个人主页头像信息查询成功")
      return
    }
  })

});

//更改头像
app.post('/api/change-avatar/:username',upload.single('avatar'), async(req, res) => {
  const username = req.params.username
  console.log(username)
  const avatarPath = req.file.path;

  const changeAvatar = 'UPDATE userInfo SET avatarPath = ? WHERE username = ?'
  db.query(changeAvatar, [avatarPath, username], (err, result) => {
    if (err) {
      res.json("数据库头像路径更新失败")
      console.log("数据库头像路径更新失败")
      return
    }
    else{
      res.json("修改头像成功")
      console.log("修改头像成功")
      return
    }
  });
});


//案例
// app.post('/upload', upload.single('avatar'), (req, res) => {

//   res.send('ok')
// });


app.listen(8081, () => {
  console.log(`Server is running on port 8081`);
});





