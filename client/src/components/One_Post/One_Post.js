import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './One_Post.css'
import axios from 'axios'
import { Link } from 'react-router-dom'

import PictureLabel from '../Picture_Label/Picture_Label'
import { Switch, Spin, Avatar, Button, List, Tooltip, ConfigProvider, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import PostReminder from '../post/Post_Reminder/Post_Reminder'
import PreviewInstructions from '../Preview_Instructions/Preview_Instructions'

export default class OnePost extends Component {

  inputRef = React.createRef()

  state={
      startLoading: true,
      yiDianZan: false,
      yiGuanZhu: true,
      yiZhuanFa: this.props.YiZhuanFa,
      yiShouCang: this.props.YiShouCang,
      yiJuBao: this.props.YiJuBao,
      initLoading: true,
      loading: false,
      inputValue: '',
      temp_avatar_list: [],
      temp_username_list: [],
      temp_comment_content_list: [],
      data: [],
      list: [],
      model_id: null,
      id_array: [],
      Head_Structure_Url: "",
      Result_Picture_Url: "",
      text: "",
      author_name: "",
      editable: false,
      I_post: true,
      count: 0,
      showLoadMore: true,
      isPostReminderOpen: false,
      success: true,
      reminder: '',
      isLoading: false,
      loadingTip: '',
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
        left: '55px',
        top: '35px',
        height: '70px',
        width: '70px',
        borderRadius: '35px',
      },

      Head_Structure_Url: 'head_structure.jpeg',
      User_Name: "anonymous",
      Result_Picture_Style: {
        position: 'relative',
        marginTop: '-50px',
        left: '140px',
        maxHeight: '320px',
        width: '380px',
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

  handlePostcontentAvatar = async (postid) => {
      const myurl = "/api/postcontentavatar/" + postid;
      try{
        await axios.get(myurl,{
          responseType: 'arraybuffer'
      })
        .then(res=>{
          if(res.data === "数据库查询失败"){
            alert("404 handlePostcontentAvatar响应失败")
            return
          }
          else if(res.data === "该帖子不存在"){
            alert("404 handlePostcontentAvatar响应失败")
            return
          }
          else{
              const blob = new Blob([res.data], { type: 'application/octet-stream' })
              const url = URL.createObjectURL(blob)
              this.setState({Head_Structure_Url: url})
          }
        })
        .catch(e=>{
          alert("404 handlePostcontentAvatar响应失败")
          return
        })
      }
      catch{
          alert("404 handlePostcontentAvatar响应失败")
          return
      }
  };

  handlePostcontentPicture = async (postid) => {
      const myurl = "/api/postcontentpicture/" + postid;
      try{
        await axios.get(myurl,{
          responseType: 'arraybuffer'
      })
        .then(res=>{
          if(res.data === "数据库查询失败"){
            alert("404 handlePostcontentPicture响应失败")
            return
          }
          else if(res.data === "该帖子不存在"){
            alert("404 handlePostcontentPicture响应失败")
            return
          }
          else{
              const blob = new Blob([res.data], { type: 'application/octet-stream' })
              const url = URL.createObjectURL(blob)
              this.setState({Result_Picture_Url: url})
              this.setState({startLoading: false})
          }
        })
        .catch(e=>{
          alert("404 handlePostcontentPicture响应失败")
          return
        })
      }
      catch{
          alert("404 handlePostcontentPicture响应失败")
          return
      }
  };

  handlePostcontentString = async (postid) => {
      const myurl = "/api/postcontentstring/" + postid;
      try{
        await axios.get(myurl)
        .then(res=>{
          if(res.data === "数据库查询失败"){
            alert("404 handlePostcontentString响应失败")
            return
          }
          else if(res.data === "该帖子不存在"){
            alert("404 handlePostcontentString响应失败")
            return
          }
          else{
              const info = res.data;
              this.setState({ text: info.post_text, author_name: info.author_name, editable: info.can_edit, model_id: info.model_id })
          }
        })
        .catch(e=>{
          alert("404 handlePostcontentString响应失败")
          return
        })
      }
      catch{
          alert("404 handlePostcontentString响应失败")
          return
      }
  };

  handlePostcontentWhetherIpost = async (postid, myname) => {
      const myurl = "/api/postcontentwhetherIpost/" + postid + "/" + myname;
      try{
        await axios.get(myurl)
        .then(res=>{
          if(res.data === "数据库查询失败"){
            alert("404 handlePostcontentWhetherIpost响应失败")
            return
          }
          else if(res.data === "该帖子不存在"){
            alert("404 handlePostcontentWhetherIpost响应失败")
            return
          }
          else{
              const info = res.data;
              this.setState({ I_post: info.whether_I_post })
          }
        })
        .catch(e=>{
          alert("404 handlePostcontentWhetherIpost响应失败")
          return
        })
      }
      catch{
          alert("404 handlePostcontentWhetherIpost响应失败")
          return
      }
  };

  handlePostcontentWhetherLike = async (postid, myname) => {
      const myurl = "/api/postcontentwhetherlike/" + postid + "/" + myname;
      try{
        await axios.get(myurl)
        .then(res=>{
          if(res.data === "数据库查询失败"){
            alert("404  handlePostcontentWhetherLike响应失败")
            return
          }
          else if(res.data === "该帖子不存在"){
            alert("404  handlePostcontentWhetherLike响应失败")
            return
          }
          else{
              const info = res.data;
              if(info.whether_like){
                  this.enter_dianZan_Clicked()
              }
          }
        })
        .catch(e=>{
          alert("404  handlePostcontentWhetherLike响应失败")
          return
        })
      }
      catch{
          alert("404  handlePostcontentWhetherLike响应失败")
          return
      }
  };

  handlePostcontentWhetherStore = async (postid, myname) => {
      const myurl = "/api/postcontentwhetherstore/" + postid + "/" + myname;
      try{
        await axios.get(myurl)
        .then(res=>{
          if(res.data === "数据库查询失败"){
            alert("404 handlePostcontentWhetherStore响应失败")
            return
          }
          else if(res.data === "该帖子不存在"){
            alert("404 handlePostcontentWhetherStore响应失败")
            return
          }
          else{
              if(res.data.whether_store){
                this.enter_shouCang_Clicked()
              }
          }
        })
        .catch(e=>{
          alert("404 handlePostcontentWhetherStore响应失败")
          return
        })
      }
      catch{
          alert("404 handlePostcontentWhetherStore响应失败")
          return
      }
  };

  handlePostcontentWhetherAttention = async (postid, myname) => {
    const myurl = "/api/postcontentwhetherattention/" + postid + "/" + myname;
    try{
      await axios.get(myurl)
      .then(res=>{
        if(res.data === "数据库查询失败"){
          alert("404 handlePostcontentWhetherAttention响应失败")
          return
        }
        else if(res.data === "该帖子不存在"){
          alert("404 handlePostcontentWhetherAttention响应失败")
          return
        }
        else{
            if(!res.data.whether_attention){
              this.enter_guanZhu_Clicked()
            }
        }
      })
      .catch(e=>{
        alert("404 handlePostcontentWhetherAttention响应失败")
        return
      })
    }
    catch{
        alert("404 handlePostcontentWhetherAttention响应失败")
        return
    }
  };

  handleInitialPostComments = async (postid) => {
      const id_array = await this.handleCommentsIDArray(postid);
      if(id_array !== null){
          if(id_array.length - this.state.count * 3 <= 3){
              this.setState({showLoadMore: false})
          }
          this.setState({id_array: id_array})
          if(id_array.length > 0){
              for (let i = id_array.length - 1; i >= Math.max(0, id_array.length - 3); i--){
                  const avatar = await this.handleCorrespondingCommentsAvatar(postid, id_array[i]);
                  const commentInfo = await this.handleCorrespondingCommentsString(postid, id_array[i]);
                  const newData = this.state.data.concat({ loading: false, username: commentInfo.username, comment: commentInfo.comment_text, avatar: avatar});
                  this.setState({data: newData, list: newData})
                  if( i === Math.max(0, id_array.length - 3)){
                      this.setState({loading: false})
                      window.dispatchEvent(new Event('resize'));
                  }
              }
          }
      }
      this.setState({initLoading: false})
  }

  handleCorrespondingCommentsAvatar = async (postid, ordinal) => {
      const myurl = "/api/postcontentcommentavatar/" + postid + "/" + ordinal;
      return new Promise((resolve, reject) =>{
          axios.get(myurl,{
              responseType: 'arraybuffer'
          })
          .then(res=>{
              if(res.data === "数据库查询失败"){
                  alert("404 handleCorrespondingCommentsAvatar响应失败")
                  resolve(null)
              }
                  else if(res.data === "该帖子不存在"){
                  alert("404 handleCorrespondingCommentsAvatar响应失败")
                  resolve(null)
              }
              else{
                  const blob = new Blob([res.data], { type: 'application/octet-stream' })
                  const url = URL.createObjectURL(blob)
                  resolve(url)
              }
          })
      })
  }

  handleCorrespondingCommentsString = async (postid, ordinal) => {
      const myurl = "/api/postcontentcommentstring/" + postid + "/" + ordinal;
      return new Promise((resolve, reject) =>{
          axios.get(myurl)
          .then(res=>{
              if(res.data === "数据库查询失败"){
                  alert("404 handleCorrespondingCommentsAvatar响应失败")
                  resolve(null)
              }
              else if(res.data === "该帖子不存在"){
                  alert("404 handleCorrespondingCommentsAvatar响应失败")
                  resolve(null)
              }
              else{
                  resolve({
                      comment_text: res.data.comment_text,
                      username: res.data.username,
                  })
              }
          })
          .catch(e=>{
              alert("404 handleCorrespondingCommentsAvatar响应失败")
              resolve(null)
          })
      })
  }

  handleCommentsIDArray = async (postid) => {
      const myurl = "/api/postcontentcommentnumber/" + postid;
      return new Promise((resolve, reject) => {
          axios.get(myurl)
          .then(res=>{
            if(res.data === "数据库查询失败"){
              alert("404 handlePostCommentsID响应失败")
              resolve(null)
            }
            else if(res.data === "该帖子不存在"){
              alert("404 handlePostCommentsID响应失败")
              resolve(null)
            }
            else{
              resolve(res.data.id_array)
            }
          })
          .catch(e=>{
            alert("404 handlePostCommentsID响应失败")
            resolve(null)
          })
      });
  }

  handlePostcontent(postid, username){
      this.handlePostcontentAvatar(postid)
      this.handlePostcontentPicture(postid)
      this.handlePostcontentString(postid)
      this.handlePostcontentWhetherIpost(postid, username)
      this.handlePostcontentWhetherLike(postid, username)
      this.handlePostcontentWhetherStore(postid, username)
      this.handlePostcontentWhetherAttention(postid, username)
  }

  componentDidMount() {
      this.handlePostcontent(this.props.currentPostID, this.props.currentUser)
      this.handleInitialPostComments(this.props.currentPostID)
  }

  handleChange = (e) =>{
    this.setState({inputValue: e.target.value})
  }

  handlePostComment = async (comment_text, postid, username) => {
    const our_url = "/api/postcomment";
    try{
        await axios.post(our_url,{comment_text, postid, username})
        .then(res=>{
            if(res.data === "数据库发评论失败"){
                alert("数据库发评论失败")
                return 0
            }
            else if(res.data === "发评论成功"){
                return 1
            }
        })
        .catch(e=>{
            alert("404 响应失败")
            return 0
        })
    }
    catch{
        alert("404 响应失败")
        return 0
    }
  };

  send = (e) =>{
    if (this.state.inputValue !== ''){
      const success = this.handlePostComment(this.state.inputValue, this.props.currentPostID, this.props.currentUser)
      if(success){
        const newData = [{ loading: false, username: this.props.currentUser, avatar: this.props.selfAvatar, comment: this.state.inputValue}].concat(this.state.data);
        this.setState({data: newData, list: newData, loading: false})
        this.setState({inputValue: ''})
      }
    }
      e.preventDefault()
      e.stopPropagation()      
  }

  onLoadMore = async () => {
      this.setState({loading: true, 
          list: this.state.data.concat(
              [...new Array(3)].map(() => ({
              loading: true,
              username: '',
              avatar: '',
              comment: '',
              })),
          ),})
      
      const id_array = this.state.id_array

      const remain = id_array.length - this.state.count * 3 - 3
      for (let i = remain - 1; i >= Math.max(0, remain - 3); i--){
          const avatar = await this.handleCorrespondingCommentsAvatar(this.props.currentPostID, id_array[i]);
          const commentInfo = await this.handleCorrespondingCommentsString(this.props.currentPostID, id_array[i]);
          const newData = this.state.data.concat({ loading: false, username: commentInfo.username, comment: commentInfo.comment_text, avatar: avatar });
          this.setState({data: newData, list: newData})
          if( i === Math.max(0, remain - 3)){
              const newCount = this.state.count + 1;
              this.setState({count: newCount})
              this.setState({loading: false})
              window.dispatchEvent(new Event('resize'));
              if(remain - 3 <= 0){
                  this.setState({showLoadMore: false})
              }
          }
      }
  };

  handleStoreClicked = async (add_or_delete, postID, username) => {
    const our_url = "/api/fnyAddOrDeleteStore";
    try{
        await axios.post(our_url,{add_or_delete, postID, username})
        .then(res=>{
            if(res.data === "successful"){
                return 1
            }
            else{
                alert("收藏各种失败了")
                return 0
            }
        })
        .catch(e=>{
            alert("404 响应失败")
            return 0
        })
    }
    catch{
        alert("404 响应失败")
        return 0
    }
  };

  enter_shouCang_Clicked = ()=>{
    var temp=document.getElementById("picture_ShouCang")
    temp.style.backgroundImage="url('/picture/yishoucang.png')"
    this.setState({yiShouCang:true})
  }


  shouCang_Clicked = ()=>{
    if(this.state.yiShouCang===false){
      const success = this.handleStoreClicked(0, this.props.currentPostID, this.props.currentUser)
      if(success){
        var temp=document.getElementById("picture_ShouCang")
        temp.style.backgroundImage="url('/picture/yishoucang.png')"
        this.setState({yiShouCang:true})
        this.props.ShouCang_Clicked(true)
      }
    }
    else{
      const success = this.handleStoreClicked(1, this.props.currentPostID, this.props.currentUser)
      if(success){
        var temp=document.getElementById("picture_ShouCang")
        temp.style.backgroundImage="url('/picture/shoucang.jpeg')"
        this.setState({yiShouCang:false})
        this.props.ShouCang_Clicked(false)
      }
    }
  }

  handleLikeClicked = async (add_or_delete, postID, username) => {
    const our_url = "/api/fnyAddOrDeleteLike";
    try{
        await axios.post(our_url,{add_or_delete, postID, username})
        .then(res=>{
            if(res.data === "successful"){
                return 1
            }
            else{
                alert("收藏各种失败了")
                return 0
            }
        })
        .catch(e=>{
            alert("404 响应失败")
            return 0
        })
    }
    catch{
        alert("404 响应失败")
        return 0
    }
  };


  enter_dianZan_Clicked = ()=>{
    var temp=document.getElementById("picture_DianZan")
    temp.style.backgroundImage="url('/picture/yidianzan.png')"
    this.setState({yiDianZan:true})
  }

  dianZan_Clicked = ()=>{
    if(this.state.yiDianZan===false){
        const success = this.handleLikeClicked(0, this.props.currentPostID, this.props.currentUser)
        if(success){
          var temp=document.getElementById("picture_DianZan")
          temp.style.backgroundImage="url('/picture/yidianzan.png')"
          this.setState({yiDianZan:true})
          this.props.DianZan_Clicked(true)
        }
    }
    else{
        const success = this.handleLikeClicked(1, this.props.currentPostID, this.props.currentUser)
        if(success){
          var temp=document.getElementById("picture_DianZan")
          temp.style.backgroundImage="url('/picture/dianzan.png')"
          this.setState({yiDianZan:false})
          this.props.DianZan_Clicked(false)
        }
    }
  }

  handleTransmitClicked = async (postID, username) => {
    const our_url = "/api/fnyTransmit";
    try{
        await axios.post(our_url,{postID, username})
        .then(res=>{
            if(res.data === "successful"){
              this.setState({success: true})
              return
            }
            else{
                alert("转发各种失败了")
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
    finally{
      if(this.state.success){
        this.openSuccessNotification("转发成功!")
      }
      else{
        this.openFailureNotification("转发失败，请重试")
      }
    }
  };

  zhuanFa_Clicked = ()=>{
    this.handleTransmitClicked(this.props.currentPostID, this.props.currentUser)
  }

  enter_guanZhu_Clicked = ()=>{
    this.setState({yiGuanZhu: false})
  }

  handleGuanzhuClicked = ()=>{
    if(this.state.yiGuanZhu===false){
      const success = this.handleAttention(0, this.props.currentPostID, this.props.currentUser)
      if(success){
        this.setState({yiGuanZhu:true})
      }
    }
    else{
      const success = this.handleAttention(1, this.props.currentPostID, this.props.currentUser)
      if(success){
        this.setState({yiGuanZhu:false})
      }
    }
  }

  handleAttention = async (add_or_delete, postID, username) => {
    const our_url = "/api/fnyAttention";
    try{
        await axios.post(our_url,{add_or_delete, postID, username})
        .then(res=>{
            if(res.data === "successful"){
                return 1
            }
            else{
                alert("关注各种失败了")
                return 0
            }
        })
        .catch(e=>{
            alert("404 响应失败")
            return 0
        })
    }
    catch{
        alert("404 响应失败")
        return 0
    }
  };

  handleAddToPrivateModel = async (username, model_id) => {
    if(model_id !== null){
      try{
        await axios.post("/api/fnyAddToPrivateModel",{
          username,model_id
        })
        .then(res=>{
          if(res.data === "error when finding user"){
            alert("错误：找不到用户")
            return
          }
          else if(res.data === "user not found"){
            alert("用户不存在")
            return
          }
          else if(res.data === "insert error"){
            alert("添加模型到私有库失败")
            return
          }
          else if(res.data === "successful"){
            this.setState({success: true})
            return
          }
        })
        .catch(e=>{
          alert("404 AddToPrivateModel响应失败: " + e.message);
        })
      }
      catch{
        
      }
      finally{
        if(this.state.success){
          this.openSuccessNotification('保存成功！')
        }
        else{
          this.openFailureNotification('保存失败，请重试')
        }
      }
    }
  };

  
  openPostReminder = () => {
    this.setState({ isPostReminderOpen: true });
    document.body.style.overflow = 'hidden'; // 防止背景滚动
  };

  closePostReminderConfirm = () => {
    this.setState({ isPostReminderOpen: false, success: false });
    document.body.style.overflow = 'auto'; // 恢复背景滚动
  }

  loadModel = async () => {
    this.openNotification('正在获取点云文件')
    document.body.style.overflow = 'hidden'; 
    const arrayString = await this.handleGetFileOfOneModel(this.state.model_id, 0);
    //fny_todo
    this.pyfun5(arrayString)
  }

  openNotification = (reminder) => {
    const key = reminder;
    notification.info({
      message: reminder,
      description: '请耐心等待...',
      key,
      placement: 'bottomRight',
      duration: null,
    });
  }

  openSuccessNotification = (reminder) => {
    const key = reminder;
    notification.success({
      message: reminder,
      key,
      placement: 'topRight',
    });
  }

  openFailureNotification = (reminder) => {
    const key = reminder;
    notification.error({
      message: reminder,
      key,
      placement: 'topRight',
    });
  }

  handleGetFileOfOneModel = (modelID, identifier) => {  //返回值为模型的路径
    const our_url = "/api/fnyGetFileOfOneModel/" + modelID;
  
    return new Promise((resolve, reject) => {
        axios.post(our_url)
        .then(res => {
            if (res.data.text === "unexpected error") {  //出错
                alert("数据库查询失败");
                resolve('');
            }
            else if (res.data.text === "model not exist") {  //出错
              alert("未找到指定模型");
              resolve('');
            }
            else if (res.data.text === "unexpected error in python") {  //出错
              alert("服务器模型加载出错");
              resolve('');
            }
            else if(res.data.text === 'successful'){
              resolve(res.data.model_path);
            }
        })
        .catch(e => {
            alert("404 GetFileOfOneModel响应失败: " + e.message);
            resolve('');
        })
    });
  };

  openNotificationFinishDownload = () => {
    notification.success({
      message: '成功下载点云文件',
      description: '模型即将显现...',
      placement: 'bottomRight',
    });
  }

  pyfun5(model_path){
    const { spawn } = window.require('child_process');
    return new Promise((resolve, reject) => {
      //参数先usecolor,再canedit
      const process1 = spawn('python3.8', ['./download_from_server.py',model_path],{ stdio: 'pipe' });
      process1.stderr.on('data',(data)=>{
        console.log("python stderr: "+data);
        // alert("python stderr: "+data);
      })
      process1.on('close',(code)=>{
        setTimeout(() => {notification.destroy('正在获取点云文件')}, 500)
        setTimeout(() => {this.openNotificationFinishDownload()}, 1000)
        this.setState({isPreviewIntructionsOpen: true})
        const process = spawn('python3.8', ['./view_scene.py',model_path,'true','true'],{ stdio: 'pipe' });
        process.stderr.on('data',(data)=>{
          console.log("python stderr: "+data);
          // alert("python stderr: "+data);
        })
        process.on('close',(code)=>{
          console.log("python quit with code: "+code);
          this.setState({isPreviewIntructionsOpen: false})
        })
      })
    });
  }

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        let temp_Head_Structure_Style={}
        let temp_Result_Picture_Style={
          position: 'relative',
          marginTop: '-50px',
          left: '140px',
          height: '300px',
          maxWidth: '400px',
          cursor: 'pointer'
        }


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
            cursor: 'pointer'
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
            cursor: 'pointer'
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
            cursor: 'pointer'
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

        if(this.props.YiGuanZhu){
            this.setState({yiShouCang: true})
        }
        else{
        }

        const loadMore =
        !this.state.initLoading && !this.state.loading ? (
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              height: 32,
              lineHeight: '32px',
            }}
          >
            {this.state.showLoadMore ? <Button onClick={() => this.onLoadMore()} style={{marginBottom: '15px'}}>加载更多</Button> : <></>}
          </div>
        ) : null;


        return <div style={this.props.Main_Style} class="fny_top">
           <div class="fny_one_post">

           <Link to={`/My/users/${this.state.author_name}`}><img src={this.state.Head_Structure_Url} style={this.props.Head_Structure_Style}/></Link>
           {/* {this.state.startLoading ? <img src={'picture/white.jpeg'} style={this.props.Head_Structure_Style} onClick={this.props.Head_Structure_Clicked}/> : <Link to={`/My/users/${this.state.author_name}`}><img src={this.state.Head_Structure_Url} style={this.props.Head_Structure_Style}/></Link>} */}

            <div style={{position: 'relative', left: '625px', top: '310px', height: '0px'}}>
                {/* <Switch defaultChecked  onClick={this.props.Can_Edit_Changed}/>
                <h4 style={{position: 'relative', left: '70px',top: '-45px'}}>可编辑</h4> */}
                {this.state.editable
                ?
                <Button style={{position: 'relative', left: '24px', top: '-240px',}} type="primary" onClick={() => this.handleAddToPrivateModel(this.props.currentUser, this.state.model_id)}>保存模型</Button>
                :
                <Tooltip title="该模型不可保存">
                    <Button style={{position: 'relative', left: '24px', top: '-240px',}} disabled>保存模型</Button>
                </Tooltip>}

                { !this.state.I_post && this.state.yiGuanZhu &&
                  <ConfigProvider autoInsertSpaceInButton={false}> 
                    <Button style={{position: 'relative', left: '-280px', top: '-340px', width: '80px', fontWeight: '500', cursor: 'pointer'}} onClick={() => this.handleGuanzhuClicked()}>已关注</Button>
                </ConfigProvider>
                }

                { !this.state.I_post && !this.state.yiGuanZhu &&
                  <ConfigProvider autoInsertSpaceInButton={false}> 
                    <Button style={{position: 'relative', left: '-280px', top: '-340px', width: '60px', fontWeight: '500', color :'white', backgroundColor: 'rgb(232, 37, 30)', cursor: 'pointer'}} onClick={() => this.handleGuanzhuClicked()}>关注</Button>
                  </ConfigProvider>
                }

                <div id="picture_DianZan" style={DianZan_Style} onClick={()=>this.dianZan_Clicked()}></div>
                <div id="picture_ShouCang" style={ShouCang_Style} onClick={()=>this.shouCang_Clicked()}></div>
                <div id="picture_ZhuanFa" style={ZhuanFa_Style} onClick={()=>this.zhuanFa_Clicked()}></div>
                {/* <div id="picture_JuBao" style={JuBao_Style} onClick={()=>juBao_Clicked()}></div> */}
            </div>

            <h2 class="fny_username_in_post">{this.state.author_name}</h2>
            <p class="fny_text_in_one_post">{this.state.text}</p>

            {this.state.startLoading ? <img src={'picture/white.jpeg'} style={temp_Result_Picture_Style}/> : <img src={this.state.Result_Picture_Url} style={temp_Result_Picture_Style} onClick={() => this.loadModel()}/>}
            <div style={{position: 'relative', left: '8%', width:'84%', height: '0px'}}>
              <h2 style={{marginTop: '10px', marginBottom: '-2px', color: 'rgb(64, 64, 128)'}}>评论</h2>
              <div>
                <List
                loading={this.state.initLoading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={this.state.list}
                renderItem={(item) => (
                    <List.Item>
                        <div style={{display: 'flex'}}>
                        <Link to={`/My/users/${item.username}`}><Avatar src={`${item.avatar}`} style={{ height: '50px', width: '50px'}}/></Link>
                        <div style={{marginLeft: '15px', marginTop: '-5px', maxWidth: '600px'}}>
                            <h3 style={{ marginTop: '5px' }}>{item.username}</h3>
                            <p style={{ marginTop: '-12px', marginBottom: '-5px', wordWrap: 'break-word'}}>{item.comment}</p>
                        </div>
                        </div>
                    </List.Item>
                )}
                />
              </div>
            </div>
        </div>
        <div>
            <TextArea style={{ position: 'absolute', height: '100px', bottom: '0px', borderRadius:'0px', borderTopWidth:'1.5px', borderLeftWidth:'0px',borderRightWidth:'0px', borderColor: 'darkgray', backgroundColor: 'rgb(238, 238, 238)'}} placeholder='请输入...' ref={this.inputRef} value={this.state.inputValue} onPressEnter={this.send} onChange={this.handleChange}/>
        </div>
        <PreviewInstructions isOpen={this.state.isPreviewIntructionsOpen}/>
        </div>
    }
}
