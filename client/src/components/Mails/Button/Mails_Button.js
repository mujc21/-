import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Mails_Button.css'

export default class MailsButton extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        onButtonClick: PropTypes.func,
        activeButton: PropTypes.object,
        Mails_Button_Text: PropTypes.string,
        Mails_Button_Style: PropTypes.object,
        Mails_Button_Pic: PropTypes.string,
    }

    static defaultProps = {
        Mails_Button_Text: '',
        Mails_Button_Style: {
            top: '30px',
        },
        Mails_Button_Clicked: null,
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        if (this.props.Mails_Button_Text === '回复'){
            return <button onClick={() => this.props.onButtonClick(1)} class='zgw_mails_button' style={this.props.Mails_Button_Style}>
            <img src={this.props.Mails_Button_Pic} class="icon"/>
            <span class="text_mails">{this.props.Mails_Button_Text}</span>
            </button>
        }
        else if (this.props.Mails_Button_Text === '赞'){
            return <button onClick={() => this.props.onButtonClick(2)} class='zgw_mails_button' style={this.props.Mails_Button_Style}>
            <img src={this.props.Mails_Button_Pic} class="icon"/>
            <span class="text_mails">{this.props.Mails_Button_Text}</span>
            </button>
        }
        else if (this.props.Mails_Button_Text === '公告'){
            return <button onClick={() => this.props.onButtonClick(3)} class='zgw_mails_button' style={this.props.Mails_Button_Style}>
            <img src={this.props.Mails_Button_Pic} class="icon"/>
            <span class="text_mails">{this.props.Mails_Button_Text}</span>
            </button>
        }
    }
}
