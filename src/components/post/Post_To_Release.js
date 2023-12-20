import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Post_To_Release.css'

import PictureLabel from '../Picture_Label/Picture_Label'
import GreenButton from '../Button/Green_Button'
import BlueButton from '../Button/Blue_Button'
import RedButton from '../Button/Red_Button'
import InputBox from '../Input_Label/Input_Box'
import { Switch } from 'antd'

export default class PostToRelease extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Main_Style: PropTypes.object,
        Head_Structure_Style: PropTypes.object,
        Head_Structure_Url: PropTypes.string,
        User_Name: PropTypes.string,
        Input_Box_Style: PropTypes.object,
        Input_Box_Placeholder: PropTypes.string,
        Result_Picture_Style: PropTypes.object,
        Result_Picture_Url: PropTypes.string,

        Blue_Button_Text: PropTypes.string,
        Blue_Button_Style: PropTypes.object,
        Blue_Button_Clicked: PropTypes.func,

        Red_Button_Text: PropTypes.string,
        Red_Button_Style: PropTypes.object,
        Red_Button_Clicked: PropTypes.func,

        Green_Button_Text: PropTypes.string,
        Green_Button_Style: PropTypes.object,
        Green_Button_Clicked: PropTypes.func,

        Head_Structure_Clicked: PropTypes.func,
        Input_Box_String_Changed: PropTypes.func,
        Result_Picture_Clicked: PropTypes.func,

        Can_Edit_Changed: PropTypes.func,
    }

    static defaultProps = {
        Main_Style: {

        },
        Head_Structure_Style: {
            position: 'relative',
	        backgroundSize: 'cover',
	        backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',  
	        left: '55px',
	        top: '35px',
	        height: '70px',
	        width: '70px',
        },
        Head_Structure_Url: 'head_structure.jpeg',
        User_Name: "anonymous",
        Input_Box_Style: {
            position: 'relative',
	        top: '-70px',
	        left: '180px',
            width: '350px',
            height: '80px',
	        color: 'black',
	        marginBottom: '30px',
	        fontSize: '16px',
        },
        Input_Box_Placeholder: "请输入文案···",
        Result_Picture_Style: {
            position: 'relative',
	        backgroundSize: 'cover',
	        backgroundPosition: 'center',
	        backgroundRepeat: 'no-repeat',
	        left: '190px',
	        top: '-90px',
	        height: '280px',
	        width: '420px',
        },
        Result_Picture_Url: "result_image.jpg",

        Blue_Button_Text: "组合新点云",
        Blue_Button_Style: {
            position: 'relative',
	        left: '270px',
	        top: '-190px',
	        height: '40px',
	        width: '120px',
	        borderRadius: '8px',
	        fontSize: '18px',
        },
        Blue_Button_Clicked: null,

        Red_Button_Text: "取消",
        Red_Button_Style: {
            left: '300px',
            top: '-60px',
            fontSize: '24px',
            height: '50px',
            width: '150px',
            borderRadius: '25px',
        },
        Red_Button_Clicked: null,

        Green_Button_Text: "发表",
        Green_Button_Style: {
            left: '200px',
            top: '-60px',
            fontSize: '24px',
            height: '50px',
            width: '150px',
            borderRadius: '25px',
        },
        Green_Button_Clicked: null,

        Head_Structure_Clicked: null,
        Input_Box_String_Changed: null,
        Result_Picture_Clicked: null,
        Can_Edit_Changed: null,
    }

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        let temp_Head_Structure_Style={}
        let temp_Result_Picture_Style={}
        for(var key in this.props.Head_Structure_Style){
            temp_Head_Structure_Style[key]=this.props.Head_Structure_Style[key]
        }
        for(var key_ in this.props.Result_Picture_Style){
            temp_Result_Picture_Style[key_]=this.props.Result_Picture_Style[key_]
        }
        temp_Head_Structure_Style['backgroundImage']="url('/picture/"+this.props.Head_Structure_Url+"')"
        temp_Result_Picture_Style['backgroundImage']="url('/picture/"+this.props.Result_Picture_Url+"')"

        return <div class="fny_post_to_release" style={this.props.Main_Style}>
            <PictureLabel Picture_Label_Style={temp_Head_Structure_Style} Picture_Label_Clicked={this.props.Head_Structure_Clicked}/>
        
            <h2 class="fny_username_in_one_post">{this.props.User_Name}</h2>
            <InputBox Input_Box_Style={this.props.Input_Box_Style} Input_Box_String_Changed={this.props.Input_Box_String_Changed} Input_Box_Placeholder={this.props.Input_Box_Placeholder}/>
        
            <BlueButton Blue_Button_Style={this.props.Blue_Button_Style} Blue_Button_Text={this.props.Blue_Button_Text} Blue_Button_Clicked={this.props.Blue_Button_Clicked}/>

            <PictureLabel Picture_Label_Style={temp_Result_Picture_Style} Picture_Label_Clicked={this.props.Result_Picture_Clicked}/>

            <GreenButton Green_Button_Style={this.props.Green_Button_Style} Green_Button_Text={this.props.Green_Button_Text} Green_Button_Clicked={this.props.Green_Button_Clicked}/>
            <RedButton Red_Button_Style={this.props.Red_Button_Style} Red_Button_Text={this.props.Red_Button_Text} Red_Button_Clicked={this.props.Red_Button_Clicked}/>

            <div style={{position: 'relative', left: '625px', top: '-480px'}}>
                <Switch defaultChecked  onClick={this.props.Can_Edit_Changed}/>
                <h4 style={{position: 'relative', left: '70px',top: '-45px'}}>可编辑</h4>
            </div>
            {/* <div style={{position: 'relative', left: '630px', top: '-350px'}}>
                <Switch defaultChecked  />
                <h4 style={{position: 'relative', left: '70px',top: '-45px'}}>可编辑</h4>
            </div>

            <div style={{position: 'relative', left: '630px', top: '-370px'}}>
                <Switch defaultChecked  />
                <h4 style={{position: 'relative', left: '70px',top: '-45px'}}>彩色显示</h4>
            </div> */}
        </div>
    }
}
