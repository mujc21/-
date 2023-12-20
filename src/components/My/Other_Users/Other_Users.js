import React, { Component, useState, useEffect,} from 'react'
import PropTypes from 'prop-types'
import { Link, useParams, useNavigate, useLocation} from 'react-router-dom'

import './Other_Users.css'

import MyInfoButton from '../Button/My_Info_Button'
import MyList from '../My_List/My_List'
import BackButton from './Button/Back_Button'

const OtherUsers = ({Main_Style, self_info, PersonalInfoStyle, Posted_Button_String, Posted_Button_Style, Stored_Button_String, Stored_Button_Style, Transmitted_Button_String, Transmitted_Button_Style, My_List_Style, Back_Button_Style, Last_URL, Set_Last_URL}) => {

    useEffect(() => {
        const sortedItems1 = [...items1].sort((a, b) => a.time - b.time);
        setItems1(sortedItems1);   
        const sortedItems2 = [...items2].sort((a, b) => a.time - b.time);
        setItems2(sortedItems2);   
        const sortedItems3 = [...items3].sort((a, b) => a.time - b.time);
        setItems3(sortedItems3);   
      }, [])

    const [activeButton, setActiveButton] = useState(1)
    const [items1, setItems1] = useState([{ id: 1, avatar: 'Ite1', user: 'Ite1', text: 'Ite1', thumb: 1, img:'Ite1', store: 9, time: 9},
    { id: 2, avatar: 'Ite2', user: 'Ite2', text: '', thumb: 2, img:'Ite1', store: 8, time: 8},
    { id: 3, avatar: 'Ite3', user: 'Ite3', text: 'Ite3', thumb: 3, img:'Ite1', store: 7, time: 7},
    { id: 4, avatar: 'Ite4', user: 'Ite4', text: 'Ite4', thumb: 4, img:'Ite1', store: 6, time: 6},
    { id: 5, avatar: 'Ite5', user: 'Ite5', text: 'Ite5', thumb: 5, img:'Ite1', store: 5, time: 5},
    { id: 6, avatar: 'Ite5', user: 'Ite6', text: 'Ite4', thumb: 6, img:'Ite1', store: 4, time: 4},
    { id: 7, avatar: 'Iteg', user: 'Ite7', text: 'Ite6', thumb: 7, img:'Ite1', store: 3, time: 3},
    { id: 8, avatar: 'Iteg', user: 'Ite8', text: 'Ite6', thumb: 8, img:'Ite1', store: 2, time: 1},
    { id: 9, avatar: 'Iteg', user: 'Ite9', text: 'Ite7', thumb: 9, img:'Ite1', store: 1, time: 2}])

    const [items2, setItems2] = useState([{ id: 1, avatar: 'Ite1', user: 'Ite1', text: 'Ite1', thumb: 1, img:'Ite1', store: 9, time: 9},
    { id: 2, avatar: 'Ite2', user: 'Ite2', text: '', thumb: 2, img:'Ite1', store: 8, time: 8},
    { id: 3, avatar: 'Ite3', user: 'Ite3', text: 'Ite3', thumb: 3, img:'Ite1', store: 7, time: 7},
    { id: 4, avatar: 'Ite4', user: 'Ite4', text: 'Ite4', thumb: 4, img:'Ite1', store: 6, time: 6},
    { id: 5, avatar: 'Ite5', user: 'Ite5', text: 'Ite5', thumb: 5, img:'Ite1', store: 5, time: 5},
    { id: 6, avatar: 'Ite5', user: 'Ite6', text: 'Ite4', thumb: 6, img:'Ite1', store: 4, time: 4},
    { id: 7, avatar: 'Iteg', user: 'Ite7', text: 'Ite6', thumb: 7, img:'Ite1', store: 3, time: 3},
    { id: 8, avatar: 'Iteg', user: 'Ite8', text: 'Ite6', thumb: 8, img:'Ite1', store: 2, time: 2},
    { id: 9, avatar: 'Iteg', user: 'Ite9', text: 'Ite7', thumb: 9, img:'Ite1', store: 1, time: 1}])

    const [items3, setItems3] = useState([{ id: 1, avatar: 'Ite1', user: 'Ite1', text: 'Ite1', thumb: 1, img:'Ite1', store: 9, time: 9},
    { id: 2, avatar: 'Ite2', user: 'Ite2', text: '', thumb: 2, img:'Ite1', store: 8, time: 8},
    { id: 3, avatar: 'Ite3', user: 'Ite3', text: 'Ite3', thumb: 3, img:'Ite1', store: 7, time: 7},
    { id: 4, avatar: 'Ite4', user: 'Ite4', text: 'Ite4', thumb: 4, img:'Ite1', store: 6, time: 6},
    { id: 5, avatar: 'Ite5', user: 'Ite5', text: 'Ite5', thumb: 5, img:'Ite1', store: 5, time: 5},
    { id: 6, avatar: 'Ite5', user: 'Ite6', text: 'Ite4', thumb: 6, img:'Ite1', store: 4, time: 4},
    { id: 7, avatar: 'Iteg', user: 'Ite7', text: 'Ite6', thumb: 7, img:'Ite1', store: 3, time: 2},
    { id: 8, avatar: 'Iteg', user: 'Ite8', text: 'Ite6', thumb: 8, img:'Ite1', store: 2, time: 3},
    { id: 9, avatar: 'Iteg', user: 'Ite9', text: 'Ite7', thumb: 9, img:'Ite1', store: 1, time: 1}])

    const handleButtonClick = (buttonId) => {
        setActiveButton(buttonId)
    };

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    const {username} = useParams()

    let filtered_self_info = self_info.filter(info => info.username === username)
    filtered_self_info = filtered_self_info[0]
    const attention_num = (filtered_self_info.attention_num > 999) ? "999+" : filtered_self_info.attention_num.toString()
    const store_num = (filtered_self_info.store_num > 999) ? "999+" : filtered_self_info.store_num.toString()
    const transmit_num = (filtered_self_info.transmit_num > 999) ? "999+" : filtered_self_info.transmit_num.toString()
    const avatar_style = {
        backgroundImage: `url(${filtered_self_info.avatar})`,
    }
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
            <div class="avatarInfo_others" style={avatar_style}/>
            <div class="userInfo_others">
                <p class="usernameStyle_others">{filtered_self_info.username}</p>
                <div style={{display: 'flex', marginLeft: '50px', marginTop: '-40px'}}>
                <Link to={`/My/users/${username}/interested`} style={{textDecoration: 'none'}}>
                  <MyInfoButton My_Info_Button_Text="关注" My_Info_Button_Num={attention_num}/>
                </Link>
                <MyInfoButton My_Info_Button_Text="收藏" My_Info_Button_Num={store_num}/>
                <MyInfoButton My_Info_Button_Text="转发" My_Info_Button_Num={transmit_num}/>
                </div>
            </div>
        </div>
        <button onClick={() => handleButtonClick(1)} style={Posted_Button_Style} class={`midButtonStyle_others ${activeButton === 1 ? 'active' : ''}`}>{Posted_Button_String}</button>
        <button onClick={() => handleButtonClick(2)} style={Transmitted_Button_Style} class={`midButtonStyle_others ${activeButton === 2 ? 'active' : ''}`}>{Transmitted_Button_String}</button>
        <button onClick={() => handleButtonClick(3)} style={Stored_Button_Style} class={`midButtonStyle_others ${activeButton === 3 ? 'active' : ''}`}>{Stored_Button_String}</button>
        <svg height="800px" width="1280px">
        <line x1="16%" y1="37.875%" x2="84%" y2="37.875%" style={{ stroke: 'rgb(8, 68, 255)', strokeWidth: 1}} />
        </svg>
        {active1 && <MyList My_List_Style={My_List_Style} Search_String='' Items={items1}/>}
        {active2 && <MyList My_List_Style={My_List_Style} Search_String='' Items={items2}/>}
        {active3 && <MyList My_List_Style={My_List_Style} Search_String='' Items={items3}/>}
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
    self_info: PropTypes.object,
    fun_Avatar_Changed: PropTypes.func,
    Back_Button_Style: PropTypes.object,
    Last_URL: PropTypes.string,
    Set_Last_URL: PropTypes.func
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

    Back_Button_Style: {top: '42%', left: '3%'},

    self_info: null,

    Last_URL: ''
}

export default OtherUsers;