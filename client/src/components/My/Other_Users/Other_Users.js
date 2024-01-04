import React, { Component, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate, useLocation, useParams} from 'react-router-dom'
import axios from 'axios'
import './Other_Users.css'

import MyInfoButton from '../Button/My_Info_Button'
import MyList from '../My_List/My_List'
import BackButton from './Button/Back_Button'

const OtherUsers = ({Main_Style, currentUser, selfAvatar, PersonalInfoStyle, Posted_Button_String, Posted_Button_Style, Stored_Button_String, Stored_Button_Style, Transmitted_Button_String, Transmitted_Button_Style, My_List_Style, Back_Button_Style}) => {
    const {username} = useParams()

    const handleMyPageNumber = (username) => {
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
                            fans_num: userInfo.fans_num
                        });
                    }
                })
                .catch(e => {
                    
                    resolve({ attention_num: 0, store_num: 0, transmit_num: 0, fans_num: 0 });
                });
        });
    };
    
    const handleMyPageAvatar = (username) => {
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
                    const url = URL.createObjectURL(blob)
                    resolve(url);
                }
            })
            .catch(e => {
                
                resolve('');
            });
        });
    };
    
    const handleMyPage = async (username) => {
        try {
            const userInfo = await handleMyPageNumber(username)
            const avatarInfo = await handleMyPageAvatar(username)
            setFiltered_self_info({avatar: avatarInfo, username: username, attention_num: userInfo.attention_num, store_num: userInfo.store_num, transmit_num: userInfo.transmit_num, fans_num: userInfo.fans_num})  
            return 
        } catch  {
            console.error('Error:')
            
            return 
        }
    }
    
    useEffect(() => {
        handleMyPage(username)
      }, [])

    useEffect(() => {
        handleMyPage(username)
    }, [username])

    const [activeButton, setActiveButton] = useState(1)
    const [filtered_self_info, setFiltered_self_info] = useState({avatar: './picture/default-avatar.jpg', username: '', attention_num: 0, store_num: 0, transmit_num: 0, fans_num: 0})
    const handleButtonClick = (buttonId) => {
        setActiveButton(buttonId)
    };

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    const active1 = (activeButton === 1)
    const active2 = (activeButton === 2)
    const active3 = (activeButton === 3)

    const navigate = useNavigate()
    const handleBackButtonClick = () => {
        navigate(-1)
    }

    return (
    <div class='zgw_others' style={Main_Style}>
        <div style={PersonalInfoStyle}>
            <BackButton Back_Button_Style = {Back_Button_Style} handleButtonClick={handleBackButtonClick}/>
            <img src={`${filtered_self_info.avatar}`} class="avatarInfo_others" />
            <div class="userInfo_others">
                <p class="usernameStyle_others">{filtered_self_info.username}</p>
                <div style={{display: 'flex', marginLeft: '50px', marginTop: '-40px'}}>
                <Link to={`/My/users/${username}/interested`} style={{textDecoration: 'none'}}>
                  <MyInfoButton My_Info_Button_Text="关注" My_Info_Button_Num={(filtered_self_info.attention_num > 999) ? "999+" : filtered_self_info.attention_num.toString()}/>
                </Link>
                <Link to={`/My/users/${username}/fans`} style={{textDecoration: 'none'}}>
                  <MyInfoButton My_Info_Button_Text="粉丝" My_Info_Button_Num={(filtered_self_info.fans_num > 999) ? "999+" : filtered_self_info.fans_num.toString()}/>
                </Link>
                <MyInfoButton My_Info_Button_Text="转发" My_Info_Button_Num={(filtered_self_info.transmit_num > 999) ? "999+" : filtered_self_info.transmit_num.toString()}/>
                <MyInfoButton My_Info_Button_Text="收藏" My_Info_Button_Num={(filtered_self_info.store_num > 999) ? "999+" : filtered_self_info.store_num.toString()}/>
                </div>
            </div>
        </div>
        <button onClick={() => handleButtonClick(1)} style={Posted_Button_Style} class={`midButtonStyle_others ${activeButton === 1 ? 'active' : ''}`}>{Posted_Button_String}</button>
        <button onClick={() => handleButtonClick(2)} style={Transmitted_Button_Style} class={`midButtonStyle_others ${activeButton === 2 ? 'active' : ''}`}>{Transmitted_Button_String}</button>
        <button onClick={() => handleButtonClick(3)} style={Stored_Button_Style} class={`midButtonStyle_others ${activeButton === 3 ? 'active' : ''}`}>{Stored_Button_String}</button>
        {active1 && <MyList My_List_Style={My_List_Style} currentEnter={username} currentUser={currentUser} mode="发帖" refresh={handleMyPage} avatar={selfAvatar} enter="Others"/>}
        {active2 && <MyList My_List_Style={My_List_Style} currentEnter={username} currentUser={currentUser} mode="转发" refresh={handleMyPage} avatar={selfAvatar} enter="Others"/>}
        {active3 && <MyList My_List_Style={My_List_Style} currentEnter={username} currentUser={currentUser} mode="收藏" refresh={handleMyPage} avatar={selfAvatar} enter="Others"/>}
        <svg height="50%" width="100%">
            <line x1="16%" y1="75.75%" x2="84%" y2="75.75%" style={{ stroke: 'rgb(8, 68, 255)', strokeWidth: 1}} />
        </svg>
    </div>
    );
}

// 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
// 在咱们写代码时最好加上这个，减少合并时出现的问题
OtherUsers.propTypes = {
    MainStyle: PropTypes.object,
    PersonalInfoStyle: PropTypes.object,
    Modify_Username_Button_Style: PropTypes.object,
    Modify_Password_Button_Style: PropTypes.object,
    Back_Button_Style: PropTypes.object,
}

OtherUsers.defaultProps = {
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
    
    Posted_Button_String:'发帖',
    Posted_Button_Style:{
        left: '22.3%',
        top: '33.5%'
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
        top: '39.125%',
        left: '16%',
    },

    Back_Button_Style: {top: '42%', left: '3%'},
}

export default OtherUsers;