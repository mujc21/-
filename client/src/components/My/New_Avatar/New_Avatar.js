import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './New_Avatar.css'

export default class NewAvatar extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        self_info: PropTypes.object,
        onClose: PropTypes.func,
        fun_Avatar_Changed: PropTypes.func,
    }

    static defaultProps = {
        self_info: null,
        onClose: null,
        fun_Avatar_Changed: null, 
    }

    fileInputRef = React.createRef()

    handleBackgroundClick = (event) =>{
        if (event.target.classList.contains('modal1')){
            this.props.onClose();
        }
    }

    handleChangeAvatar = (event) =>{

        const selectedFile = event.target.files[0];
        if (selectedFile){
            const fileUrl = URL.createObjectURL(selectedFile)
            this.props.fun_Avatar_Changed(fileUrl);
        }
    }

    handleButtonClick = (event) =>{
        this.fileInputRef.current.click()
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        const { isOpen} = this.props;
        return(
            isOpen && (
                <div className="modal1" onClick={this.handleBackgroundClick}>
                  <div className="modal-content1">
                      <div class="zgw_change_avatar">
                        <div class="full_avatar" style={{backgroundImage: `url(${this.props.self_info.avatar})`, backgroundSize: 'cover'}}/>
                        <input type="file" accept='image/*' onChange={this.handleChangeAvatar} style={{display: 'none'}} ref={this.fileInputRef}/>
                        <button class="change_avatar_button" onClick={this.handleButtonClick}>更换头像</button>
                        <button class="save_avatar_button">保存到相册</button>
                      </div>
                  </div>
                </div>
            )
        ) 
    }
}
