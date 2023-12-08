import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './My.css'

import MyInfoButton from './Button/My_Info_Button'
import ModifyButton from './Button/Modify_Button'
import MyList from './My_List/My_List'
import NewAvatar from './New_Avatar/New_Avatar'

export default class My extends Component {

    componentDidMount(){
        const sortedItems1 = [...this.state.items1].sort((a, b) => a.time - b.time);
        this.setState({ items1: sortedItems1 });   
        const sortedItems2 = [...this.state.items2].sort((a, b) => a.time - b.time);
        this.setState({ items2: sortedItems2 }); 
        const sortedItems3 = [...this.state.items3].sort((a, b) => a.time - b.time);
        this.setState({ items3: sortedItems3 });     
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
        items1: [
            { id: 1, avatar: 'Ite1', user: 'Ite1', text: 'Ite1', thumb: 1, img:'Ite1', store: 9, time: 9},
            { id: 2, avatar: 'Ite2', user: 'Ite2', text: '', thumb: 2, img:'Ite1', store: 8, time: 8},
            { id: 3, avatar: 'Ite3', user: 'Ite3', text: 'Ite3', thumb: 3, img:'Ite1', store: 7, time: 7},
            { id: 4, avatar: 'Ite4', user: 'Ite4', text: 'Ite4', thumb: 4, img:'Ite1', store: 6, time: 6},
            { id: 5, avatar: 'Ite5', user: 'Ite5', text: 'Ite5', thumb: 5, img:'Ite1', store: 5, time: 5},
            { id: 6, avatar: 'Ite5', user: 'Ite6', text: 'Ite4', thumb: 6, img:'Ite1', store: 4, time: 4},
            { id: 7, avatar: 'Iteg', user: 'Ite7', text: 'Ite6', thumb: 7, img:'Ite1', store: 3, time: 3},
            { id: 8, avatar: 'Iteg', user: 'Ite8', text: 'Ite6', thumb: 8, img:'Ite1', store: 2, time: 1},
            { id: 9, avatar: 'Iteg', user: 'Ite9', text: 'Ite7', thumb: 9, img:'Ite1', store: 1, time: 2},
            // 添加更多项
            ],
        items2: [
            { id: 1, avatar: 'Ite1', user: 'Ite1', text: 'Ite1', thumb: 1, img:'Ite1', store: 9, time: 9},
            { id: 2, avatar: 'Ite2', user: 'Ite2', text: '', thumb: 2, img:'Ite1', store: 8, time: 8},
            { id: 3, avatar: 'Ite3', user: 'Ite3', text: 'Ite3', thumb: 3, img:'Ite1', store: 7, time: 7},
            { id: 4, avatar: 'Ite4', user: 'Ite4', text: 'Ite4', thumb: 4, img:'Ite1', store: 6, time: 6},
            { id: 5, avatar: 'Ite5', user: 'Ite5', text: 'Ite5', thumb: 5, img:'Ite1', store: 5, time: 5},
            { id: 6, avatar: 'Ite5', user: 'Ite6', text: 'Ite4', thumb: 6, img:'Ite1', store: 4, time: 4},
            { id: 7, avatar: 'Iteg', user: 'Ite7', text: 'Ite6', thumb: 7, img:'Ite1', store: 3, time: 3},
            { id: 8, avatar: 'Iteg', user: 'Ite8', text: 'Ite6', thumb: 8, img:'Ite1', store: 2, time: 2},
            { id: 9, avatar: 'Iteg', user: 'Ite9', text: 'Ite7', thumb: 9, img:'Ite1', store: 1, time: 1},
            // 添加更多项
            ],
        items3: [
            { id: 1, avatar: 'Ite1', user: 'Ite1', text: 'Ite1', thumb: 1, img:'Ite1', store: 9, time: 9},
            { id: 2, avatar: 'Ite2', user: 'Ite2', text: '', thumb: 2, img:'Ite1', store: 8, time: 8},
            { id: 3, avatar: 'Ite3', user: 'Ite3', text: 'Ite3', thumb: 3, img:'Ite1', store: 7, time: 7},
            { id: 4, avatar: 'Ite4', user: 'Ite4', text: 'Ite4', thumb: 4, img:'Ite1', store: 6, time: 6},
            { id: 5, avatar: 'Ite5', user: 'Ite5', text: 'Ite5', thumb: 5, img:'Ite1', store: 5, time: 5},
            { id: 6, avatar: 'Ite5', user: 'Ite6', text: 'Ite4', thumb: 6, img:'Ite1', store: 4, time: 4},
            { id: 7, avatar: 'Iteg', user: 'Ite7', text: 'Ite6', thumb: 7, img:'Ite1', store: 3, time: 2},
            { id: 8, avatar: 'Iteg', user: 'Ite8', text: 'Ite6', thumb: 8, img:'Ite1', store: 2, time: 3},
            { id: 9, avatar: 'Iteg', user: 'Ite9', text: 'Ite7', thumb: 9, img:'Ite1', store: 1, time: 1},
            // 添加更多项
            ],
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
    }

