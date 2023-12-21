import React, { Component } from 'react'
import './App.css';
import axios from 'axios'

import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import MessageList from './components/Mails/Message_List/Message_List';
import Mails from './components/Mails/Mails'
import Menu from './components/Menu/Menu'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Discover from './components/Discover/Discover'
import Users from './components/My/Interested_Users/Users'
import My from './components/My/My'
import OtherUsers from './components/My/Other_Users/Other_Users'
import Materials from './components/Materials/Materials'
import OperationInstructions from './components/Operation_Instructions/Operation_Instructions'
import Modal from './components/Modal/Modal'
import PostToRelease from './components/post/Post_To_Release';

export default class App extends Component {
    // 在运行过程中会因事件发生改变的数据要放到state里
    state = {
      Login_Email_String:'',
      Login_Password_String:'',
      Register_Email_String:'',
      Register_Password_String:'',
      Confirm_Password_String:'',
      isLoginReminderOpen: false,
      LoginReminderString: '',
      Loading: false,
      isRegisterReminderOpen: false,
      currentUser: '',
      RegisterReminderString: '',
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
                    { id: 3, sender: '', chat: 'How are you?' },
                    { id: 4, sender: '', chat: 'How are you?' },
                    { id: 5, sender: '', chat: 'How are you?' },
                    { id: 6, sender: '', chat: 'How are you?' }],
        avatar: '/picture/head_structure.jpeg'},
      ],
      selfInfo:{
        avatar: '/picture/default-avatar.jpg',
        username: '',
        attention_num: 0,
        store_num: 0,
        transmit_num: 0
      },
      User_List:[
        {id: 1,
          username: 'User1',
          avatar: '/picture/zepp.jpg',
          attention_num: 12,
          store_num: 14,
          transmit_num: 1230},
        {id: 2,
          username: 'User2',
          avatar: '/picture/head_structure.jpeg',
          attention_num: 12,
          store_num: 15,
          transmit_num: 123}
      ],
      Other_User_List:[
        {id: 1,
          username: 'User1',
          avatar: '/picture/zepp.jpg',
          attention_num: 12,
          store_num: 14,
          transmit_num: 1230},
        {id: 2,
          username: 'User2',
          avatar: '/picture/head_structure.jpeg',
          attention_num: 12,
          store_num: 15,
          transmit_num: 123}
      ]
    }
  
    fun_Login_Change_Email = (new_Email_String) =>{
      this.setState({Login_Email_String: new_Email_String})
    }
  
    fun_Login_Change_Key = (new_Key_String) =>{
      this.setState({Login_Password_String: new_Key_String})
    }

    openLoginModal = (Reminder) => {
      this.setState({ isLoginReminderOpen: true });
      this.setState({ LoginReminderString: Reminder})
    }

    closeLoginModal = () => {
      this.setState({ isLoginReminderOpen: false });
    }

    openRegisterModal = (Reminder) => {
      this.setState({ isRegisterReminderOpen: true });
      this.setState({ RegisterReminderString: Reminder})
    }

    closeRegisterModal = () => {
      this.setState({ isRegisterReminderOpen: false });
    }
  
    handleLogin = async (username, password) => {
      try{
        this.setState({Loading: true})
        await axios.post("/api/login",{
          username,password
        })
        .then(res=>{
          if(res.data === "数据库查询失败"){
            this.openLoginModal(res.data)
            this.setState({isLogin: false})
            return
          }
          else if(res.data === "该用户未注册"){
            this.openLoginModal(res.data)
            this.setState({isLogin: false})
            return
          }
          else if(res.data === "密码错误！"){
            this.openLoginModal(res.data)
            this.setState({isLogin: false})
            return
          }
          else if(res.data === "登录成功！"){
            this.setState({isLogin: true})
            this.setState({currentUser: username})
            this.setState({initialJump: 1})
            return
          }
        })
        .catch(e=>{
          this.openLoginModal("响应失败，请重试")
          this.setState({isLogin: false})
        })
      }
      catch{
        this.openLoginModal("响应失败，请重试")
        this.setState({isLogin: false})
      }
      finally{
        this.setState({Loading: false})
      }

    };

    fun_Login_OK_Clicked = () =>{
      const temp_email = this.state.Login_Email_String
      const temp_key= this.state.Login_Password_String
      this.setState({Login_Email_String:'', Login_Password_String:''})
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

    fun_Set_Self_Info = (avatar,username, attention_num, store_num, transmit_num) => {
      this.setState(prevState => ({
        selfInfo:{
          avatar: avatar,
          username: username,
          attention_num: attention_num,
          store_num: store_num,
          transmit_num: transmit_num,
        }
      }));
    }

    resetInitialJump = () => {
      this.setState({initialJump: 0})
    }

    handleRegister = async (username, password, confirmPassword) => {
      try{
        this.setState({Loading: true})
        await axios.post("/api/register",{
          username,password,confirmPassword
        })
        .then(res=>{
          if(res.data === "username length wrong"){
            this.openRegisterModal("用户名长度应为2-15位，请重新输入")
            this.setState({enterRegister:true})
            this.setState({reloadRegister: true})
            return
          }
          else if(res.data === "password length wrong"){
            this.openRegisterModal("密码长度应为8-15位，请重新输入")
            this.setState({enterRegister: true})
            return
          }
          else if(res.data === "different password"){
            this.openRegisterModal("两次密码输入不一致，请重新输入")
            console.log("different password")
            this.setState({enterRegister: true})
            return
          }
          else if(res.data === "数据库查询失败"){
            this.openRegisterModal("响应失败，请重试")
            this.setState({enterRegister: true})
            return
          }
          else if(res.data === "用户被占用"){
            this.openRegisterModal("用户被占用，请重新输入")
            this.setState({enterRegister: true})
            return
          }
          else if(res.data === "数据库插入失败"){
            this.openRegisterModal("响应失败，请重试")
            this.setState({enterRegister: true})
            return
          }
          else if(res.data === "成功创建用户"){
            this.setState({enterRegister: false})
            return
          }
        })
        .catch(e=>{
          this.openRegisterModal("响应失败，请重试")
          alert("响应失败，请重试")
        })
      }
      catch{
        this.openRegisterModal("响应失败，请重试")
        alert("响应失败，请重试")
      }
      finally{
        this.setState({Loading: false})
      }
    };

    fun_Register_OK_Clicked = () =>{
      // this.setState({enterRegister: false})
      const temp_email = this.state.Register_Email_String
      const temp_key= this.state.Register_Password_String
      const temp_confirm_key= this.state.Confirm_Password_String
      
      this.setState({Register_Email_String:'', Register_Password_String:'', Confirm_Password_String:''})
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
      const dynamicWidth = `${50}vw - ${150}px`
      
      return (
        <Router>
        <div style={divStyle}>
        {res}
          <Routes>
          <Route path="/Login" element={<Login Main_Style={{position:'absolute', left: `calc(${dynamicWidth})`, top: '30%'}} Email_Input_Changed={this.fun_Login_Change_Email} Key_Input_Changed={this.fun_Login_Change_Key} OK_Clicked={this.fun_Login_OK_Clicked} enter_Register={this.fun_Register_Link_Clicked} isOpen={this.state.isLoginReminderOpen} onClose={this.closeLoginModal} LoginReminderString={this.state.LoginReminderString} isLoading={this.state.Loading}/>}/>
            <Route path="/Register" element={<Register Main_Style={{position:'absolute', left:`calc(${dynamicWidth})`, top: '30%'}} Email_Input_Changed={this.fun_Register_Change_Email} Key_Input_Changed={this.fun_Register_Change_Key} Confirm_Key_Input_Changed={this.fun_Register_Change_Confirm_Key} OK_Clicked={this.fun_Register_OK_Clicked} enter_Login={this.fun_Login_Link_Clicked} isOpen={this.state.isRegisterReminderOpen} onClose={this.closeRegisterModal} RegisterReminderString={this.state.RegisterReminderString} isLoading={this.state.Loading}/>}/>  
            <Route path="/" element={<Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/>} />
            <Route path="/post" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <PostToRelease Main_Style={{position:'relative', left:'20%', top: '20%'}} /></div>} />
            <Route path="/mails" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <Mails Main_Style={{position:'relative', left:'0px', top: '0px'}} messages={this.state.messages}/></div>} />
            <Route path="/mails/:username" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <MessageList  Main_Style={{position:'relative', left:'0px', top: '0px'}} messages={this.state.messages} self_info={this.state.selfInfo}/></div>} />
            <Route path="/Discover" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <Discover Main_Style={{position:'relative', left:'0px', top: '0px'}} resetInitialJump={this.resetInitialJump}/></div>} />
            <Route path="/Materials" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <Materials Main_Style={{position:'relative', left:'0px', top: '0px'}} currentUser={this.state.currentUser}/></div>}/>
            <Route path="/My" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <My Main_Style={{position:'relative', left:'0px', top: '0px'}} self_info={this.state.selfInfo} fun_Avatar_Changed={this.fun_Avatar_Changed} fun_Set_Self_Info={this.fun_Set_Self_Info} currentUser={this.state.currentUser}/></div>}/>
            <Route path="/My/interestedUsers" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <Users Main_Style={{position:'relative', left:'0px', top: '0px'}} User_List={this.state.User_List}/></div>} />
            <Route path="/My/users/:username" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <OtherUsers Main_Style={{position:'relative', left:'0px', top: '0px'}} self_info={this.state.User_List}/></div>} />
            <Route path="/My/users/:username/interested" element={<div style={divStyle}><Menu Main_Style={{position:'relative', left:'0px', top: '0px'}}/> <Users Main_Style={{position:'relative', left:'0px', top: '0px'}} User_List={this.state.Other_User_List}/></div>} />
          </Routes>
        {/* <LoginReminder isOpen={this.state.isLoginReminderOpen} onClose={this.closeModal} LoginReminderString={this.state.LoginReminderString}></LoginReminder> */}
        </div>
        </Router>
      )
  }
}