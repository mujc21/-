import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './One_Post.css'
import axios from 'axios'

import PictureLabel from '../Picture_Label/Picture_Label'
import { Switch } from 'antd'

export default class OnePost extends Component {

    state={
        yiDianZan: false,
        yiGuanZhu: this.props.YiGuanZhu,
        yiZhuanFa: this.props.YiZhuanFa,
        yiShouCang: this.props.YiShouCang,
        yiJuBao: this.props.YiJuBao,
    }

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Main_Style: PropTypes.object,
        Head_Structure_Style: PropTypes.object,
        Head_Structure_Url: PropTypes.string,
        User_Name: PropTypes.string,
        Result_Picture_Style: PropTypes.object,
        Result_Picture_Url: PropTypes.string,
        CopyWriting: PropTypes.string,
        Head_Structure_Clicked: PropTypes.func,
        Input_Box_String_Changed: PropTypes.func,
        Result_Picture_Clicked: PropTypes.func,
        Can_Edit_Changed: PropTypes.func,
        Show_Color_Changed: PropTypes.func,

        DianZan_Style: PropTypes.object,
        DianZan_Clicked: PropTypes.func,
        ShouCang_Style: PropTypes.object,
        ShouCang_Clicked: PropTypes.func,
        ZhuanFa_Style: PropTypes.object,
        ZhuanFa_Clicked: PropTypes.func,
        JuBao_Style: PropTypes.object,
        JuBao_Clicked: PropTypes.func,
        GuanZhu_Style: PropTypes.object,
        GuanZhu_Clicked: PropTypes.func,

        YiDianZan: PropTypes.bool,
        YiGuanZhu: PropTypes.bool,
        YiZhuanFa: PropTypes.bool,
        YiShouCang: PropTypes.bool,
        YiJuBao: PropTypes.bool,
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
        Result_Picture_Style: {
            position: 'relative',
	        backgroundSize: 'cover',
	        backgroundPosition: 'center',
	        backgroundRepeat: 'no-repeat',
	        left: '140px',
	        top: '-50px',
	        height: '280px',
	        width: '420px',
        },
        Result_Picture_Url: "result_image.jpg",

        Head_Structure_Clicked: null,
        Input_Box_String_Changed: null,
        Result_Picture_Clicked: null,
        Can_Edit_Changed: null,
        Show_Color_Changed: null,


        DianZan_Clicked: null,
        GuanZhu_Clicked: null,
        ShouCang_Clicked: null,
        JuBao_Clicked: null,
        ZhuanFa_Clicked: null,
        
        YiDianZan: false,
        YiGuanZhu: false,
        YiZhuanFa: false,
        YiShouCang: false,
        YiJuBao: false,
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


        let JuBao_Style= {
            position: 'relative',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            left: '124px',
            top: '-435px',
            height: '40px',
            width: '40px',
        }
        let ZhuanFa_Style= {
            position: 'relative',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            left: '124px',
            top: '-458px',
            height: '36px',
            width: '48px',
        }
        let DianZan_Style= {
            position: 'relative',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',  
            left: '0px',
            top: '-380px',
            height: '40px',
            width: '40px',
        }
        let ShouCang_Style= {
            position: 'relative',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',  
            left: '60px',
            top: '-420px',
            height: '40px',
            width: '42px',
        }
        
        if(this.props.YiJuBao===true){
            JuBao_Style['backgroundImage']="url('/picture/yireport.png')"
            //this.setState({yiJuBao: true})
        }
        else{
            JuBao_Style['backgroundImage']="url('/picture/report.png')"
            //this.setState({yiJuBao: false})
        }
        
        if(this.props.YiZhuanFa===true){
            ZhuanFa_Style['backgroundImage']="url('/picture/yizhuanfa.png')"
            //this.setState({yiZhuanFa: true})
        }
        else{
            ZhuanFa_Style['backgroundImage']="url('/picture/zhuanfa.jpeg')"
            //this.setState({yiZhuanFa: false})
        }
        
