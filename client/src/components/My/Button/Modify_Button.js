import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Modify_Button.css'

export default class ModifyButton extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        onButtonClick: PropTypes.func,
        Modify_Button_Text: PropTypes.string,
        Modify_Button_Style: PropTypes.object,
        Modify_Button_Pic: PropTypes.string,
    }

    static defaultProps = {
        onButtonClick: null,
        Modify_Button_Text: '',
        Modify_Button_Style: {
            top: '30px',
        },
        Modify_Button_Clicked: null,
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <button onClick={this.props.onButtonClick} class='zgw_modify_button' style={this.props.Modify_Button_Style}>
        <img src={this.props.Modify_Button_Pic} class="icon_modify"/>
        <span class="text_modify">{this.props.Modify_Button_Text}</span>
        </button>
    }
}
