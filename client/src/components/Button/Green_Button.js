import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'

import './Green_Button.css'

export default class GreenButton extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Green_Button_Text: PropTypes.string,
        Green_Button_Style: PropTypes.object,
        Green_Button_Clicked: PropTypes.func
    }

    static defaultProps = {
        Green_Button_Text: '取消',
        Green_Button_Style: {
            left: '15px',
        },
        Green_Button_Clicked: null,
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <button class="fny_green_button" style={this.props.Green_Button_Style} onClick={this.props.Green_Button_Clicked}>{this.props.Green_Button_Text}</button>
    }
}
