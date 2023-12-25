import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Back_Button.css'

export default class BackButton extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Back_Button_Style: PropTypes.object,
    }

    static defaultProps = {
        Back_Button_Style: {
            top: '46px',
        },
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <button class='zgw_back_button' style={this.props.Back_Button_Style}>
            <img src="/picture/Back.png"/>
        </button>
    }
}
