import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'

import './Red_Button.css'

export default class RedButton extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Red_Button_Text: PropTypes.string,
        Red_Button_Style: PropTypes.object,
        Red_Button_Clicked: PropTypes.func,
    }

    static defaultProps = {
        Red_Button_Text: '取消',
        Red_Button_Style: {
            left: '30px',
        },
        Red_Button_Clicked: null,
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <button class="fny_red_button" style={this.props.Red_Button_Style} onClick={this.props.Red_Button_Clicked}>{this.props.Red_Button_Text}</button>
    }
}
