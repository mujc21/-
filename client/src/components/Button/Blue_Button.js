import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Blue_Button.css'

export default class BlueButton extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Blue_Button_Text: PropTypes.string,
        Blue_Button_Style: PropTypes.object,
        Blue_Button_Clicked: PropTypes.func
    }

    static defaultProps = {
        Blue_Button_Text: '蓝色',
        Blue_Button_Style: {
            left: '15px',
        },
        Blue_Button_Clicked: null,
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <button class="fny_blue_button" style={this.props.Blue_Button_Style} onClick={this.props.Blue_Button_Clicked}>{this.props.Blue_Button_Text}</button>
    }
}
