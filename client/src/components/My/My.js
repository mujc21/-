import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './My.css'

import MyInfoButton from './Button/My_Info_Button'
import ModifyButton from './Button/Modify_Button'
import MyList from './My_List/My_List'
import NewAvatar from './New_Avatar/New_Avatar'

export default class My extends Component {

    handleMyPageNumber = (username) => {
        const our_url = "/api/mypagenumber/" + username;
    
        return new Promise((resolve, reject) => {
            axios.get(our_url)
                .then(res => {
                    if (res.data === "数据库查询失败") {
                        alert("数据库查询失败");
                        resolve({ attention_num: 0, store_num: 0, transmit_num: 0 });
                    } else if (res.data === "该用户不存在") {
                        alert("该用户不存在");
                        resolve({ attention_num: 0, store_num: 0, transmit_num: 0 });
                    } else {
                        const userInfo = res.data;
                        resolve({
                            attention_num: userInfo.attention_num,
                            store_num: userInfo.store_num,
                            transmit_num: userInfo.transmit_num,
                        });
                    }
                })
                .catch(e => {
                    alert("404 handleMyPageNumber响应失败: " + e.message);
                    resolve({ attention_num: 0, store_num: 0, transmit_num: 0 });
                });
        });
    };
    
    


    handleMyPageAvatar = (username) => {
        const our_url = "/api/mypageavatar/" + username;
    
        return new Promise((resolve, reject) => {
            axios.get(our_url, {
                responseType: 'arraybuffer'
            })
            .then(res => {
                if (res.data === "数据库查询失败") {
                    alert("数据库查询失败");
                    resolve('');
                } else if (res.data === "该用户不存在") {
                    alert("该用户不存在");
                    resolve('');
                } else {
                    const blob = new Blob([res.data], { type: 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                }
            })
            .catch(e => {
                alert("404 handleMyPageAvatar响应失败: " + e.message);
                resolve('');
            });
        });
    };
    
    

    handleMyPage = async (username) => {
        try {
            const userInfo = await this.handleMyPageNumber(username)
            const avatarInfo = await this.handleMyPageAvatar(username)

            this.props.fun_Set_Self_Info(avatarInfo, username, userInfo.attention_num, userInfo.store_num, userInfo.transmit_num)  
            return 
        } catch (error) {
            console.error('Error:', error)
            alert('404 handleMyPage响应失败')
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

    state = {
        isModalOpen: false,
        activeButton: 1,
    };
    
    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        MainStyle: PropTypes.object,
        PersonalInfoStyle: PropTypes.object,
        Modify_Username_Button_Style: PropTypes.object,
        Modify_Password_Button_Style: PropTypes.object,
        self_info: PropTypes.object,
        fun_Avatar_Changed: PropTypes.func,
        Set_Last_URL: PropTypes.func,
        fun_Set_Self_Info: PropTypes.func,
        currentUser: PropTypes.string
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
        },

        Transmitted_Button_String:'转发',
        Transmitted_Button_Style:{
            left: '47.8%',
        },

        Stored_Button_String:'收藏',
        Stored_Button_Style:{
            left: '71.8%',
        },

        My_List_Style:{
            top: '39.125%',
            left: '16%',
        },

        self_info: null,
    }
    handleButtonClick = (buttonId) => {
        this.setState({activeButton: buttonId});
    };

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        const attention_num = (this.props.self_info.attention_num > 999) ? "999+" : this.props.self_info.attention_num.toString()
        const store_num = (this.props.self_info.store_num > 999) ? "999+" : this.props.self_info.store_num.toString()
        const transmit_num = (this.props.self_info.transmit_num > 999) ? "999+" : this.props.self_info.transmit_num.toString()
        const active1 = (this.state.activeButton === 1)
        const active2 = (this.state.activeButton === 2)
        const active3 = (this.state.activeButton === 3)
        const prevURL = window.location.pathname

        return <div class='zgw_my' style={this.props.Main_Style}>
            <div style={this.props.PersonalInfoStyle}>
            <img src={`${this.props.self_info.avatar}`} onClick={this.openModal} class="avatarInfo"/>
                <div class="userInfo">
                  <p class="usernameStyle">{this.props.self_info.username}</p>
                  <div style={{display: 'flex', marginLeft: '50px', marginTop: '-40px'}}>
                    <Link to='/My/interestedUsers' state= {{prevURL: prevURL}} style={{textDecoration: 'none'}}>
                      <MyInfoButton My_Info_Button_Text="关注" My_Info_Button_Num={attention_num}/>
                    </Link>
                    <MyInfoButton My_Info_Button_Text="转发" My_Info_Button_Num={transmit_num}/>
                    <MyInfoButton My_Info_Button_Text="收藏" My_Info_Button_Num={store_num}/>
                  </div>
                </div>
                <ModifyButton Modify_Button_Text="修改用户名" Modify_Button_Pic="/picture/modify_username.png" Modify_Button_Style={this.props.Modify_Username_Button_Style}/>
                <ModifyButton Modify_Button_Text="修改密码" Modify_Button_Pic="/picture/modify_password.png" Modify_Button_Style={this.props.Modify_Password_Button_Style}/>
            </div>
            <button onClick={() => this.handleButtonClick(1)} style={this.props.Posted_Button_Style} class={`midButtonStyle ${this.state.activeButton === 1 ? 'active' : ''}`}>{this.props.Posted_Button_String}</button>
            <button onClick={() => this.handleButtonClick(2)} style={this.props.Transmitted_Button_Style} class={`midButtonStyle ${this.state.activeButton === 2 ? 'active' : ''}`}>{this.props.Transmitted_Button_String}</button>
            <button onClick={() => this.handleButtonClick(3)} style={this.props.Stored_Button_Style} class={`midButtonStyle ${this.state.activeButton === 3 ? 'active' : ''}`}>{this.props.Stored_Button_String}</button>
            <svg height="400px" width="1280px">
            <line x1="16%" y1="75.75%" x2="84%" y2="75.75%" style={{ stroke: 'rgb(8, 68, 255)', strokeWidth: 1}} />
            </svg>
            {active1 && <MyList My_List_Style={this.props.My_List_Style} currentUser={this.props.currentUser} mode="发帖"/>}
            {active2 && <MyList My_List_Style={this.props.My_List_Style} currentUser={this.props.currentUser} mode="收藏"/>}
            {active3 && <MyList My_List_Style={this.props.My_List_Style} currentUser={this.props.currentUser} mode="转发"/>}
            <NewAvatar isOpen={this.state.isModalOpen} onClose={this.closeModal} self_info={this.props.self_info} fun_Avatar_Changed={this.props.fun_Avatar_Changed} currentUser={this.props.currentUser}/>
            </div>
    }
}
