import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './One_Reported_User.css'

import RedButton from '../Button/Red_Button'
import BlueButton from '../Button/Blue_Button'
import PictureLabel from '../Picture_Label/Picture_Label'

export default class OneReportedUser extends Component {

    state= {
        mouseState: "hidden"
    }

    set_mouse_state = (flag) =>{
        return () =>{
            this.setState({mouseState:flag})
        }
    }

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Main_Style: PropTypes.object,
        Picture_Style: PropTypes.object,
        Picture_Clicked: PropTypes.func,

        User_index: PropTypes.number,

        User_Name: PropTypes.string,
        Reported_Content: PropTypes.string,
        Head_Structure_Url: PropTypes.string,

        Blue_Button_Text: PropTypes.string,
        Blue_Button_Style: PropTypes.object,
        Red_Button_Text: PropTypes.string,
        Red_Button_Style: PropTypes.object,
        Ban_User_Clicked: PropTypes.func,
        Reset_Password_Clicked: PropTypes.func,
    }

    static defaultProps = {
        Picture_Style: {
            position: 'relative',
            top: '20px',
            left: '25px',
            height: "50px",
            width: "50px",
            backgroundImage: "url('/picture/comment_head.webp')",
            backgroundPosition: 'center',  
            backgroundSize: 'cover',
	        backgroundRepeat: 'no-repeat',
        },
        Picture_Clicked: null,

        User_Name: 'anonymous',
        Reported_Content: 'null',
        Head_Structure_Url: "comment_head.webp",

        User_index: 0,

        Red_Button_Text: '有违规',
        Red_Button_Style: {
            position: 'relative',
            left: '583px',
            top: '-155px',
            fontSize: '20px',
            height: '30px',
            width: '100px',
            borderRadius: '15px',
        },
        Blue_Button_Text: '无违规',
        Blue_Button_Style: {
            position: 'relative',
            left: '603px',
            top: '-155px',
            fontSize: '20px',
            height: '30px',
            width: '100px',
            borderRadius: '15px',
            visibility: "hidden",
        },
        Ban_User_Clicked: null,
        Reset_Password_Clicked: null,
    }

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        let temp_Blue_Button_Style={}
        let temp_Red_Button_Style={}
        let temp_Picture_Style={}
        for(var key in this.props.Blue_Button_Style){
            temp_Blue_Button_Style[key]=this.props.Blue_Button_Style[key]
        }
        for(var key_ in this.props.Red_Button_Style){
            temp_Red_Button_Style[key_]=this.props.Red_Button_Style[key_]
        }
        for(var key__ in this.props.Picture_Style){
            temp_Picture_Style[key__]=this.props.Picture_Style[key__]
        }
        temp_Blue_Button_Style['visibility']=this.state.mouseState
        temp_Red_Button_Style['visibility']=this.state.mouseState
        temp_Picture_Style['backgroundImage']="url('/picture/"+this.props.Head_Structure_Url+"')"
        return <div class="fny_one_user" style={this.props.Main_Style} onMouseEnter={this.set_mouse_state("visible")} onMouseLeave={this.set_mouse_state("hidden")}>
                    <PictureLabel Picture_Label_Style={temp_Picture_Style} Picture_Label_Clicked={this.props.Picture_Clicked} Index={this.props.User_index}/>
                    <h3 class="fny_username_in_user_list">{this.props.User_Name}</h3>

                    <h4 style={{color: 'black', position: 'relative', top: '-82px', left: '250px', width: '300px',height:'50px',overflow: 'auto'}}>{this.props.Reported_Content}</h4>

                    <RedButton Red_Button_Style={temp_Red_Button_Style} Red_Button_Text={this.props.Red_Button_Text} Red_Button_Clicked={this.props.Ban_User_Clicked} Index={this.props.User_index}/>
					<BlueButton Blue_Button_Style={temp_Blue_Button_Style} Blue_Button_Text={this.props.Blue_Button_Text} Blue_Button_Clicked={this.props.Reset_Password_Clicked} Index={this.props.User_index}/>
                </div>
    }
}
