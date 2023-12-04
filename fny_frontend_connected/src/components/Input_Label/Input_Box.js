import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Input_Box.css'

export default class InputBox extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Input_Box_Style: PropTypes.object,
        Input_Box_Placeholder: PropTypes.string,
        Input_Box_String_Changed: PropTypes.func,
        Input_Box_Rows: PropTypes.string,
        Input_Box_Cols: PropTypes.string,
    }

    static defaultProps = {
        Input_Box_Style: {
            position: 'relative',
            top: '30px',
            left: '45px',
        },
        Input_Box_Placeholder: '请输入',
        Input_Box_Rows: "5",
        Input_Box_Cols: "50",
    }

    handleKeyUp = (event) => {  
        // 解构赋值获取target, key
        const {target, key} = event
        // 判断是否是回车
        if (key !== 'Enter') {
            this.props.Input_Box_String_Changed(target.value)
        }
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <textarea rows={this.props.Input_Box_Rows} cols={this.props.Input_Box_Cols} onKeyUp={this.handleKeyUp} class='fny_input_box' placeholder={this.props.Input_Box_Placeholder} style={this.props.Input_Box_Style}/>
    }
}