    static defaultProps = {
        PersonalInfoStyle:{
            position: 'absolute',
            width: '1045px',
            height: '200px',
            display: 'flex',
            left: '42px',
            top: '18px',
            border: '1px solid rgba(0, 42, 241, 0.1)',
            boxShadow: '2px 2px 8px 0px rgba(54, 73, 237, 0.25)',
            background: 'rgba(255, 255, 255, 0.9)',
        },

        Modify_Username_Button_Style:{
            position: 'absolute',
            left: '769px',
            top: '60px'
        },

        Modify_Password_Button_Style:{
            position: 'absolute',
            left: '769px',
            top: '110px'
        },
        
        Posted_Button_String:'发帖',
        Posted_Button_Style:{
            left: '230px',
        },

        Transmitted_Button_String:'转发',
        Transmitted_Button_Style:{
            left: '517px',
        },

        Stored_Button_String:'收藏',
        Stored_Button_Style:{
            left: '804px',
        },

        My_List_Style:{
            top: '313px',
            left: '181px',
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
        const avatar_style = {
            backgroundImage: `url(${this.props.self_info.avatar})`,
        }
        const active1 = (this.state.activeButton === 1)
        const active2 = (this.state.activeButton === 2)
        const active3 = (this.state.activeButton === 3)

        return <div class='zgw_my' style={this.props.Main_Style}>
            <div style={this.props.PersonalInfoStyle}>
                <div onClick={this.openModal} class="avatarInfo" style={avatar_style}/>
                <div class="userInfo">
                  <p class="usernameStyle">{this.props.self_info.username}</p>
                  <div style={{display: 'flex', marginLeft: '50px', marginTop: '-40px'}}>
                    <MyInfoButton My_Info_Button_Text="关注" My_Info_Button_Num={attention_num}/>
                    <MyInfoButton My_Info_Button_Text="收藏" My_Info_Button_Num={store_num}/>
                    <MyInfoButton My_Info_Button_Text="转发" My_Info_Button_Num={transmit_num}/>
                  </div>
                </div>
                <ModifyButton Modify_Button_Text="修改用户名" Modify_Button_Pic="/picture/modify_username.png" Modify_Button_Style={this.props.Modify_Username_Button_Style}/>
                <ModifyButton Modify_Button_Text="修改密码" Modify_Button_Pic="/picture/modify_password.png" Modify_Button_Style={this.props.Modify_Password_Button_Style}/>
            </div>
            <button onClick={() => this.handleButtonClick(1)} style={this.props.Posted_Button_Style} class={`midButtonStyle ${this.state.activeButton === 1 ? 'active' : ''}`}>{this.props.Posted_Button_String}</button>
            <button onClick={() => this.handleButtonClick(2)} style={this.props.Transmitted_Button_Style} class={`midButtonStyle ${this.state.activeButton === 2 ? 'active' : ''}`}>{this.props.Transmitted_Button_String}</button>
            <button onClick={() => this.handleButtonClick(3)} style={this.props.Stored_Button_Style} class={`midButtonStyle ${this.state.activeButton === 3 ? 'active' : ''}`}>{this.props.Stored_Button_String}</button>
            <svg height="800px" width="1280px">
            <line x1="181px" y1="303px" x2="946px" y2="303px" style={{ stroke: 'rgb(8, 68, 255)', strokeWidth: 1}} />
            </svg>
            {active1 && <MyList My_List_Style={this.props.My_List_Style} Search_String='' Items={this.state.items1}/>}
            {active2 && <MyList My_List_Style={this.props.My_List_Style} Search_String='' Items={this.state.items2}/>}
            {active3 && <MyList My_List_Style={this.props.My_List_Style} Search_String='' Items={this.state.items3}/>}
            <NewAvatar isOpen={this.state.isModalOpen} onClose={this.closeModal} self_info={this.props.self_info} fun_Avatar_Changed={this.props.fun_Avatar_Changed}/>
            </div>
    }
}