        if(this.props.YiDianZan===true){
            DianZan_Style['backgroundImage']="url('/picture/yidianzan.png')"
            //this.setState({yiDianZan: true})
        }
        else{
            DianZan_Style['backgroundImage']="url('/picture/dianzan.png')"
            //this.setState({yiDianZan: false})
        }
        
        if(this.props.YiShouCang===true){
            ShouCang_Style['backgroundImage']="url('/picture/yishoucang.png')"
            //this.setState({yiShouCang: true})
        }
        else{
            ShouCang_Style['backgroundImage']="url('/picture/shoucang.jpeg')"
            //this.setState({yiShouCang: false})
        }
        
        const juBao_Clicked = ()=>{
            if(this.state.yiJuBao===false){
                var temp=document.getElementById("picture_JuBao")
                temp.style.backgroundImage="url('/picture/yireport.png')"
                this.setState({yiJuBao:true})
            }
            this.props.JuBao_Clicked(true)
        }
        const zhuanFa_Clicked = ()=>{
            if(this.state.yiZhuanFa===false){
                var temp=document.getElementById("picture_ZhuanFa")
                temp.style.backgroundImage="url('/picture/yizhuanfa.png')"
                this.setState({yiZhuanFa:true})
            }
            this.props.ZhuanFa_Clicked(true)
        }
        const dianZan_Clicked = ()=>{
            if(this.state.yiDianZan===false){
                var temp=document.getElementById("picture_DianZan")
                temp.style.backgroundImage="url('/picture/yidianzan.png')"
                this.setState({yiDianZan:true})
                this.props.DianZan_Clicked(true)
            }
            else{
                var temp=document.getElementById("picture_DianZan")
                temp.style.backgroundImage="url('/picture/dianzan.png')"
                this.setState({yiDianZan:false})
                this.props.DianZan_Clicked(false)
            }
        }
        const shouCang_Clicked = ()=>{
            if(this.state.yiShouCang===false){
                var temp=document.getElementById("picture_ShouCang")
                temp.style.backgroundImage="url('/picture/yishoucang.png')"
                this.setState({yiShouCang:true})
                this.props.ShouCang_Clicked(true)
            }
            else{
                var temp=document.getElementById("picture_ShouCang")
                temp.style.backgroundImage="url('/picture/shoucang.jpeg')"
                this.setState({yiShouCang:false})
                this.props.ShouCang_Clicked(false)
            }
        }

        if(this.props.YiGuanZhu){
            this.setState({yiShouCang: true})
        }
        else{
        }

        return <div class="fny_one_post" style={this.props.Main_Style}>
            <PictureLabel Picture_Label_Style={temp_Head_Structure_Style} Picture_Label_Clicked={this.props.Head_Structure_Clicked}/>

            <h2 class="fny_username_in_one_post">{this.props.User_Name}</h2>
            <h4 class="fny_text_in_one_post">{this.props.CopyWriting}</h4>

            <PictureLabel Picture_Label_Style={temp_Result_Picture_Style} Picture_Label_Clicked={this.props.Result_Picture_Clicked}/>

            <div style={{position: 'relative', left: '625px', top: '-280px'}}>
                <Switch defaultChecked  onClick={this.props.Can_Edit_Changed}/>
                <h4 style={{position: 'relative', left: '70px',top: '-45px'}}>可编辑</h4>
                <Switch defaultChecked  onClick={this.props.Show_Color_Changed}/>
                <h4 style={{position: 'relative', left: '70px',top: '-45px'}}>显示颜色</h4>

                <div id="picture_DianZan" style={DianZan_Style} onClick={dianZan_Clicked}></div>
                <div id="picture_ShouCang" style={ShouCang_Style} onClick={shouCang_Clicked}></div>
                <div id="picture_ZhuanFa" style={ZhuanFa_Style} onClick={zhuanFa_Clicked}></div>
                <div id="picture_JuBao" style={JuBao_Style} onClick={juBao_Clicked}></div>
            </div>
        </div>
    }
}
