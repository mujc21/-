import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './One_Post.css'
import axios from 'axios'

import PictureLabel from '../Picture_Label/Picture_Label'
import { Switch } from 'antd'
import { Avatar, Button, List, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';

export default class OnePost extends Component {

    inputRef = React.createRef()

    state={
        yiDianZan: false,
        yiGuanZhu: this.props.YiGuanZhu,
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
        id_array: [],
        Head_Structure_Url: "",
        Result_Picture_Url: "",
        text: "",
        author_name: "",
        editable: true,
        I_post: false,
        count: 0,
        showLoadMore: true,
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
	        height: '260px',
	        width: '390px',
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
                this.setState({ text: info.post_text, author_name: info.author_name, editable: info.can_edit })
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
      
    //   fetch(fakeDataUrl)
    //     .then((res) => res.json())
    //     .then((res) => {
    //       const newData = this.state.data.concat(res.results);
    //       this.setState({data: newData, list: newData, loading: false})
    //       window.dispatchEvent(new Event('resize'));
    //     });

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
      if(this.state.yiShouCang===false){
          var temp=document.getElementById("picture_ShouCang")
          temp.style.backgroundImage="url('/picture/yishoucang.png')"
          this.setState({yiShouCang:true})
      }
      else{
          var temp=document.getElementById("picture_ShouCang")
          temp.style.backgroundImage="url('/picture/shoucang.jpeg')"
          this.setState({yiShouCang:false})
      }
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
      if(this.state.yiDianZan===false){
        var temp=document.getElementById("picture_DianZan")
        temp.style.backgroundImage="url('/picture/yidianzan.png')"
        this.setState({yiDianZan:true})
      }
      else{
        var temp=document.getElementById("picture_DianZan")
        temp.style.backgroundImage="url('/picture/dianzan.png')"
        this.setState({yiDianZan:false})
      }
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
                  return
              }
              else{
                  alert("收藏各种失败了")
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

    zhuanFa_Clicked = ()=>{
      this.handleTransmitClicked(this.props.currentPostID, this.props.currentUser)
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
        temp_Head_Structure_Style['backgroundImage']="url("+this.state.Head_Structure_Url+")"
        temp_Result_Picture_Style['backgroundImage']="url("+this.state.Result_Picture_Url+")"


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
            <PictureLabel Picture_Label_Style={temp_Head_Structure_Style} Picture_Label_Clicked={this.props.Head_Structure_Clicked}/>

            <div style={{position: 'relative', left: '625px', top: '310px', height: '0px'}}>
                {/* <Switch defaultChecked  onClick={this.props.Can_Edit_Changed}/>
                <h4 style={{position: 'relative', left: '70px',top: '-45px'}}>可编辑</h4> */}
                {this.state.editable
                ?
                <Button style={{position: 'relative', left: '24px', top: '-120px',}}>保存模型</Button>
                :
                <Tooltip title="该模型不可保存">
                    <Button style={{position: 'relative', left: '24px', top: '-120px',}} disabled>保存模型</Button>
                </Tooltip>}
                {/* <Switch defaultChecked  onClick={this.props.Show_Color_Changed}/>
                <h4 style={{position: 'relative', left: '70px',top: '-45px'}}>显示颜色</h4> */}

                <div id="picture_DianZan" style={DianZan_Style} onClick={()=>this.dianZan_Clicked()}></div>
                <div id="picture_ShouCang" style={ShouCang_Style} onClick={()=>this.shouCang_Clicked()}></div>
                <div id="picture_ZhuanFa" style={ZhuanFa_Style} onClick={()=>this.zhuanFa_Clicked()}></div>
                {/* <div id="picture_JuBao" style={JuBao_Style} onClick={()=>juBao_Clicked()}></div> */}
            </div>

            <h2 class="fny_username_in_one_post">{this.state.author_name}</h2>
            <p class="fny_text_in_one_post">{this.state.text}</p>

            <PictureLabel Picture_Label_Style={temp_Result_Picture_Style} Picture_Label_Clicked={this.props.Result_Picture_Clicked}/>
            <div style={{position: 'relative', left: '8%', width:'84%', height: '0px'}}>
              <h2 style={{marginTop: '-10px', marginBottom: '-2px', color: 'rgb(64, 64, 128)'}}>评论</h2>
              <div>
                <List
                loading={this.state.initLoading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={this.state.list}
                renderItem={(item) => (
                    <List.Item>
                        <div style={{display: 'flex'}}>
                        <Avatar src={`${item.avatar}`} style={{ height: '50px', width: '50px'}}/>
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
        </div>
    }
}
