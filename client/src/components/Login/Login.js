import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Login.css'

import GreenButton from '../Button/Green_Button'
import {Spin} from 'antd'

import PictureLabel from '../Picture_Label/Picture_Label'
import {Link} from 'react-router-dom';

export default class Login extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    state={
        inputEmailValue: '', 
        inputKeyValue: '', 
    }

    componentDidMount(){
        this.props.onClose()
    }

    static propTypes = {
        Main_Style: PropTypes.object,
        enter_Register: PropTypes.func,
        Message_Text: PropTypes.string,
        Message_Style: PropTypes.object,
        Green_Button_Text: PropTypes.string,
        Green_Button_Style: PropTypes.object,
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

        isOpen: PropTypes.bool,
        onClose: PropTypes.func,
        LoginReminderString: PropTypes.string
    }

    static defaultProps = {
        Message_Text: '登录',
        Message_Style: {
            position: 'relative',
            textAlign: 'center',
            color: 'white',
            top: '25px',
        },
        Green_Button_Text: '登录',
        Green_Button_Style: {
            top: '45px',
            left: '70px',
            width: '60px',
            color: 'white',
            fontSize: '12px',
            fontWeight: '700',
            backgroundColor: '#2b3d6b',
        },
        OK_Clicked: null,
        Cancel_Clicked: null,

        Email_Input_Changed: null,
        Email_Input_Type: 'text',
        Email_Input_Style: {
            position: 'relative',
            color: 'white',
            top: '5px',
            left: '110px',
            width: '120px',
            backgroundColor: '#2b3d6b',
            borderWidth: '0px',
            height: '25px',
        },
        Email_Input_Palceholder: '用户名',
        
        Key_Input_Changed: null,
        Key_Input_Type: 'password',
        Key_Input_Style: {
            position: 'relative',
            color: 'white',
            top: '5px',
            left: '110px',
            width: '120px',
            backgroundColor: '#2b3d6b',
            borderWidth: '0px',
            height: '25px',
        },

        envelope_Style: {
            position: 'relative',
            top: '33px',
            left: '60px',
            height: "30px",
            width: "37px",
            //border: '5px solid black',
            backgroundImage: "url('./picture/user.png')",
            backgroundPosition: 'center',  
            backgroundSize: 'cover',
	        backgroundRepeat: 'no-repeat',
        },
        key_Style: {
            position: 'relative',
            top: '33px',
            left: '60px',
            height: "30px",
            width: "37px",
            //border: '5px solid black',
            backgroundImage: "url('./picture/password.png')",
            backgroundPosition: 'center',  
            backgroundSize: 'cover',
	        backgroundRepeat: 'no-repeat',
        },
        Key_Input_Palceholder: '密码'
    }

    handleEmailChange = (e) => {
        this.setState({inputEmailValue: e.target.value})
        this.props.Email_Input_Changed(e.target.value)
    }

    handleKeyChange = (e) => {
        this.setState({inputKeyValue: e.target.value})
        this.props.Key_Input_Changed(e.target.value)
    }

    handleOKClicked = () => {
        this.setState({inputKeyValue: ''})
        this.setState({inputEmailValue: ''})
        this.props.OK_Clicked()
        this.props.onClose()
    }

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {

        const divStyle = {
            display: 'flex',
            width: '100%',
            height: '100vh',
            backgroundColor: '#2b3d6b'
        }
        const Register_Style = {
            position: 'absolute',
            top: '214px',
            left: '140px',
            color: 'white',
            fontSize: '20px',
        }
        const Register_Style1 = {
            position: 'absolute',
            top: '230px',
            left: '150px',
            color: 'white',
            fontWeight: '700',
            fontSize: '11px',
        }
        const Register_Style2 = {
            position: 'absolute',
            top: '240.5px',
            left: '216px',
            color: 'white',
            fontWeight: '700',
            fontSize: '11px',
        }

        const Login_Reminder_Style_Email = {
            position: 'absolute',
            top: '128px',
            left: '112px',
            color: 'red',
            fontWeight: '700',
            fontSize: '11px',
        }

        const Login_Reminder_Style_Password = {
            position: 'absolute',
            top: '185px',
            left: '112px',
            color: 'red',
            fontWeight: '700',
            fontSize: '11px',
        }

        return <div style={divStyle}> 
                <Spin delay={100} spinning={this.props.isLoading} fullscreen/> 
                <div class={`zgw_login ${this.props.isLoading ? 'loading' : ''}`} style={this.props.Main_Style}>
                    <h2 style={this.props.Message_Style}>{this.props.Message_Text}</h2>
                    <div>
                        <PictureLabel Picture_Label_Style={this.props.envelope_Style}/>
                        <input class="zgw_login_input_label" style={this.props.Email_Input_Style} value={this.state.inputEmailValue} placeholder={this.props.Email_Input_Palceholder} onChange={this.handleEmailChange} type={this.props.Email_Input_Type}/>
                    </div>
                    <div>
                        <PictureLabel Picture_Label_Style={this.props.key_Style}/>
                        <input class="zgw_login_input_label" style={this.props.Key_Input_Style} value={this.state.inputKeyValue} placeholder={this.props.Key_Input_Palceholder} onChange={this.handleKeyChange} type={this.props.Key_Input_Type}/>
                    </div>

                    <GreenButton Green_Button_Style={this.props.Green_Button_Style} Green_Button_Text={this.props.Green_Button_Text} Green_Button_Clicked={this.handleOKClicked}/>
                    <p style={Register_Style}>|</p>
                    <p style={Register_Style1}>还没有账号？</p>
                    <Link to='/Register' onClick={this.props.enter_Register} style={Register_Style2}>注册</Link>

                    {this.props.isOpen && ((this.props.LoginReminderString == "该用户未注册" || this.props.LoginReminderString == "响应失败，请重试") ? <p style={Login_Reminder_Style_Email}>{this.props.LoginReminderString}</p> : <p style={Login_Reminder_Style_Password}>{this.props.LoginReminderString}</p>)}    
                </div>
              </div>
    }
}
