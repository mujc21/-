import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './Materials_List.css'; // 导入样式文件
import { Pagination, List, Checkbox, Button, ConfigProvider, notification, Popconfirm, FloatButton, Modal} from 'antd'
import { FileTextOutlined } from '@ant-design/icons';
import axios from 'axios'
import PreviewInstructions from '../../Preview_Instructions/Preview_Instructions'

class MaterialsList extends Component {

    fileInputRef = React.createRef() 

    static propTypes = {
        Materials_List_Style: PropTypes.object,
        Search_String: PropTypes.string,
        currentUser: PropTypes.string
    }

    state = {
      All_Materials_List:[],
      private_model_list: [],
      My_Materials_List:[],
      isModalOpen: false,
      isPreviewIntructionsOpen: false,
      isOperationInstructionsOpen: false,
      currentPage: 1,
      selectedAllItems: [],
      selectedMyItems: [],
      MyItemsAllSelected: false,
      isLoading: false,
      loadingTip: '',
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.Search_String !== prevProps.Search_String || this.state.My_Materials_List.length !== prevState.My_Materials_List.length){
            const filteredItems = this.state.My_Materials_List.filter(item => item.text.toLowerCase().includes(this.props.Search_String.toLowerCase()));

            const temp = filteredItems.map(item => item.id)
            const leftItems = this.state.selectedMyItems.filter(id => temp.includes(id));

            this.setState({ MyItemsAllSelected: leftItems.length >= filteredItems.length})
        }
        if(prevProps.activeButton !== this.props.activeButton){
          if(this.props.activeButton == 2){
            this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
              My_Materials_List: []
            }),()=> {
              this.addUpdateOperations()
            })
          }
          else{
            this.setState({All_Materials_List: []})
            this.setState({currentPage: 1})
            this.handleGetModelPreviewPictures()
          }
        }
    }

    handleGetModelPreviewPictures = async () => {
      try {
        for(let i = 1; i <= 11; i++){
          const modelPicture = await this.handleGetOneModelPreviewPicture(i)
          this.setState((prevState) => {
            let newItems = [...prevState.All_Materials_List, {id: i, pic: modelPicture, like: 0, added: 0, text: ''}]
            this.setState({All_Materials_List: newItems})
          })
        }
        return 
      } catch (error) {
          console.error('Error:', error)
          
          return 
      }
  }

  handleAddToPrivateModel = async (username, model_id) => {
    try{
      await axios.post("http://43.138.68.84:8082/api/fnyAddToPrivateModel",{
        username,model_id
      })
      .then(res=>{
        if(res.data === "error when finding user"){
          
          return
        }
        else if(res.data === "user not found"){
          
          return
        }
        else if(res.data === "insert error"){
          
          return
        }
        else if(res.data === "successful"){
          return
        }
      })
      .catch(e=>{
        
      })
    }
    catch{
      
    }
    finally{
      
    }
  };
 
  handleGetUserModels = async (username) => {
    let model_list = null
    try{
      await axios.post("http://43.138.68.84:8082/api/fnyGetUserModel",{  //注意修改这个post路径，改完告我一声
        username
      })
      .then(res=>{
        if(res.data.text === "error when finding user"){
          
          return
        }
        else if(res.data.text === "user not found"){
          
          return
        }
        else if(res.data.text === "error when searching models"){
          
          return
        }
        else if(res.data.text === "successful"){
          model_list = res.data.model_list
        }
      })
      .catch(e=>{
        
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
        
        return 
    }
  }

  handleDeleteOneUserModel = async (username, modelID) => {  //返回值为其预览图的路径
    try{
      await axios.post("http://43.138.68.84:8082/api/fnyDeleteOneUserModel",{  //注意修改这个post路径，改完告我一声
        username,modelID
      })
      .then(res=>{
        if(res.data === "error when finding user"){
          
          return
        }
        else if(res.data === "user not found"){
          
          return
        }
        else if(res.data === "unexpected error"){
          
          return
        }
        else if(res.data === "successful"){
          return
        }
      })
      .catch(e=>{
        
      })
    }
    catch{
      
    }
    finally{
      
    }
  };

  addUpdateOperations = async() => {
    try{
      await this.handleGetUserModels(this.props.currentUser)
      return
    }
    catch (error) {
      console.error('Error:', error)
      
      return       
    }
  }

  componentDidMount() {
    this.setState({All_Materials_List: []})
    this.handleGetModelPreviewPictures()
  }

  handleGetOneModelPreviewPicture = (modelID) => {  //返回值为其预览图的路径
      const our_url = "http://43.138.68.84:8082/api/fnyGetModelPreviewPicture/" + modelID;
    
      return new Promise((resolve, reject) => {
          axios.get(our_url, {
              responseType: 'arraybuffer'
          })
          .then(res => {
              if (res.data === "unexpected error") {  //出错
                  
                  resolve('');
              }
              else if (res.data === "model not exist") {  //出错
                
                resolve('');
              }
              else {
                  const blob = new Blob([res.data], { type: 'application/octet-stream' });
                  const url = URL.createObjectURL(blob);
                  resolve(url);
              }
          })
          .catch(e => {
              
              resolve('');
          });
      });
    };

    handleAllCheckboxChange = (itemId) => {
        const updatedSelection = [...this.state.selectedAllItems];
        const index = updatedSelection.indexOf(itemId);
    
        if (index === -1) {
          updatedSelection.push(itemId);
        } else {
          updatedSelection.splice(index, 1);
        }
    
        this.setState({selectedAllItems: updatedSelection});
      };

    handleMyCheckboxChange = (itemId) => {
        const updatedSelection = [...this.state.selectedMyItems];
        const index = updatedSelection.indexOf(itemId);

        const filteredItems = this.state.My_Materials_List.filter(item => item.text.toLowerCase().includes(this.props.Search_String.toLowerCase()));
    
        if (index === -1) {
          updatedSelection.push(itemId);
        } else {
          updatedSelection.splice(index, 1);
        }

        const temp = filteredItems.map(item => item.id)
        const leftItems = updatedSelection.filter(id => temp.includes(id));

        this.setState({ MyItemsAllSelected: leftItems.length >= filteredItems.length})
        this.setState({selectedMyItems: updatedSelection});
      };

    handlePageChange = (newPage) =>{
        this.setState({currentPage: newPage})
      };

    handleBlobConversion = (blob) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const parsedData = JSON.parse(fileReader.result)
        console.log(parsedData)
      };
      fileReader.readAsText(blob)
      };

    handleGetFileOfOneModel = (modelID, identifier) => {  //返回值为模型的路径
      const our_url = "http://43.138.68.84:8082/api/fnyGetFileOfOneModel/" + modelID;
    
      return new Promise((resolve, reject) => {
          axios.post(our_url)
          .then(res => {
              if (res.data.text === "unexpected error") {  //出错
                  
                resolve('');
              }
              else if (res.data.text === "model not exist") {  //出错
                
                resolve('');
              }
              else if (res.data.text === "unexpected error in python") {  //出错
                
                resolve('');
              }
              else if(res.data.text === 'successful'){
                resolve(res.data.model_path);
              }
          })
          .catch(e => {
              
              resolve('');
          })
      });
    };

    pyfun5(model_path, reminder){
      const { execFile } = window.require('child_process');
      return new Promise((resolve, reject) => {
        //参数先usecolor,再canedit
        const process1 = execFile('./dist/download_one_from_server/download_one_from_server.exe', [model_path],{ stdio: 'pipe' });
        process1.stderr.on('data',(data)=>{
          console.log("python stderr: "+data);
          // 
        })
        process1.on('close',(code)=>{
          setTimeout(() => {notification.destroy(reminder)}, 500)
          setTimeout(() => {this.openNotificationFinishDownload()}, 1000)
          const process = execFile('./dist/view_scene/view_scene.exe', [model_path,'true','true'],{ stdio: 'pipe' });
          process.stderr.on('data',(data)=>{
            console.log("python stderr: "+data);
            // 
          })
          process.on('close',(code)=>{
            console.log("python quit with code: "+code);
          })
        })
      });
    }

    pyfun6(model_path, reminder){
      const { execFile } = window.require('child_process');
      return new Promise((resolve, reject) => {
        //参数先usecolor,再canedit
        const process1 = execFile('./dist/download_one_from_server/download_one_from_server.exe', [model_path],{ stdio: 'pipe' });
        process1.stderr.on('data',(data)=>{
          console.log("python stderr: "+data);
          // 
        })
        process1.on('close',(code)=>{
          setTimeout(() => {notification.destroy(reminder)}, 500)
          setTimeout(() => {this.openNotificationFinishDownload()}, 1000)
          const process = execFile('./dist/view_scene/view_scene.exe', [model_path,'true','true'],{ stdio: 'pipe' });
          process.stderr.on('data',(data)=>{
            console.log("python stderr: "+data);
            // 
          })
          process.on('close',(code)=>{
            console.log("python quit with code: "+code);
            this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
              My_Materials_List: []
            }),()=> {
              this.deleteUpdateOperations()
             
            })
          })
        })
      });
    }

    openModal = async (modelID) => {
      // this.setState({isLoading: true, loadingTip: '正在获取点云文件'})
      this.openNotification('正在获取点云文件')

      document.body.style.overflow = 'hidden'; 
      const model_path = await this.handleGetFileOfOneModel(modelID, 0);
      //fny_todo
      this.pyfun5(model_path, '正在获取点云文件')
    };

    closeModal = () => {
      this.setState({ isModalOpen: false });
      document.body.style.overflow = 'auto'; // 恢复背景滚动
    };

    handleAdd = () => {
        //TODO: connect nodejs
        for(let i = 0; i < this.state.selectedAllItems.length; i++){
          this.handleAddToPrivateModel(this.props.currentUser, this.state.selectedAllItems[i])
        }
        this.setState({ selectedAllItems: [] });
    }

    pyfun2(model_path1, model_path2){
      let date = new Date().getTime()
      const model_path = 'model/'+ this.props.currentUser + date.toString()+'.ply'
      const preview_path = 'preview_picture/'+ this.props.currentUser + date.toString()+'.png'
      const { execFile } = window.require('child_process');
      return new Promise((resolve, reject) => {
        //参数先usecolor,再canedit
        const process1 = execFile('./dist/download_two_from_server/download_two_from_server.exe', [model_path1, model_path2],{ stdio: 'pipe' });
        process1.stderr.on('data',(data)=>{
          console.log("python stderr: "+data);
          // 
        })
        process1.on('close',(code)=>{
          setTimeout(() => {notification.destroy('正在获取点云文件')}, 500)
          setTimeout(() => {this.openNotificationFinishDownload()}, 1000)
          this.setState({isOperationInstructionsOpen: true})
          const process = execFile('./dist/create_new_pcd/create_new_pcd.exe', [model_path1, model_path2],{ stdio: 'pipe' });
          process.stderr.on('data',(data)=>{
            console.log("python stderr: "+data);
            // 
          })
          process.on('close',(code)=>{
            console.log("python quit with code: "+code);
            // 
            if(code === 0){
              const process3 = execFile('./dist/upload_file_to_server/upload_file_to_server.exe', ['./screenshot.png', preview_path, './gen.ply', model_path]);

              process3.stderr.on('data',(data)=>{
                  console.log("python stderr: "+data);
                  // 
              })
              process3.on('close',(code)=>{
                  console.log("python quit with code: "+code);
                  if(code === 0){
                    this.handleAddNewModel(this.props.currentUser, model_path, preview_path)
                  }
                  else{
                   
                    this.setState({isOperationInstructionsOpen: false})
                  }
                  //
                  //模型在./upload_model.npy
                  //预览图在./upload_picture.png
              })
            }
            else{
             
            }
          })
        })
      });
    }

    handleCompose = async () => {
        this.openNotification('正在获取点云文件')
       
        document.body.style.overflow = 'hidden'; // 防止背景滚动
        const model_path1 = await this.handleGetFileOfOneModel(this.state.selectedMyItems[0], 1)
        const model_path2 = await this.handleGetFileOfOneModel(this.state.selectedMyItems[1], 2)
        //fny_todo
        this.pyfun2(model_path1,model_path2)
    }

    deleteUpdateOperations = async() => {
      try{
        await this.handleGetUserModels(this.props.currentUser)
        this.setState({ selectedMyItems: [] });
        this.setState({ MyItemsAllSelected: false })
        return
      }
      catch (error) {
        console.error('Error:', error)
        
        return       
      }
    }

    handleDelete = async () => {
        
        for(let i = 0; i < this.state.selectedMyItems.length; i++){
          await this.handleDeleteOneUserModel(this.props.currentUser, this.state.selectedMyItems[i])
        }
        this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
          My_Materials_List: []
        }),()=> {
          this.deleteUpdateOperations()
        })
        // this.setState({ My_Materials_List: modifiedArray})
    }

    selectAll = () => {
        const filteredItems = this.state.My_Materials_List.filter(item => item.text.toLowerCase().includes(this.props.Search_String.toLowerCase()));
        this.setState({MyItemsAllSelected: true})
        this.setState( prevState => ({
            selectedMyItems: [...new Set([...prevState.selectedMyItems, ...filteredItems.map(item => item.id)])]
          }));
    }

    cancelSelectAll = () => {
        const filteredItems = this.state.My_Materials_List.filter(item => item.text.toLowerCase().includes(this.props.Search_String.toLowerCase()));
        const temp = filteredItems.map(item => item.id)
        const leftItems = this.state.selectedMyItems.filter(id => !temp.includes(id));
        this.setState({MyItemsAllSelected: false})
        this.setState({
            selectedMyItems: leftItems})
    }

    pyfun1(){
      let date = new Date().getTime()
     
      const model_path = 'model/'+ this.props.currentUser + date.toString()+'.ply'
      const preview_path = 'preview_picture/'+ this.props.currentUser + date.toString()+'.png'
      const { spawn } = window.require('child_process');
      new Promise((resolve, reject) => {
          //参数先usecolor,再canedit
          const { execFile } = window.require('child_process');
          return new Promise((resolve, reject) => {
              //参数先usecolor,再canedit
              const process = execFile('./dist/upload/upload.exe', []);
              process.stderr.on('data',(data)=>{
                  console.log("python stderr: "+data);
                  // 
              })
              process.on('close',(code)=>{
                  console.log("python quit with code: "+code);
                  if(code === 0){
                    this.openNotification('正在上传点云文件')
                    const process1 = execFile('./dist/upload_file_to_server/upload_file_to_server.exe', ['./upload_model.ply', model_path, './upload_picture.png', preview_path]);
                    process1.stderr.on('data',(data)=>{
                        console.log("python stderr: "+data);
                        // 
                    })
                    process1.on('close',(code)=>{
                        console.log("python quit with code: "+code);
                        if(code === 0){
                          this.handleAddNewModel(this.props.currentUser, model_path, preview_path)
                          //const { spawn } = window.require('child_process');
                        }
                        else{
                          setTimeout(() => {notification.destroy('正在上传点云文件')}, 500)
                         
                        }
                    }) 
                  }
              })
          });
      });
  }

  handleAddNewModel = async (username, model_path, preview_path) => {  //给出用户名，模型，预览图，加到私有库里
        try{
          let modelID=-1
          await axios.post("http://43.138.68.84:8082/api/fnyAddNewModel/",{  //注意修改这个post路径，改完告我一声
            username, model_path, preview_path
          })
          .then(res=>{
            if(res.data.text === "error when finding user"){
              
              return
            }
            else if(res.data.text === "user not found"){
              
              return
            }
            else if(res.data.text === "error when inserting new model"){
              
              return
            }
            else if(res.data.text === "error when creating user_model"){
              
              return
            }
            else if(res.data.text === "successful"){
              modelID=res.data.modelID
              return
            }
          })
          .catch(e=>{
            
            return
          })
      }
      catch{
          
      }
      finally{
        this.setState({isOperationInstructionsOpen: false})
        this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
          My_Materials_List: []
        }),()=> {
          setTimeout(() => {notification.destroy('正在上传点云文件')}, 500)
          this.deleteUpdateOperations()
         
        })
      }
  };
  

    handleUpload = async () => {
      await this.pyfun1();
    }

    handleButtonClick = (event) => {
      this.fileInputRef.current.click()
    }

    handlePictureForServer = async (selectedFile) => {
      const username = this.props.currentUser
      const formData = new FormData()
      formData.append('username', username);
      formData.append('generate_picture', selectedFile);
      const our_url = "http://43.138.68.84:8082/api/generateModel/" + username;
      try{
          await axios.post(our_url,formData, {timeout: 600000})
          .then(res=>{
              if(res.data === "图片转模型error"){
                  
                  setTimeout(() => {notification.destroy('模型正在生成中')}, 500)
                  this.openFailureNotification("生成失败，请重试")
                 
                  return 
              }
              else if(res.data.text === "模型获取成功，请下载"){
                this.pyfun6(res.data.model_path, '模型正在生成中')
                return
              }
          })
          .catch(e=>{
              
              setTimeout(() => {notification.destroy('模型正在生成中')}, 500)
              this.openFailureNotification("生成失败，请重试")
             
              return 
          })
      }
      catch{
          
          setTimeout(() => {notification.destroy('模型正在生成中')}, 500)
          this.openFailureNotification("生成失败，请重试")
         
          return 
      }
  };

  openFailureNotification = (reminder) => {
    const key = reminder;
    notification.error({
      message: reminder,
      key,
      placement: 'bottomRight',
    });
  }


    handleGenerate = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile){ 
       
        this.openNotification("模型正在生成中")
        this.handlePictureForServer(selectedFile)
      }
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

    openNotificationFinishDownload = () => {
      notification.success({
        message: '成功获取点云文件',
        description: '模型即将显现...',
        placement: 'bottomRight',
      });
    }

    render() {
        let items = []
        let condition1 = this.props.activeButton === 1
        if(condition1){
            items = this.state.All_Materials_List;
        }
        else{
            items = this.state.My_Materials_List;
            const uniqueSet = new Set(items.map(item => item.id));
            items = Array.from(uniqueSet, id => items.find(item => item.id === id));
        }

        const filteredItems = items.filter(item => item.text.toLowerCase().includes(this.props.Search_String.toLowerCase()));
  
        const { currentPage } = this.state;
        const itemsPerPage = 15
  
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;

        const PaginationStyle = filteredItems.length <= itemsPerPage
        ? {
          position: 'relative',
          bottom: '0',
          padding: '0px',
        }
        :{
          position: 'relative',
          bottom: '0',
          padding: '8px',
        }

      const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  
      return (
        condition1 ?
        <div>
          {/* <Spin delay={100} spinning={this.state.isLoading} tip={this.state.loadingTip} style={{backgroundColor: 'rgb(0, 0, 0, 0.6)'}} size="large"/>  */}
            <List class="materials-post-list" style={this.props.Materials_List_Style}
                grid={{ column: 3 }}
                dataSource={currentItems}
                renderItem={(item) => (
                <List.Item key={item.id} style={{display: 'flex', borderBottom: '1px solid rgba(2, 9, 16, 0.13)', borderRight: '1px solid rgba(2, 9, 16, 0.13)', breakInside: 'avoid'}}>
                <div style={{ marginLeft: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ marginTop: '-5px'}}>
                    <h2>{item.text}</h2>
                    <img src={item.pic} onClick={()=>this.openModal(item.id)} alt="Sunset" style={{height: '150px', maxWidth: '200px', cursor: 'pointer'}} />
                  </div>
                  <div style={{ position: 'absolute', top: '10px', right: '20px'}}>
                    <Checkbox onChange={() => this.handleAllCheckboxChange(item.id)} checked={this.state.selectedAllItems.includes(item.id)}/>
                  </div>
                </div>
                </List.Item>
                )}>
                <div style={PaginationStyle} >
                  <Pagination current={currentPage} pageSize={itemsPerPage} showSizeChanger={false} total={filteredItems.length} onChange={this.handlePageChange} hideOnSinglePage={true}/>
                </div> 
            </List>
            {this.state.selectedAllItems.length == 0
                ? <ConfigProvider autoInsertSpaceInButton={false}> 
                    <Button style={{position: 'absolute', top: '91%', right:'10%'}} type="primary" size="large" onClick={this.handleAdd} disabled>添加</Button>
                </ConfigProvider>
                :
                <ConfigProvider autoInsertSpaceInButton={false}> 
                    <Button style={{position: 'absolute', top: '91%', right:'10%'}} type="primary" size="large" onClick={this.handleAdd}>添加</Button>
                </ConfigProvider>}
            <FloatButton
              icon={<FileTextOutlined />}
              description="Help"
              shape="square"
              type="primary"
              style={{
                right: 40,
                bottom: 40,
              }}
              onClick={()=>{this.setState({isPreviewIntructionsOpen: true})}}
            />
            <Modal
              title="操作帮助"
              open={this.state.isPreviewIntructionsOpen}
              footer={null}
              onOk={() => {this.setState({isPreviewIntructionsOpen: false})}}
              onCancel={() => {this.setState({isPreviewIntructionsOpen: false})}}
              width='76vw'
              height='100vh'
              style={{top:'0'}}
            >
              <PreviewInstructions/>
            </Modal>
        </div>
        :
        <div>

            <List class="materials-post-list" style={this.props.Materials_List_Style}
                grid={{ column: 3 }}
                dataSource={filteredItems}
                renderItem={(item) => (
                <List.Item key={item.id} style={{display: 'flex', borderBottom: '1px solid rgba(2, 9, 16, 0.13)', borderRight: '1px solid rgba(2, 9, 16, 0.13)', breakInside: 'avoid'}}>
                <div style={{ marginLeft: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ marginTop: '-5px'}}>
                    <h2>{item.text}</h2>
                    <img src={item.pic} onClick={()=>this.openModal(item.id)} alt="Sunset" style={{height: '150px', maxWidth: '200px', cursor: 'pointer'}} />
                  </div>
                  <div style={{ position: 'absolute', top: '10px', right: '20px'}}>
                    <Checkbox onChange={() => this.handleMyCheckboxChange(item.id)} checked={this.state.selectedMyItems.includes(item.id)}/>
                  </div>
                </div>
                </List.Item>
                )}>
            </List>
            {this.state.selectedMyItems.length == 2
                ? <ConfigProvider autoInsertSpaceInButton={false}> 
                    <Button style={{position: 'absolute', top: '91%', right:'18%'}} type="primary" size="large" onClick={() => this.handleCompose()}>拼接</Button>            
                  </ConfigProvider>
                :
                  <ConfigProvider autoInsertSpaceInButton={false}> 
                    <Button style={{position: 'absolute', top: '91%', right:'18%'}} type="primary" size="large" disabled>拼接</Button>  
                  </ConfigProvider>}

            {this.state.selectedMyItems.length != 0
                ? <ConfigProvider autoInsertSpaceInButton={false}> 
                      <Popconfirm
                      title="删除素材"
                      description="确定删除这些素材吗？"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={()=>this.handleDelete()}
                    >
                      <Button style={{position: 'absolute', top: '91%', right:'10%'}} type="primary" danger size="large">删除</Button>
                    </Popconfirm>
                    </ConfigProvider>
                :
                    <ConfigProvider autoInsertSpaceInButton={false}> 
                    <Button style={{position: 'absolute', top: '91%', right:'10%'}} type="primary" danger size="large" disabled>删除</Button>
                    </ConfigProvider>}

            {this.state.My_Materials_List.length != 0
                ? (!this.state.MyItemsAllSelected ? (
                    <ConfigProvider autoInsertSpaceInButton={false}> 
                      <Button style={{position: 'absolute', top: '91%', left:'10%'}} type="primary" size="large" onClick={this.selectAll}>全选</Button>
                    </ConfigProvider>
                    ):(
                    <ConfigProvider autoInsertSpaceInButton={false}> 
                      <Button style={{position: 'absolute', top: '91%', left:'10%'}} size="large" onClick={this.cancelSelectAll}>取消全选</Button>
                    </ConfigProvider>
                    ))
                : 
                    <ConfigProvider autoInsertSpaceInButton={false}> 
                    <Button style={{position: 'absolute', top: '91%', left:'10%'}} type="primary" size="large" disabled>全选</Button>
                    </ConfigProvider>}

            <ConfigProvider autoInsertSpaceInButton={false}> 
              <Button style={{position: 'absolute', top: '91%', left:'43%'}} size="large" onClick={()=>this.handleUpload()}>上传</Button>
            </ConfigProvider>

            <ConfigProvider autoInsertSpaceInButton={false}> 
              <Button style={{position: 'absolute', top: '91%', left:'51%'}} size="large" onClick={()=>this.handleButtonClick()}>图片生成</Button>
            </ConfigProvider>

            <input type="file" accept='.jpg, .jpeg, .png' onChange={this.handleGenerate} style={{display: 'none'}} ref={this.fileInputRef}/>
            <FloatButton
              icon={<FileTextOutlined />}
              description="Help"
              shape="square"
              type="primary"
              style={{
                right: 40,
                bottom: 40,
              }}
              onClick={()=>{this.setState({isPreviewIntructionsOpen: true})}}
            />
            <Modal
              title="操作帮助"
              open={this.state.isPreviewIntructionsOpen}
              footer={null}
              onOk={() => {this.setState({isPreviewIntructionsOpen: false})}}
              onCancel={() => {this.setState({isPreviewIntructionsOpen: false})}}
              width='76vw'
              height='100vh'
              style={{top:'0'}}
            >
              <PreviewInstructions/>
            </Modal>
        </div>
      )
    }
  }
  
  export default MaterialsList;