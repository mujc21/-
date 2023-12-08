import React, { Component } from 'react'
import {useState, useEffect} from 'react'
import './App.css';
import axios from 'axios'

import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import MessageList from './components/Mails/Message_List/Message_List';
import Mails from './components/Mails/Mails'
import Menu from './components/Menu/Menu'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Discover from './components/Discover/Discover'
import My from './components/My/My'

export default class App extends Component {
    // 在运行过程中会因事件发生改变的数据要放到state里
    componentDidMount(){
      this.setState({enterTimes: 0,})
    }
    state = {
      Login_Email_String:'',
      Login_Password_String:'',
      Register_Email_String:'',
      Register_Password_String:'',
      Confirm_Password_String:'',
      enterTimes: 0,
      select_Bar_State: '',
      isLogin: false,
      enterRegister: false,
      initialJump: 0,
      reloadRegister: false,
      messages:[
        {id: 1, 
          username: 'User1', 
          message: [{ id: 1, sender: '', chat: 'Hello from Piggy1!', avatar: '/picture/head_structure'},
                    { id: 2, sender: 'User1', chat: 'Hi there!', avatar: '/picture/zepp.jpg'},
                    { id: 3, sender: '', chat: 'How are you?' }], 
        avatar: '/picture/zepp.jpg'},
        {id: 2, 
          username: 'User2', 
          message: [{ id: 1, sender: '', chat: 'Hello from Piggy2!', avatar: '/picture/head_structure'},
                    { id: 2, sender: 'User2', chat: 'Hi there!', avatar: '/picture/head_structure.jpeg'},
                    { id: 3, sender: '', chat: 'How are you?' }],
        avatar: '/picture/head_structure.jpeg'},
      ],
      selfInfo:{
        avatar: '/picture/head_structure.jpeg',
        username: 'Chris',
        attention_num: 12,
        store_num: 13,
        transmit_num: 1230
    },
    }
  
    fun_Login_Change_Email = (new_Email_String) =>{
      this.setState({Login_Email_String: new_Email_String})
    }
  
    fun_Login_Change_Key = (new_Key_String) =>{
      this.setState({Login_Password_String: new_Key_String})
    }
  
    handleLogin = async (username, password) => {
      try{
        await axios.post("/api/login",{
          username,password
        })
        .then(res=>{
          if(res.data === "数据库查询失败"){
            alert("响应失败，请重试")
            this.setState({isLogin: false})
            return
          }
          else if(res.data === "该用户未注册"){
            alert("该用户未注册")
            this.setState({isLogin: false})
            return
          }
          else if(res.data === "密码错误！"){
            alert("密码错误！")
            this.setState({isLogin: false})
            return
          }
          else if(res.data === "登录成功！"){
            alert("登录成功！")
            this.setState({isLogin: true})
            this.setState({initialJump: 1})
            return
          }
        })
        .catch(e=>{
          this.setState({isLogin: false})
          alert("响应失败，请重试")
        })
      }
      catch{
        this.setState({isLogin: false})
        alert("响应失败，请重试")
      }

    };

    fun_Login_OK_Clicked = () =>{
      const temp_email = this.state.Login_Email_String
      const temp_key= this.state.Login_Password_String
      this.handleLogin(temp_email, temp_key)
      // alert("在添加管理员对话框中，确认按钮被按下\n用户名为："+temp_email+'\n密码为：'+temp_key)
    }

    fun_Register_Link_Clicked = () =>{
      this.setState({Login_Email_String:'', Login_Password_String:''})
      this.setState({enterRegister: true})
    }

    fun_Login_Link_Clicked = () =>{
      this.setState({Register_Email_String:'', Register_Password_String:'', Confirm_Password_String:''})
    }

    fun_Register_Change_Email = (new_Email_String) =>{
      this.setState({Register_Email_String: new_Email_String})
    }

    fun_Register_Change_Key = (new_Key_String) =>{
      this.setState({Register_Password_String: new_Key_String})
    }

    fun_Register_Change_Confirm_Key = (new_Key_String) =>{
      this.setState({Confirm_Password_String: new_Key_String})
    }

    fun_Avatar_Changed = (new_avatar_url) =>{
      this.setState(prevState => ({
        selfInfo:{
          ...prevState.selfInfo,
          avatar: new_avatar_url,
        }
      }));
    }

