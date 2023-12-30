import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
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
        if (event.target.classList.contains('modal2')){
            this.props.onClose();
        }
    }

    compressImage = (file, maxKB) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
      
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
      
            // Set the initial quality
            let currentQuality = 0.7;
      
            // Function to check if compressed image meets size criteria
            const checkSize = (quality) => {
              return new Promise((resolveCheck) => {
                // Resize the canvas to the image dimensions
                canvas.width = img.width;
                canvas.height = img.height;
      
                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0);
      
                // Convert canvas to Blob
                canvas.toBlob((blob) => {
                  const sizeInKB = blob.size / 1024;
                  resolveCheck({ blob, sizeInKB });
                }, 'image/jpeg', quality);
              });
            };
      
            // Use a recursive function to iteratively adjust quality
            const compressWithQuality = async () => {
              const { blob, sizeInKB } = await checkSize(currentQuality);
      
              if (sizeInKB > maxKB && currentQuality > 0.1) {
                // If size exceeds maxKB and quality is not too low, reduce quality and retry
                currentQuality -= 0.1;
                await compressWithQuality();
              } else {
                // If size is within the limit or quality is too low, create a new File object
                const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
      
                // Resolve the Promise with the compressed file
                resolve(compressedFile);
              }
            };
      
            // Start the compression process
            compressWithQuality();
          };
        });
      };

    handleAvatarForServer = async (selectedFile) => {
        const username = this.props.currentUser
        const formData = new FormData()
        formData.append('username', username);
        formData.append('avatar', selectedFile);
        const our_url = "/api/change-avatar/" + username;
        try{
            await axios.post(our_url,formData)
            .then(res=>{
                if(res.data === "数据库头像路径更新失败"){
                    alert("数据库头像路径更新失败")
                    return 
                }
                else if(res.data === "修改头像成功"){
                    return
                }
            })
            .catch(e=>{
                alert("404 响应失败")
                return 
            })
        }
        catch{
            alert("404 响应失败")
            return 
        }
    };

    handleChangeAvatar = (event) =>{
        const selectedFile = event.target.files[0];
        if (selectedFile){ 
            this.compressImage(selectedFile, 200) // specify your maxKB
            .then((compressedFile) => {
                const fileUrl = URL.createObjectURL(compressedFile)
                this.props.fun_Avatar_Changed(fileUrl)
                this.props.fun_Set_Current_Avatar(fileUrl)
                // 存储头像到后端
                this.handleAvatarForServer(compressedFile)  
            })
            .catch((error) => {
                alert("图片压缩失败")
                return
            });
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
                <div className="modal2" onClick={this.handleBackgroundClick}>
                  <div className="modal-content1">
                      <div class="zgw_change_avatar">
                        <div class="full_avatar" style={{backgroundImage: `url(${this.props.self_info.avatar})`, backgroundSize: 'cover'}}/>
                        <input type="file" accept='image/*' onChange={this.handleChangeAvatar} style={{display: 'none'}} ref={this.fileInputRef}/>
                        <button class="change_avatar_button" onClick={this.handleButtonClick}>更换头像</button>
                        {/* <button class="save_avatar_button">保存到相册</button> */}
                      </div>
                  </div>
                </div>
            )
        ) 
    }
}
