import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import './Post_To_Release.css'

import GreenButton from '../Button/Green_Button'
import BlueButton from '../Button/Blue_Button'
import RedButton from '../Button/Red_Button'
import InputBox from '../Input_Label/Input_Box'
import { Switch, List, Checkbox, Button, ConfigProvider, Spin, notification, Result } from 'antd'
import  TextArea from 'antd/es/input/TextArea'
import PostReminder from './Post_Reminder/Post_Reminder'
import PreviewInstructions from '../Preview_Instructions/Preview_Instructions'

export default class PostToRelease extends Component {

    inputRef = React.createRef()

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
            left: '55px',
            top: '35px',
            height: '80px',
            width: '80px',
            borderRadius: '40px'
        },

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
          position: 'absolute',
	        left: '160px',
	        top: '240px',
	        maxHeight: '240px',
	        maxWidth: '360px',
        },

        Blue_Button_Text: "组合新点云",
        Blue_Button_Style: {
          position: 'relative',
          top: '-170px',
          left: '290px',
	        height: '40px',
	        width: '120px',
	        borderRadius: '8px',
	        fontSize: '18px',
        },
        Blue_Button_Clicked: null,

        Red_Button_Text: "取消",
        Red_Button_Style: {
            position: 'absolute',
            left: '60%',
            top: '85%',
            fontSize: '24px',
            height: '50px',
            width: '150px',
            borderRadius: '25px',
        },
        Red_Button_Clicked: null,

        Green_Button_Text: "发表",
        Green_Button_Style: {
            position: 'absolute',
            left: '20%',
            top: '85%',
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

    state = {
        showMaterials: false,
        My_Materials_List: [],
        private_model_list: [],
        selectedItemId: null,
        Result_Picture_Url: "/picture/result_image.jpg",
        firstEnter: true,
        inputValue: '',
        can_edit: true,
        isPostReminderOpen: false,
        isLoading: false,
        loadingTip: '',
        clickedOK: false,
        success: false,
    }

    //发帖
    handleReleasePost = async (username, modelID, text, canEdit) => {  //返回值为其预览图的路径
      if(modelID !== null){
        try{
          await axios.post("/api/fnyReleasePost",{
            username, modelID, text, canEdit
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
            else if(res.data === "error when finding model"){
              alert("错误：查找模型失败")
              return
            }
            else if(res.data === "unexpected error"){
              alert("发帖失败，请重试")
              return
            }
            else if(res.data === "successful"){
              this.setState({inputValue: '', selectedItemId: null, can_edit: true, success: true})
              return
            }
          })
          .catch(e=>{
            alert("404 fnyReleasePost响应失败: " + e.message);
          })
        }
        catch{
          
        }
        finally{
          this.setState({clickedOK: true})
        }
      }
    };

    handleCancel = () => {
      this.setState({inputValue: '', selectedItemId: null, can_edit: true })
    }

    Input_Box_String_Changed = async() => {

    }

    showMaterialsOperations = async() => {
        try{
          await this.handleGetUserModels(this.props.currentUser)
          return
        }
        catch (error) {
          console.error('Error:', error)
          alert('404 addUpdateOperation响应失败')
          return       
        }
    }

    handleGetUserModels = async (username) => {
        let model_list = null
        try{
          await axios.post("/api/fnyGetUserModel",{  //注意修改这个post路径，改完告我一声
            username
          })
          .then(res=>{
            if(res.data.text === "error when finding user"){
              alert("错误：找不到用户")
              return
            }
            else if(res.data.text === "user not found"){
              alert("用户不存在")
              return
            }
            else if(res.data.text === "error when searching models"){
              alert("错误：查询私有模型失败")
              return
            }
            else if(res.data.text === "successful"){
              model_list = res.data.model_list
            }
          })
          .catch(e=>{
            alert("404 fnyGetUserModel响应失败: " + e.message);
          })
        }
        catch{
          
        }
        finally{
          if(model_list != null){
            this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
              private_model_list: model_list
            }),()=> {
              this.handleGetPrivateModelPreviewPictures()
            })
          }
        }
      };

    handleMyCheckboxChange = (itemId) => {
        if(this.state.selectedItemId !== itemId){
            this.setState({selectedItemId: itemId})
        }
        else{
            this.setState({selectedItemId: null})
        }
    }

    handleGetPrivateModelPreviewPictures = async () => {
        try {
          for(let i = 0; i < this.state.private_model_list.length; i++){  //may have problems
            const modelPicture = await this.handleGetOneModelPreviewPicture(this.state.private_model_list[i])
            this.setState((prevState) => {
              let newItems = [...prevState.My_Materials_List, {id: this.state.private_model_list[i], pic: modelPicture, like: 0, added: 0, text: ''}]
              this.setState({My_Materials_List: newItems})
            })
          }
          return 
        } catch (error) {
            console.error('Error:', error)
            alert('404 handleMyPage响应失败')
            return 
        }
    }

    handleGetOneModelPreviewPicture = (modelID) => {  //返回值为其预览图的路径
        const our_url = "/api/fnyGetModelPreviewPicture/" + modelID;
      
        return new Promise((resolve, reject) => {
            axios.get(our_url, {
                responseType: 'arraybuffer'
            })
            .then(res => {
                if (res.data === "unexpected error") {  //出错
                    alert("数据库查询失败");
                    resolve('');
                }
                else if (res.data === "model not exist") {  //出错
                  alert("未找到指定模型");
                  resolve('');
                }
                else {
                    const blob = new Blob([res.data], { type: 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                }
            })
            .catch(e => {
                alert("404 GetModelPreviewPicture响应失败: " + e.message);
                resolve('');
            });
        });
    };

    Result_Picture_Clicked = () => {
        this.setState({showMaterials: true})
        this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
            My_Materials_List: []
          }),()=> {
            this.showMaterialsOperations()
          })
    }

    openPostReminder = () => {
      this.setState({ isPostReminderOpen: true });
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    };


    ConfirmSelection = (itemId) => {
        this.setState({showMaterials: false})
        this.handleGetOneModelPreviewPicture(itemId)
            .then((previewUrl) => {
                this.setState({ Result_Picture_Url: previewUrl })
                this.setState({firstEnter: false})
        })
    }

    CancelSelection = () => {
        this.setState({showMaterials: false})
        this.setState({selectedItemId: null})
    }

    handleChange = (e) =>{
      this.setState({inputValue: e.target.value})
    }

    Can_Edit_Changed = () => {
      if(this.state.can_edit){
        this.setState({can_edit: false})
      }
      else{
        this.setState({can_edit: true})
      }
    }

    loadModel = async (model_id) => {
      this.openNotification('正在获取点云文件')
      document.body.style.overflow = 'hidden'; 
      const arrayString = await this.handleGetFileOfOneModel(model_id, 0);
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
        return <div style={this.props.Main_Style} class="post">
            {/* <Spin delay={100} spinning={this.state.isLoading} tip={this.state.loadingTip} style={{backgroundColor: 'rgb(0, 0, 0, 0.6)'}} size="large" fullscreen/>  */}
            {(!this.state.showMaterials) 
              ? (this.state.clickedOK ? 
                  (this.state.success ? 
                    <div class="fny_post_to_release">
                    <Result
                      status="success"
                      title="发帖成功！"
                      // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                      extra={[
                        <Button type="primary" key="console" onClick={() => {this.setState({clickedOK: false})}}>
                          返回
                        </Button>,
                      ]}
                    /> </div>
                  : <div class="fny_post_to_release">
                  <Result
                    status="warning"
                    title="发帖失败，请重试！"
                    // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                    extra={[
                      <Button type="primary" key="console" onClick={() => {this.setState({clickedOK: false})}}>
                        返回
                      </Button>,
                    ]}
                  /> </div>)
              : 
                <div class="fny_post_to_release">
                <img src={this.props.selfAvatar} style={this.props.Head_Structure_Style}/>
            
                <h2 class="fny_username_in_one_post">{this.props.currentUser}</h2>
                <TextArea style={{position:'absolute', top: '90px', left: '180px', width: '40%', height: '12vh', borderRadius:'0px', borderWidth:'1px', borderColor: 'darkgray'}} ref={this.inputRef} value={this.state.inputValue} onChange={this.handleChange} placeholder='请输入...' />
            
                {/* <BlueButton Blue_Button_Style={this.props.Blue_Button_Style} Blue_Button_Text={this.props.Blue_Button_Text} Blue_Button_Clicked={}/> */}

                {this.state.selectedItemId === null
                ?<ConfigProvider autoInsertSpaceInButton={false}> 
                  <Button style={{position: 'absolute', left: '42%', top: '50%'}} type="primary" onClick={() => this.Result_Picture_Clicked()} size="large">选择素材</Button>
                </ConfigProvider>
                :<img src={this.state.Result_Picture_Url} style={this.props.Result_Picture_Style} onClick={() => this.Result_Picture_Clicked()}/>}            

                <GreenButton Green_Button_Style={this.props.Green_Button_Style} Green_Button_Text={this.props.Green_Button_Text} Green_Button_Clicked={() => this.handleReleasePost(this.props.currentUser, this.state.selectedItemId, this.state.inputValue, this.state.can_edit)}/>
                <RedButton Red_Button_Style={this.props.Red_Button_Style} Red_Button_Text={this.props.Red_Button_Text} Red_Button_Clicked={() => this.handleCancel()}/>

                <div style={{position: 'relative', left: '625px', top: '-20px'}}>
                    <Switch defaultChecked checked={this.state.can_edit} onClick={() => this.Can_Edit_Changed()}/>
                    <h4 style={{position: 'relative', left: '70px', top: '-45px'}}>可编辑</h4>
                </div>
                </div>)
            :
            <div class="fny_post_to_release">
                <div>
                    <List
                        class="show-materials"
                        grid={{ column: 3 }}
                        dataSource={this.state.My_Materials_List}
                        renderItem={(item) => (
                        <List.Item key={item.id} style={{ borderBottom: '1px solid rgba(2, 9, 16, 0.13)', borderRight: '1px solid rgba(2, 9, 16, 0.13)', breakInside: 'avoid'}}>
                        <div style={{ marginLeft: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ marginTop: '-5px'}}>
                            <h2>{item.text}</h2>
                            <img src={item.pic} alt="Sunset" onClick={() => this.loadModel(item.id)} style={{height: '150px', maxWidth: '200px'}} />
                        </div>
                        <div style={{ position: 'absolute', top: '10px', right: '20px'}}>
                            <Checkbox onChange={() => this.handleMyCheckboxChange(item.id)} checked={this.state.selectedItemId === item.id}/>
                        </div>
                        </div>
                        </List.Item>
                        )}>
                    </List>
                </div>
                <div style={{position: 'absolute', top: '90%', width: '100%', height: '10%'}}>
                    {this.state.selectedItemId !== null ?
                      <ConfigProvider autoInsertSpaceInButton={false}> 
                        <Button style={{position: 'absolute', left: '80%', top: '20%'}} type="primary" onClick={()=>this.ConfirmSelection(this.state.selectedItemId)}>确定</Button>
                      </ConfigProvider>
                    :
                    <ConfigProvider autoInsertSpaceInButton={false}> 
                        <Button style={{position: 'absolute', left: '80%', top: '20%'}} type="primary" disabled>确定</Button>
                    </ConfigProvider>
                    }
                    <ConfigProvider autoInsertSpaceInButton={false}> 
                        <Button style={{position: 'absolute', left: '90%', top: '20%'}} type="default" onClick={()=>this.CancelSelection()} >取消</Button>
                    </ConfigProvider>
                </div>
            </div>}
            <PreviewInstructions isOpen={this.state.isPreviewIntructionsOpen}/>
            {/* {this.state.success ? <PostReminder isOpen={this.state.isPostReminderOpen} onCloseConfirm={this.closePostReminderConfirm} Reminder="发送成功"/>
            : <PostReminder isOpen={this.state.isPostReminderOpen} onCloseConfirm={this.closePostReminderConfirm} Reminder="发送失败，请重试"/>} */}
        </div>
    }
}
