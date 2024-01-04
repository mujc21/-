import React, { Component } from 'react';
import './Modal.css'
import OnePost from '../One_Post/One_Post';
import PropTypes from 'prop-types'

class Modal extends Component {
  static propTypes = {
    Main_Style: PropTypes.object,
  }

  static defaultProps = {
    currentEnter: null,
  }
  state = {
    one_Post_Can_Edit: true,
    one_Post_Show_Color: true,
  }

  handleBackgroundClick = (event) =>{
    if (event.target.classList.contains('modal')){
        this.props.onClose();
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.currentEnter !== null && prevProps.currentEnter !== this.props.currentEnter && this.props.isOpen){
      this.props.onClose();
    }
  }

  fun_One_Post_Head_Clicked = () =>{
    
  }

  fun_One_Post_Result_Clicked = () =>{
    //
    this.pyfun()
  }

  fun_One_Post_Can_Edit_Changed = (checked) => {
    this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
      one_Post_Can_Edit: checked
    }),()=> {
    
    })
  };

  fun_One_Post_Show_Color_Changed = (checked) => {
    this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
      one_Post_Show_Color: checked
    }),()=> {
    
    })
  };

  fun_One_Post_DianZan_Clicked = (checked) => {
    //  

  }

  fun_One_Post_ShouCang_Clicked = (checked) => {
    // 
  }

  fun_One_Post_ZhuanFa_Clicked = (checked) => {
    //  
  }

  fun_One_Post_JuBao_Clicked = (checked) => {
    
  }

  render() {
    const {isOpen, currentPostID} = this.props
    return (
      ( isOpen &&
        <div className="modal" onClick={this.handleBackgroundClick}>
          <OnePost currentPostID={currentPostID} enter={this.props.enter} selfAvatar={this.props.selfAvatar} currentUser={this.props.currentUser} Main_Style={{position:'relative',left:'0px',top:'0px'}} YiDianZan={false} YiGuanZhu={false} YiZhuanFa={false} YiShouCang={false} YiJuBao={false} DianZan_Clicked={this.fun_One_Post_DianZan_Clicked} GuanZhu_Clicked={null} ShouCang_Clicked={this.fun_One_Post_ShouCang_Clicked} JuBao_Clicked={this.fun_One_Post_JuBao_Clicked} ZhuanFa_Clicked={this.fun_One_Post_ZhuanFa_Clicked} Show_Color_Changed={this.fun_One_Post_Show_Color_Changed} Can_Edit_Changed={this.fun_One_Post_Can_Edit_Changed} Result_Picture_Clicked={this.fun_One_Post_Result_Clicked} Head_Structure_Clicked={this.fun_One_Post_Head_Clicked}/>
        </div>
      )
    );
  }
}

export default Modal;