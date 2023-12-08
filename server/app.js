const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

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

// app.all("*", function (req, res, next) {
//   //设置允许跨域的域名，*代表允许任意域名跨域
//   res.header("Access-Control-Allow-Origin", "*");
//   //允许的header类型
//   res.header("Access-Control-Allow-Headers", "content-type");
//   //跨域允许的请求方式
//   res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
//   if (req.method.toLowerCase() == "options") res.send(200);
//   //让options尝试请求快速结束
//   else next();
// });

// app.use(
//   "/api",
//   createProxyMiddleware({
//     target: "http://183.172.230.250:3000",
//     changeOrigin: true,

//   })
// );

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

app.listen(8081, () => {
  console.log(`Server is running on port 8081`);
});



// // 注册页面路由
// app.get('/register', (req, res) => {
//   res.render('register');
// });

// // 注册处理
// app.post('/register', (req, res) => {
//   const { username, password } = req.body;
//   const user = { username, password };
//   const sql = 'INSERT INTO users SET ?';
//   db.query(sql, user, (err, result) => {
//     if (err) {
//         if (err.code === 'UNKNOWN_CODE_PLEASE_REPORT') {
//             // 如果是 CHECK 约束错误，可以根据错误消息进行自定义处理
//             if (err.message.includes('1')) {
//                 console.error('用户名长度不符合要求');
//             } 
//             else if(err.message.includes('2')){
//                 console.error('密码长度不符合要求');
//             }
//             else {
//                 console.error('其他 CHECK 约束错误:', err.message);
//             }
//         } 
//         else {
//             console.error('其他数据库错误:', err.message);
//         }
//         res.redirect('/register');
//     }
//     else{
//         res.redirect('/login');
//     }
//   });
// });

// // 登录页面路由
// app.get('/login', (req, res) => {
//   res.render('login');
// });

// // 登录处理
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
//   db.query(sql, [username, password], (err, result) => {
//     if (err) throw err;
//     if (result.length > 0) {
//       res.send('登录成功！');
//     } else {
//       res.send('用户名或密码错误！');
//     }
//   });
// });

// app.get('/api/login', (req, res) => {
//   res.send('zyc');
//   // 从前端接收到的数据
//   const {username, password, confirmPassword} = req.body;
//   if (username.length < 2 || username.length > 15){
//     res.json({ message: '用户名长度不对' });
//   }
//   else{
//     res.json({ message: '正确' });
//   }
// });

// app.post('/api/login', (req, res) => {
//   res.json({ message: 'Data received and processed on the server!' });
// });



