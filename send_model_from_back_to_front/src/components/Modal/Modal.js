import React, { Component } from 'react';
import './Modal.css'
import OnePost from '../One_Post/One_Post';
import PropTypes from 'prop-types'

class Modal extends Component {
  static propTypes = {
    Main_Style: PropTypes.object,
}
  state = {
    one_Post_Can_Edit: true,
    one_Post_Show_Color: true,
  }

  pyfun(){
    // const { spawn } = window.require('child_process');
    // return new Promise((resolve, reject) => {
    //   //const process = spawn('python', ['./view_scene.py','./my_src_740.npy']);
    //   const process = spawn('python', ['./view_scene.py',this.state.one_Post_Can_Edit,this.state.one_Post_Show_Color]);
    // });
  }

  fun_One_Post_Head_Clicked = () =>{
    alert("在浏览的帖子中，头像被点击")
  }

  fun_One_Post_Result_Clicked = () =>{
    //alert("在浏览的帖子中，3D图片被点击")
    this.pyfun()
  }

  fun_One_Post_Can_Edit_Changed = (checked) => {
    this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
      one_Post_Can_Edit: checked
    }),()=> {
    alert("在浏览的帖子中，可编辑修改为："+this.state.one_Post_Can_Edit)
    })
  };

  fun_One_Post_Show_Color_Changed = (checked) => {
    this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
      one_Post_Show_Color: checked
    }),()=> {
    alert("在浏览的帖子中，可编辑修改为："+this.state.one_Post_Show_Color)
    })
  };

  fun_One_Post_DianZan_Clicked = (checked) => {
    alert("在浏览的帖子中，点赞改为"+String(checked))
  }

  fun_One_Post_ShouCang_Clicked = (checked) => {
    alert("在浏览的帖子中，收藏改为"+String(checked))
  }

  fun_One_Post_ZhuanFa_Clicked = (checked) => {
    alert("在浏览的帖子中，转发改为"+String(checked))
  }

  fun_One_Post_JuBao_Clicked = (checked) => {
    alert("在浏览的帖子中，举报改为"+String(checked))
  }

  render() {
    const {isOpen} = this.props
    return (
      ( isOpen &&
        <div className="modal" style={this.props.Main_Style}>
          <OnePost Main_Style={{position:'relative',left:'50px',top:'30px'}} YiDianZan={false} YiGuanZhu={false} YiZhuanFa={false} YiShouCang={false} YiJuBao={false} DianZan_Clicked={this.fun_One_Post_DianZan_Clicked} GuanZhu_Clicked={null} ShouCang_Clicked={this.fun_One_Post_ShouCang_Clicked} JuBao_Clicked={this.fun_One_Post_JuBao_Clicked} ZhuanFa_Clicked={this.fun_One_Post_ZhuanFa_Clicked} Show_Color_Changed={this.fun_One_Post_Show_Color_Changed} Can_Edit_Changed={this.fun_One_Post_Can_Edit_Changed} Result_Picture_Clicked={this.fun_One_Post_Result_Clicked} Head_Structure_Clicked={this.fun_One_Post_Head_Clicked} Result_Picture_Url={"result_image.jpg"} User_Name={"阿巴阿巴阿巴"} Head_Structure_Url={"report.png"} CopyWriting={"图片文案哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈红红火火恍恍惚惚哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈红红火火恍恍惚惚哈哈哈哈哈哈哈哈哈哈哈红红火火恍恍惚惚哈哈哈哈哈哈哈哈红红火火恍恍惚惚哈哈哈哈哈哈哈哈"}/>
        </div>
      )
    );
  }
}

export default Modal;