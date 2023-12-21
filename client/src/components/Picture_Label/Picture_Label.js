import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class PictureLabel extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Picture_Label_Style: PropTypes.object,
        Picture_Label_Clicked: PropTypes.func,
    }

    static defaultProps = {
        Picture_Label_Style:{
            width: '75px',
            height: '75px',
            border: '5px solid black',
        },
        Picture_Label_Clicked: null
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <div onClick={this.props.Picture_Label_Clicked} style={this.props.Picture_Label_Style}></div>
    }
}