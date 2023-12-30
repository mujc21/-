import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'

import './OK_Cancel_Dialog.css'
import GreenButton from '../Button/Green_Button'
import RedButton from '../Button/Red_Button'

export default class OKCancelDialog extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Dialog_Style: PropTypes.object,
        Green_Button_Text: PropTypes.string,
        Green_Button_Style: PropTypes.object,
        Red_Button_Text: PropTypes.string,
        Red_Button_Style: PropTypes.object,
        Message_Text: PropTypes.string,
        Message_Style: PropTypes.object,
        Question_Text: PropTypes.string,
        Question_Style: PropTypes.object,
        OK_Clicked: PropTypes.func,
        Cancel_Clicked: PropTypes.func,
    }

    static defaultProps = {
        Dialog_Style: {
            left: '15px',
            top: '20px',
            border: '5px black solid',
        },
        Green_Button_Text: '确定',
        Green_Button_Style: {
            top: '45px',
            left: '15px',
        },
        Red_Button_Text: '取消',
        Red_Button_Style:{
            top: '45px',
            left: '30px',
        },
        Message_Text: '提示',
        Message_Style: {
            position: 'relative',
            textAlign: 'center',
            color: 'black',
            top: '10px',
        },
        Question_Text: '是否确认？',
        Question_Style: {
            position: 'relative',
            textAlign: 'center',
            color: 'black',
            top: '25px'
        },
        OK_Clicked: null,
        Cancel_Clicked: null,
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <div class="fny_add_auditor" style={this.props.Dialog_Style}>
				    <h2 style={this.props.Message_Style}>{this.props.Message_Text}</h2>
					<h4 style={this.props.Question_Style}>{this.props.Question_Text}</h4>
					<GreenButton Green_Button_Style={this.props.Green_Button_Style} Green_Button_Text={this.props.Green_Button_Text} Green_Button_Clicked={this.props.OK_Clicked}/>
					<RedButton Red_Button_Style={this.props.Red_Button_Style} Red_Button_Text={this.props.Red_Button_Text} Red_Button_Clicked={this.props.Cancel_Clicked}/>
			    </div>
    }
}
