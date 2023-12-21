import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Mails.css'

import MailsButton from './Button/Mails_Button'
import MailsList from './Mails_List/Mails_List'

export default class Mails extends Component {

    state = {
        activeButton: null,
    };
    
    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        MainStyle: PropTypes.object,
        Announcements_Button_Style: PropTypes.object,
        Announcements_Button_String: PropTypes.string,

        Reply_Button_Style: PropTypes.object,
        Reply_Button_String: PropTypes.string,
        
        Compliments_Button_Style: PropTypes.object,
        Compliments_Button_String: PropTypes.string,  

        Mails_List_Style: PropTypes.object,
        messages: PropTypes.object,
    }

    static defaultProps = {
        Reply_Button_String:'回复',
        Reply_Button_Style:{
            top: '3.75%',
            left: '24%',
        },
        
        Compliments_Button_String:'赞',
        Compliments_Button_Style:{
            top: '3.75%',
            left: '47%',
        },

        Announcements_Button_String:'公告',
        Announcements_Button_Style:{
            top: '3.75%',
            left: '73%',
        },

        Mails_List_Style:{
            top: '14%',
            left: '0px',
        },
        messages: null,
    }

    handleButtonClick = (buttonId) => {
        this.setState({ activeButton: buttonId });
        // 执行其他按钮点击后的逻辑
      };

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        const { activeButton } = this.state;
        return <div class='zgw_mails' style={this.props.Main_Style}>
            <MailsButton onButtonClick={this.handleButtonClick} activeButton={activeButton} Mails_Button_Style={this.props.Reply_Button_Style} Mails_Button_Text={this.props.Reply_Button_String} Mails_Button_Pic='/picture/Reply.png'/>
            <MailsButton onButtonClick={this.handleButtonClick} activeButton={activeButton} Mails_Button_Style={this.props.Compliments_Button_Style} Mails_Button_Text={this.props.Compliments_Button_String} Mails_Button_Pic='/picture/Compliments.png'/>
            <MailsButton onButtonClick={this.handleButtonClick} activeButton={activeButton} Mails_Button_Style={this.props.Announcements_Button_Style} Mails_Button_Text={this.props.Announcements_Button_String} Mails_Button_Pic='/picture/Announcements.png'/>
            <MailsList MailsListStyle={this.props.Mails_List_Style} messages={this.props.messages}/>
            </div>
    }
}
