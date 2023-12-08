import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Register.css'

import GreenButton from '../Button/Green_Button'
import InputLabel from '../Input_Label/Input_Label'
import PictureLabel from '../Picture_Label/Picture_Label'
import {Link} from 'react-router-dom';

export default class Login extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Main_Style: PropTypes.object,
        enter_Login: PropTypes.func,
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
        Confirm_Key_Input_Style: PropTypes.object,
        Confirm_Key_Input_Palceholder: PropTypes.string,
        Confirm_Key_Input_Changed: PropTypes.func,
        Confirm_Key_Input_Type: PropTypes.string,

        envelope_Style: PropTypes.object,
        key_Style: PropTypes.object,
        confirm_key_Style: PropTypes.object,
    }

    static defaultProps = {
        Message_Text: '注册',
        Message_Style: {
            position: 'relative',
            textAlign: 'center',
            color: 'white',
            top: '20px',
        },
        Green_Button_Text: '注册',
        Green_Button_Style: {
            top: '18px',
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
            top: '-5px',
            left: '100px',
            width: '140px',
            backgroundColor: '#2b3d6b',
            borderWidth: '0px',
            height: '25px',
        },
        Email_Input_Palceholder: '用户名，2-15个字符',

        Key_Input_Changed: null,
        Key_Input_Type: 'password',
        Key_Input_Style: {
            position: 'relative',
            color: 'white',
            top: '-5px',
            left: '100px',
            width: '140px',
            backgroundColor: '#2b3d6b',
            borderWidth: '0px',
            height: '25px',
        },
        Key_Input_Palceholder: '密码，8-15个字符',

        Confirm_Key_Input_Changed: null,
        Confirm_Key_Input_Type: 'password',
        Confirm_Key_Input_Style: {
            position: 'relative',
            color: 'white',
            top: '-5px',
            left: '100px',
            width: '140px',
            backgroundColor: '#2b3d6b',
            borderWidth: '0px',
            height: '25px',
        },
        Confirm_Key_Input_Palceholder: '确认密码',

        envelope_Style: {
            position: 'relative',
            top: '24px',
            left: '50px',
            height: "30px",
            width: "37px",
            //border: '5px solid black',
            backgroundImage: "url('/picture/user.png')",
            backgroundPosition: 'center',  
            backgroundSize: 'cover',
	        backgroundRepeat: 'no-repeat',
        },
        key_Style: {
            position: 'relative',
            top: '24px',
            left: '50px',
            height: "30px",
            width: "37px",
            //border: '5px solid black',
            backgroundImage: "url('/picture/password.png')",
            backgroundPosition: 'center',  
            backgroundSize: 'cover',
	        backgroundRepeat: 'no-repeat',
        },
        confirm_key_Style: {
            position: 'relative',
            top: '24px',
            left: '50px',
            height: "30px",
            width: "37px",
            //border: '5px solid black',
            backgroundImage: "url('/picture/confirm.png')",
            backgroundPosition: 'center',  
            backgroundSize: 'cover',
	        backgroundRepeat: 'no-repeat',
        }
    }

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        const linkStyle = {
            textDecoration: 'none', // 不显示下划线
        };
        const divStyle = {
            display: 'flex',
            width: '1200px',
            height: '800px',
            backgroundColor: '#2b3d6b'
        }
        const Register_Style = {
            position: 'absolute',
            top: '244px',
            left: '140px',
            color: 'white',
            fontSize: '20px',
        }
        const Register_Style1 = {
            position: 'absolute',
            top: '260px',
            left: '150px',
            color: 'white',
            fontWeight: '700',
            fontSize: '11px',
        }
        const Register_Style2 = {
            position: 'absolute',
            top: '271px',
            left: '205px',
            color: 'white',
            fontWeight: '700',
            fontSize: '11px',
        }

        return <div style={divStyle}> 
                <div class="zgw_login" style={this.props.Main_Style}>
                <h2 style={this.props.Message_Style}>{this.props.Message_Text}</h2>
                <div>
                    <PictureLabel Picture_Label_Style={this.props.envelope_Style}/>
                    <InputLabel Input_Label_Style={this.props.Email_Input_Style} Input_Label_Placeholder={this.props.Email_Input_Palceholder} Input_Label_String_Changed={this.props.Email_Input_Changed} Input_Label_Type={this.props.Email_Input_Type} />
                </div>
                <div>
                    <PictureLabel Picture_Label_Style={this.props.key_Style}/>
                    <InputLabel Input_Label_Style={this.props.Key_Input_Style} Input_Label_Placeholder={this.props.Key_Input_Palceholder} Input_Label_String_Changed={this.props.Key_Input_Changed} Input_Label_Type={this.props.Key_Input_Type} />
                </div>
                <div>
                    <PictureLabel Picture_Label_Style={this.props.confirm_key_Style}/>
                    <InputLabel Input_Label_Style={this.props.Confirm_Key_Input_Style} Input_Label_Placeholder={this.props.Confirm_Key_Input_Palceholder} Input_Label_String_Changed={this.props.Confirm_Key_Input_Changed} Input_Label_Type={this.props.Confirm_Key_Input_Type} />
                </div>

                <GreenButton Green_Button_Style={this.props.Green_Button_Style} Green_Button_Text={this.props.Green_Button_Text} Green_Button_Clicked={this.props.OK_Clicked}/>
                
                <p style={Register_Style}>|</p>
                <p style={Register_Style1}>已有账号？</p>
                <Link to='/Login' onClick={this.props.enter_Login} style={Register_Style2}>登录</Link>
                </div>
              </div>
    }
}
