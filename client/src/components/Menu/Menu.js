import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Menu.css'
import {Link} from 'react-router-dom';

import MenuButton from './Button/Menu_Button'

export default class Menu extends Component {

    state = {
        activeButton: 1,
    };
    
    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        MainStyle: PropTypes.object,
        Discover_Button_Style: PropTypes.object,
        Discover_Button_String: PropTypes.string,

        Post_Button_Style: PropTypes.object,
        Post_Button_String: PropTypes.string,
        
        Mail_Button_Style: PropTypes.object,
        Mail_Button_String: PropTypes.string, 

        My_Button_Style: PropTypes.object,
        My_Button_String: PropTypes.string, 

        Package_Button_Style: PropTypes.object,
        Package_Button_String: PropTypes.string, 
    }

    static defaultProps = {
        Discover_Button_String:'发现',
        Discover_Button_Style:{
            top: '16.125%',
            left: '0px',
        },
        Discover_Button_Pic:"./picture/Discover.png",
        
        Post_Button_String:'发布',
        Post_Button_Style:{
            top: '32.9%',
            left: '0px',
        },
        Post_Button_Pic:"./picture/Post.png",

        Mail_Button_String:'消息',
        Mail_Button_Style:{
            top: '49.675%',
            left: '0px',
        },
        Mail_Button_Pic:"./picture/Mail.png",

        My_Button_String:'我的',
        My_Button_Style:{
            top: '66.45%',
            left: '0px',
        },
        My_Button_Pic:"./picture/My.png",

        Package_Button_String:'素材库',
        Package_Button_Style:{
            top: '83.225%',
            left: '0px',
        },
        Package_Button_Pic:"./picture/Package.png",
    }

    handleButtonClick = (buttonId) => {
        this.setState({activeButton: buttonId});
        // 执行其他按钮点击后的逻辑
       // 如果当前路径不包含/mails，则进行重定向
    };

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        const {activeButton} = this.state;

        const linkStyle = {
            textDecoration: 'none', // 不显示下划线
        };

        return <div class='zgw_menu' style={this.props.Main_Style}>
        <label class='community_label'>3D社区</label> 
        <Link to="/Discover" style={linkStyle}>
            <MenuButton onButtonClick={this.handleButtonClick} activeButton={activeButton} Menu_Button_Style={this.props.Discover_Button_Style} Menu_Button_Text={this.props.Discover_Button_String} Menu_Button_Pic={this.props.Discover_Button_Pic}/>
        </Link>
        <Link to="/post" style={linkStyle}>
            <MenuButton onButtonClick={this.handleButtonClick} activeButton={activeButton} Menu_Button_Style={this.props.Post_Button_Style} Menu_Button_Text={this.props.Post_Button_String} Menu_Button_Pic={this.props.Post_Button_Pic}/>
        </Link>
        <Link to="/mails" style={linkStyle}>
            <MenuButton onButtonClick={this.handleButtonClick} activeButton={activeButton} Menu_Button_Style={this.props.Mail_Button_Style} Menu_Button_Text={this.props.Mail_Button_String} Menu_Button_Pic={this.props.Mail_Button_Pic}/>
        </Link>
        <Link to="/My" style={linkStyle}>
            <MenuButton onButtonClick={this.handleButtonClick} activeButton={activeButton} Menu_Button_Style={this.props.My_Button_Style} Menu_Button_Text={this.props.My_Button_String} Menu_Button_Pic={this.props.My_Button_Pic}/>
        </Link>
        <Link to="/Materials" style={linkStyle}>
            <MenuButton onButtonClick={this.handleButtonClick} activeButton={activeButton} Menu_Button_Style={this.props.Package_Button_Style} Menu_Button_Text={this.props.Package_Button_String} Menu_Button_Pic={this.props.Package_Button_Pic}/>
        </Link>
        </div>
    }
}
