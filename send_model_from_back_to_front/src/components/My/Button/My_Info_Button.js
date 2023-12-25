import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './My_Info_Button.css'

export default class MyInfoButton extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        My_Info_Button_Text: PropTypes.string,
        My_Info_Button_Num: PropTypes.string,
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        if (this.props.My_Info_Button_Text === '关注')
        return <button class='zgw_my_info_button'>
            <span class="text_info">{this.props.My_Info_Button_Num}</span>
            <span class="text_info">关注</span>
        </button>
        else if (this.props.My_Info_Button_Text === '收藏')
        return <button class='zgw_my_info_button'>
            <span class="text_info">{this.props.My_Info_Button_Num}</span>
            <span class="text_info">收藏</span>
        </button>
        else if (this.props.My_Info_Button_Text === '转发')
        return <button class='zgw_my_info_button'>
            <span class="text_info">{this.props.My_Info_Button_Num}</span>
            <span class="text_info">转发</span>
        </button>
    }
}
