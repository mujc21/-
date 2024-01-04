import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './My.css'

import MyInfoButton from './Button/My_Info_Button'
import ModifyButton from './Button/Modify_Button'
import MyList from './My_List/My_List'
import NewAvatar from './New_Avatar/New_Avatar'
import NewUsername from './New_Username/New_Username'
import NewPassword from './New_Password/New_Password'

// const { ipcRenderer } = window.require('electron')

export default class My extends Component {

    handleMyPageNumber = (username) => {
        const our_url = "http://43.138.68.84:8082/api/mypagenumber/" + username;
    
        return new Promise((resolve, reject) => {
            axios.get(our_url)
                .then(res => {
                    if (res.data === "数据库查询失败") {
                        
                        resolve({ attention_num: 0, store_num: 0, transmit_num: 0, fans_num: 0 });
                    } else if (res.data === "该用户不存在") {
                        
                        resolve({ attention_num: 0, store_num: 0, transmit_num: 0, fans_num: 0 });
                    } else {
                        const userInfo = res.data;
                        resolve({
                            attention_num: userInfo.attention_num,
                            store_num: userInfo.store_num,
                            transmit_num: userInfo.transmit_num,
                            fans_num: userInfo.fans_num,
                        });
                    }
                })
                .catch(e => {
                    
                    resolve({ attention_num: 0, store_num: 0, transmit_num: 0, fans_num: 0, });
                });
        });
    };


    handleMyPageAvatar = (username) => {
        const our_url = "http://43.138.68.84:8082/api/mypageavatar/" + username;
    
        return new Promise((resolve, reject) => {
            axios.get(our_url, {
                responseType: 'arraybuffer'
            })
            .then(res => {
                if (res.data === "数据库查询失败") {
                    
                    resolve('');
                } else if (res.data === "该用户不存在") {
                    
                    resolve('');
                } else {
                    const blob = new Blob([res.data], { type: 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);
                    // ipcRenderer.send('start-download', url)
                    resolve(url);
                }
            })
            .catch(e => {
                
                resolve('');
            });
        });
    };
    
    fun_Set_Self_Info = (avatar, username, attention_num, store_num, transmit_num, fans_num) => {
        this.setState(prevState => ({
          selfInfo:{
            avatar: avatar,
            username: username,
            attention_num: attention_num,
            store_num: store_num,
            transmit_num: transmit_num,
            fans_num: fans_num,
          }
        }));
    }

    fun_Avatar_Changed = (new_avatar_url) =>{
        this.setState(prevState => ({
          selfInfo:{
            ...prevState.selfInfo,
            avatar: new_avatar_url,
          }
        }));
    }

    handleMyPage = async (username) => {
        try {
            const userInfo = await this.handleMyPageNumber(username)
            const avatarInfo = await this.handleMyPageAvatar(username)
            this.fun_Set_Self_Info(avatarInfo, username, userInfo.attention_num, userInfo.store_num, userInfo.transmit_num, userInfo.fans_num)  
            return 
        } catch  {
            console.error('Error:')
            
            return 
        }
    }

    componentDidMount(){  
        const username = this.props.currentUser        
        this.handleMyPage(username)
    }
  
    openModal = () => {
        this.setState({ isModalOpen: true });
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    };
  
    closeModal = () => {
        this.setState({ isModalOpen: false });
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    };

    handleAvatarForServer = async (selectedFile) => {
        const username = this.props.currentUser
        const formData = new FormData()
        formData.append('username', username);
        formData.append('avatar', selectedFile); 
        const our_url = "http://43.138.68.84:8082/api/change-avatar/" + username;
        try{
            await axios.post(our_url,formData)
            .then(res=>{
                if(res.data === "数据库头像路径更新失败"){
                    
                    return 
                }
                else if(res.data === "修改头像成功"){
                    return
                }
            })
            .catch(e=>{
                
                return 
            })
        }
        catch{
            
            return 
        }
    };

    openRenameModal = (Reminder) => {
        this.setState({ isRenameReminderOpen: true });
        this.setState({ RenameReminderString: Reminder})
    }

    closeRenameModal = () => {
        this.setState({ isRenameReminderOpen: false });
      }

    fun_Set_Self_Username = (username) => {
        this.setState(prevState => ({
          selfInfo:{
            ...prevState.selfInfo,
            username: username,
          }
        }));
    }

    handleUsernameForServer = async ( username, NewUsername ) => {
        const our_url = "http://43.138.68.84:8082/api/change-username/" + username + "/" + NewUsername;
        try{
            await axios.get(our_url)
            .then(res=>{
                if(res.data === "username length wrong"){
                    this.openRenameModal("用户名长度应为2-10位，请重新输入")
                    return
                }
                else if(res.data === "用户被占用"){
                    this.openRenameModal("用户被占用")
                    return
                }
                else if(res.data === "数据库更新失败"){
                    this.openRenameModal("响应失败，请重试")
                    return
                }
                else if(res.data === "数据库查询失败"){
                    this.openRenameModal("响应失败，请重试")
                    return
                }
                else if(res.data === "成功修改用户名"){
                    this.setState({ isNewUsernameOpen: false });
                    document.body.style.overflow = 'auto'; // 恢复背景滚动
                    this.fun_Set_Self_Username(NewUsername) 
                    this.props.fun_Set_Current_User(NewUsername)
                    return
                }
            })
            .catch(e=>{
                this.openRenameModal("响应失败，请重试")
                
            })
        }
        catch{
            this.openRenameModal("响应失败，请重试")
            
        }
    }

    handlePasswordForServer = async ( username, password, newPassword ) => {
        try{
            await axios.post("http://43.138.68.84:8082/api/change-password",{
                username, password, newPassword
            })
            .then(res=>{
                if(res.data === "password length wrong"){
                    this.openRenameModal("密码长度应为8-15位，请重新输入")
                    return
                }
                else if(res.data === "密码错误！"){
                    this.openRenameModal("原始密码错误")
                    return
                }
                else if(res.data === "数据库更新失败"){
                    this.openRenameModal("响应失败，请重试")
                    return
                }
                else if(res.data === "数据库查询失败"){
                    this.openRenameModal("响应失败，请重试")
                    return
                }
                else if(res.data === "成功修改密码"){
                    this.setState({ isNewPasswordOpen: false });
                    document.body.style.overflow = 'auto'; // 恢复背景滚动
                    return
                }
            })
            .catch(e=>{
                this.openRenameModal("响应失败，请重试")
                
            })
        }
        catch{
            this.openRenameModal("响应失败，请重试")
            
        }
    }

    openNewPassword = () => {
        this.setState({ isNewPasswordOpen: true });
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    };
    
    closeNewPasswordConfirm = ( password, newPassword ) => {
        this.handlePasswordForServer(this.props.currentUser, password, newPassword);
    };

    closeNewPasswordCancel = () => {
        this.setState({ isNewPasswordOpen: false });
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    };

    openNewUsername = () => {
        this.setState({ isNewUsernameOpen: true });
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    };
    
    closeNewUsernameConfirm = ( NewUsername ) => {
        const regex = /[^a-zA-Z0-9]/
        if(regex.test(NewUsername)){
            this.openRenameModal("含有除数字、字母外的其他字符,请重新输入")
            return
        }
        this.handleUsernameForServer(this.props.currentUser, NewUsername);
    };

    closeNewUsernameCancel = () => {
        this.setState({ isNewUsernameOpen: false });
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    };


    state = {
        isModalOpen: false,
        isNewUsernameOpen: false,
        isNewPasswordOpen: false,
        activeButton: 1,
        selfInfo:{
            avatar: './picture/default-avatar.jpg',
            username: this.props.currentUser,
            attention_num: 0,
            store_num: 0,
            transmit_num: 0,
            fans_num: 0
        },
        isRenameReminderOpen: false, 
        RenameReminderString: '',
    };
    
    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        MainStyle: PropTypes.object,
        PersonalInfoStyle: PropTypes.object,
        Modify_Username_Button_Style: PropTypes.object,
        Modify_Password_Button_Style: PropTypes.object,
        Set_Last_URL: PropTypes.func,
        currentUser: PropTypes.string,
        fun_Set_Current_User: PropTypes.func
    }

