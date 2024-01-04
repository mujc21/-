import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './One_User.css'

import RedButton from '../Button/Red_Button'
import BlueButton from '../Button/Blue_Button'
import PictureLabel from '../Picture_Label/Picture_Label'

export default class OneUser extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Main_Style: PropTypes.object,
        Picture_Style: PropTypes.object,
        Picture_Clicked: PropTypes.func,

        User_Name: PropTypes.string,
        Post_Num: PropTypes.number,
        Like_Num: PropTypes.number,
        Reported_Num: PropTypes.number,


        Green_Button_Text: PropTypes.string,
        Green_Button_Style: PropTypes.object,
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
            //border: '5px solid black',
            backgroundImage: "url('./picture/comment_head.webp')",
            backgroundPosition: 'center',  
            backgroundSize: 'cover',
	        backgroundRepeat: 'no-repeat',
        },
        Picture_Clicked: null,

        User_Name: 'anonymous',
        Post_Num: 0,
        Like_Num: 0,
        Reported_Num: 0,


        Red_Button_Text: '封禁用户',
        Red_Button_Style: {
            left: '683px',
            top: '-230px',
            fontSize: '20px',
            height: '30px',
            width: '100px',
            borderRadius: '15px',
        },
        Blue_Button_Text: '重置密码',
        Blue_Button_Style: {
            left: '583px',
            top: '-195px',
            fontSize: '20px',
            height: '30px',
            width: '100px',
            borderRadius: '15px',
        },
        Ban_User_Clicked: null,
        Reset_Password_Clicked: null,
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <div class="fny_one_user" style={this.props.Main_Style}>
                    <PictureLabel Picture_Label_Style={this.props.Picture_Style} Picture_Label_Clicked={this.props.Picture_Clicked}/>
                    <h3 class="fny_username_in_user_list">{this.props.User_Name}</h3>

                    <h4 style={{color: 'black', position: 'relative', top: '-82px', left: '250px'}}>发帖数：{this.props.Post_Num}</h4>
				    <h4 style={{color: 'black', position: 'relative', top: '-125px', left: '380px'}}>获赞数：{this.props.Like_Num}</h4>
				    <h4 style={{color: 'black', position: 'relative', top: '-168px', left: '510px'}}>被举报数：{this.props.Reported_Num}</h4>

                    <RedButton Red_Button_Style={this.props.Red_Button_Style} Red_Button_Text={this.props.Red_Button_Text} Red_Button_Clicked={this.props.Ban_User_Clicked}/>
					<BlueButton Blue_Button_Style={this.props.Blue_Button_Style} Blue_Button_Text={this.props.Blue_Button_Text} Blue_Button_Clicked={this.props.Reset_Password_Clicked}/>
                </div>
    }
}
