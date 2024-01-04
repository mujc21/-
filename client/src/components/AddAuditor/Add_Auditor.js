import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Add_Auditor.css'

import GreenButton from '../Button/Green_Button'
import RedButton from '../Button/Red_Button'
import InputLabel from '../Input_Label/Input_Label'
import PictureLabel from '../Picture_Label/Picture_Label'

export default class AddAuditor extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Main_Style: PropTypes.object,
        Message_Text: PropTypes.string,
        Message_Style: PropTypes.object,
        Green_Button_Text: PropTypes.string,
        Green_Button_Style: PropTypes.object,
        Red_Button_Text: PropTypes.string,
        Red_Button_Style: PropTypes.object,
        OK_Clicked: PropTypes.func,
        Cancel_Clicked: PropTypes.func,

        Email_Input_Style: PropTypes.object,
        Email_Input_Palceholder: PropTypes.string,
        Email_Input_Changed: PropTypes.func,
        Email_Input_Type: PropTypes.string,
        Key_Input_Style: PropTypes.object,
        Key_Input_Palceholder: PropTypes.string,
        Key_Input_Changed: PropTypes.func,
        Key_Input_Type: PropTypes.string,

        envelope_Style: PropTypes.object,
        key_Style: PropTypes.object,
    }

    static defaultProps = {
        Message_Text: '增添一名审核员',
        Message_Style: {
            position: 'relative',
            textAlign: 'center',
            color: 'black',
            top: '10px',
        },
        Green_Button_Text: '添加',
        Green_Button_Style: {
            top: '20px',
            left: '15px',
        },
        Red_Button_Text: '取消',
        Red_Button_Style:{
            top: '20px',
            left: '30px',
        },
        OK_Clicked: null,
        Cancel_Clicked: null,

        Email_Input_Changed: null,
        Email_Input_Type: 'text',
        Email_Input_Style: {
            position: 'relative',
            top: '-13px',
            left: '80px',
            width: '120px',
        },
        Key_Input_Changed: null,
        Key_Input_Type: 'password',
        Key_Input_Style: {
            position: 'relative',
            top: '-13px',
            left: '80px',
            width: '120px',
        },

        envelope_Style: {
            position: 'relative',
            top: '15px',
            left: '30px',
            height: "30px",
            width: "37px",
            //border: '5px solid black',
            backgroundImage: "url('./picture/envelop.png')",
            backgroundPosition: 'center',  
            backgroundSize: 'cover',
	        backgroundRepeat: 'no-repeat',
        },
        key_Style: {
            position: 'relative',
            top: '15px',
            left: '30px',
            height: "30px",
            width: "37px",
            //border: '5px solid black',
            backgroundImage: "url('./picture/key.png')",
            backgroundPosition: 'center',  
            backgroundSize: 'cover',
	        backgroundRepeat: 'no-repeat',
        }
    }

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <div class="fny_add_auditor" style={this.props.Main_Style}>
            <h2 style={this.props.Message_Style}>{this.props.Message_Text}</h2>
            <div>
                <PictureLabel Picture_Label_Style={this.props.envelope_Style}/>
                <InputLabel Input_Label_Style={this.props.Email_Input_Style} Input_Label_Placeholder={this.props.Email_Input_Palceholder} Input_Label_String_Changed={this.props.Email_Input_Changed} Input_Label_Type={this.props.Email_Input_Type}/>
            </div>
            <div>
                <PictureLabel Picture_Label_Style={this.props.key_Style}/>
                <InputLabel Input_Label_Style={this.props.Key_Input_Style} Input_Label_Placeholder={this.props.Key_Input_Palceholder} Input_Label_String_Changed={this.props.Key_Input_Changed} Input_Label_Type={this.props.Key_Input_Type}/>
            </div>
            <GreenButton Green_Button_Style={this.props.Green_Button_Style} Green_Button_Text={this.props.Green_Button_Text} Green_Button_Clicked={this.props.OK_Clicked}/>
			<RedButton Red_Button_Style={this.props.Red_Button_Style} Red_Button_Text={this.props.Red_Button_Text} Red_Button_Clicked={this.props.Cancel_Clicked}/>
            </div>
    }
}