    static defaultProps = {
        PersonalInfoStyle:{
            position: 'absolute',
            width: '92.6%',
            height: '25%',
            display: 'flex',
            left: '3.72%',
            top: '2.25%',
            border: '1px solid rgba(0, 42, 241, 0.1)',
            boxShadow: '2px 2px 8px 0px rgba(54, 73, 237, 0.25)',
            background: 'rgba(255, 255, 255, 0.9)',
        },

        Modify_Username_Button_Style:{
            position: 'absolute',
            left: '73.6%',
            top: '30%'
        },

        Modify_Password_Button_Style:{
            position: 'absolute',
            left: '73.6%',
            top: '55%'
        },
        
        Posted_Button_String:'发帖',
        Posted_Button_Style:{
            left: '22.3%',
            top: '33.5%',
        },

        Transmitted_Button_String:'转发',
        Transmitted_Button_Style:{
            left: '47.8%',
            top: '33.5%'
        },

        Stored_Button_String:'收藏',
        Stored_Button_Style:{
            left: '71.8%',
            top: '33.5%'
        },

        My_List_Style:{
            position: 'absolute',
            top: '39.125%',
            left: '16%',
        },
    }
    handleButtonClick = (buttonId) => {
        this.setState({activeButton: buttonId});
    };

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        const attention_num = (this.state.selfInfo.attention_num > 999) ? "999+" : this.state.selfInfo.attention_num.toString()
        const store_num = (this.state.selfInfo.store_num > 999) ? "999+" : this.state.selfInfo.store_num.toString()
        const transmit_num = (this.state.selfInfo.transmit_num > 999) ? "999+" : this.state.selfInfo.transmit_num.toString()
        const fans_num = (this.state.selfInfo.fans_num > 999) ? "999+" : this.state.selfInfo.fans_num.toString()
        const active1 = (this.state.activeButton === 1)
        const active2 = (this.state.activeButton === 2)
        const active3 = (this.state.activeButton === 3)
        const prevURL = window.location.pathname