    resetInitialJump = () => {
      this.setState({initialJump: 0})
    }

    handleRegister = async (username, password, confirmPassword) => {
      try{
        await axios.post("/api/register",{
          username,password,confirmPassword
        })
        .then(res=>{
          if(res.data === "username length wrong"){
            alert("用户名长度不符合要求，应为2-15位，请重新输入")
            this.setState({enterRegister:true})
            this.setState({reloadRegister: true})
            return
          }
          else if(res.data === "password length wrong"){
            alert("密码长度不符合要求，应为8-15位，请重新输入")
            this.setState({enterRegister: true})
            return
          }
          else if(res.data === "different password"){
            alert("两次密码输入不一致，请重新输入")
            console.log("different password")
            this.setState({enterRegister: true})
            return
          }
          else if(res.data === "数据库查询失败"){
            alert("响应失败，请重试")
            this.setState({enterRegister: true})
            return
          }
          else if(res.data === "用户被占用"){
            alert("用户被占用，请重新输入")
            this.setState({enterRegister: true})
            
            return
          }
          else if(res.data === "数据库插入失败"){
            alert("响应失败，请重试")
            this.setState({enterRegister: true})
            return
          }
          else if(res.data === "成功创建用户"){
            alert("成功创建用户！")
            this.setState({enterRegister: false})
            // this.setState({enterRegister: false})
            return
          }
        })
        .catch(e=>{
          alert("响应失败，请重试")
        })
      }
      catch{
        alert("响应失败，请重试")
      }

    };

    fun_Register_OK_Clicked = () =>{
      // this.setState({enterRegister: false})
      const temp_email = this.state.Register_Email_String
      const temp_key= this.state.Register_Password_String
      const temp_confirm_key= this.state.Confirm_Password_String
      
      // this.setState({Register_Email_String:'', Register_Password_String:'', Confirm_Password_String:''})
      // alert("在添加管理员对话框中，确认按钮被按下\n用户名为："+temp_email+'\n密码为：'+temp_key+'\n确认密码为：'+temp_confirm_key)
      this.handleRegister(temp_email, temp_key, temp_confirm_key)
      // if (this.state.registerSuccess == 0){
      //   alert("失败")
      // }
    }

  render() {
      const divStyle = {
        display: 'flex',
      }

      

      const {isLogin, enterRegister} = this.state;

      let res = 0
      if (this.state.initialJump == 1){
        res = isLogin ? <Navigate to='/Discover'/> : enterRegister === true ? <></>: <Navigate to='/Login'/>
      }

      else{
        res = isLogin ? <></> : enterRegister === true ? <></>: <Navigate to='/Login'/>
      }
      
      return (
        <Router>
        <div style={divStyle}>
          {res}
          <Routes>
            <Route path="/Login" element={<Login Main_Style={{position:'absolute', left:'440px', top: '240px'}} Email_Input_Changed={this.fun_Login_Change_Email} Key_Input_Changed={this.fun_Login_Change_Key} OK_Clicked={this.fun_Login_OK_Clicked} enter_Register={this.fun_Register_Link_Clicked} />}/>
            <Route path="/Register" element={<Register Main_Style={{position:'absolute', left:'440px', top: '240px'}} Email_Input_Changed={this.fun_Register_Change_Email} Key_Input_Changed={this.fun_Register_Change_Key} Confirm_Key_Input_Changed={this.fun_Register_Change_Confirm_Key} OK_Clicked={this.fun_Register_OK_Clicked} enter_Login={this.fun_Login_Link_Clicked}/>}/>  
            <Route path="/" element={<Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/>} />
            <Route path="/mails" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <Mails Main_Style={{position:'relative', left:'0px', top: '0px'}} messages={this.state.messages}/></div>} />
            <Route path="/mails/:username" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <MessageList  Main_Style={{position:'relative', left:'0px', top: '0px'}} messages={this.state.messages} self_info={this.state.selfInfo}/></div>} />
            <Route path="/Discover" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <Discover Main_Style={{position:'relative', left:'0px', top: '0px'}} resetInitialJump={this.resetInitialJump}/></div>} />
            <Route path="/My" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <My Main_Style={{position:'relative', left:'0px', top: '0px'}} self_info={this.state.selfInfo} fun_Avatar_Changed={this.fun_Avatar_Changed}/></div>} />
          </Routes>
        </div>
        </Router>
      )
  }
}