        return <div class='zgw_my' style={this.props.Main_Style}>
            <div style={this.props.PersonalInfoStyle}>
            <img src={`${this.state.selfInfo.avatar}`} onClick={this.openModal} class="avatarInfo"/>
                <div class="userInfo">
                  <p class="usernameStyle">{this.state.selfInfo.username}</p>
                  <div style={{display: 'flex', marginLeft: '50px', marginTop: '-40px'}}>
                    <Link to='/My/interestedUsers' state= {{prevURL: prevURL}} style={{textDecoration: 'none'}}>
                      <MyInfoButton My_Info_Button_Text="关注" My_Info_Button_Num={attention_num}/>
                    </Link>
                    <Link to='/My/fans' state= {{prevURL: prevURL}} style={{textDecoration: 'none'}}>
                      <MyInfoButton My_Info_Button_Text="粉丝" My_Info_Button_Num={fans_num}/>
                    </Link>
                    <MyInfoButton My_Info_Button_Text="转发" My_Info_Button_Num={transmit_num}/>
                    <MyInfoButton My_Info_Button_Text="收藏" My_Info_Button_Num={store_num}/>
                  </div>
                </div>
                <ModifyButton onButtonClick={this.openNewUsername} Modify_Button_Text="修改用户名" Modify_Button_Pic="./picture/modify_username.png" Modify_Button_Style={this.props.Modify_Username_Button_Style}/>
                <ModifyButton onButtonClick={this.openNewPassword} Modify_Button_Text="修改密码" Modify_Button_Pic="./picture/modify_password.png" Modify_Button_Style={this.props.Modify_Password_Button_Style}/>
            </div>
            <button onClick={() => this.handleButtonClick(1)} style={this.props.Posted_Button_Style} class={`midButtonStyle ${this.state.activeButton === 1 ? 'active' : ''}`}>{this.props.Posted_Button_String}</button>
            <button onClick={() => this.handleButtonClick(2)} style={this.props.Transmitted_Button_Style} class={`midButtonStyle ${this.state.activeButton === 2 ? 'active' : ''}`}>{this.props.Transmitted_Button_String}</button>
            <button onClick={() => this.handleButtonClick(3)} style={this.props.Stored_Button_Style} class={`midButtonStyle ${this.state.activeButton === 3 ? 'active' : ''}`}>{this.props.Stored_Button_String}</button>
            {active1 && <MyList My_List_Style={this.props.My_List_Style} currentUser={this.state.selfInfo.username} currentEnter={this.state.selfInfo.username} avatar={this.state.selfInfo.avatar} mode="发帖" refresh={this.handleMyPage} enter="My"/>}
            {active2 && <MyList My_List_Style={this.props.My_List_Style} currentUser={this.state.selfInfo.username} currentEnter={this.state.selfInfo.username} avatar={this.state.selfInfo.avatar} mode="转发" refresh={this.handleMyPage} enter="My"/>}
            {active3 && <MyList My_List_Style={this.props.My_List_Style} currentUser={this.state.selfInfo.username} currentEnter={this.state.selfInfo.username} avatar={this.state.selfInfo.avatar} mode="收藏" refresh={this.handleMyPage} enter="My"/>}
            <NewAvatar isOpen={this.state.isModalOpen} onClose={this.closeModal} self_info={this.state.selfInfo} fun_Avatar_Changed={this.fun_Avatar_Changed} currentUser={this.props.currentUser} fun_Set_Current_Avatar={this.props.fun_Set_Current_Avatar}/>
            <NewUsername isOpen={this.state.isNewUsernameOpen} onCloseConfirm={this.closeNewUsernameConfirm} onCloseCancel={this.closeNewUsernameCancel} isRenameReminderOpen={this.state.isRenameReminderOpen} RenameReminderString={this.state.RenameReminderString} closeRenameModal={this.closeRenameModal}/>
            <NewPassword isOpen={this.state.isNewPasswordOpen} onCloseConfirm={this.closeNewPasswordConfirm} onCloseCancel={this.closeNewPasswordCancel} isRenameReminderOpen={this.state.isRenameReminderOpen} RenameReminderString={this.state.RenameReminderString} closeRenameModal={this.closeRenameModal}/>
            <svg height="50%" width="100%">
            <line x1="16%" y1="75.75%" x2="84%" y2="75.75%" style={{ stroke: 'rgb(8, 68, 255)', strokeWidth: 1}} />
            </svg>
            </div>
    }
}
