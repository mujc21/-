import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Modal from '../../../Modal'
import DeleteReminder from '../Delete_Reminder/Delete_Reminder'
import './Materials_List.css'; // 导入样式文件
import { Pagination, List, Checkbox, Button, ConfigProvider} from 'antd'
import axios from 'axios'
import {saveAs} from 'file-saver'
//const fs=require('fs');

class MaterialsList extends Component {
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
      isDeleteReminderOpen: false,
      currentPage: 1,
      selectedAllItems: [],
      selectedMyItems: [],
      MyItemsAllSelected: false,
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.Search_String != prevProps.Search_String || this.state.My_Materials_List.length != prevState.My_Materials_List.length){
            const filteredItems = this.state.My_Materials_List.filter(item => item.text.toLowerCase().includes(this.props.Search_String.toLowerCase()));

            const temp = filteredItems.map(item => item.id)
            const leftItems = this.state.selectedMyItems.filter(id => temp.includes(id));

            this.setState({ MyItemsAllSelected: leftItems.length >= filteredItems.length})
        }
        if(prevProps.activeButton != this.props.activeButton){
          if(this.props.activeButton == 2){
            this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
              My_Materials_List: []
            }),()=> {
              this.addUpdateOperations()
            })
          }
          else{
            this.setState({All_Materials_List: []})
            this.handleGetModelPreviewPictures()
          }
        }
    }

    handleGetModelPreviewPictures = async () => {
      try {
        for(let i = 1; i <= 50; i++){
          const modelPicture = await this.handleGetOneModelPreviewPicture(i)
          this.setState((prevState) => {
            let newItems = [...prevState.All_Materials_List, {id: i, pic: modelPicture, like: 0, added: 0, text: ''}]
            this.setState({All_Materials_List: newItems})
          })
        }
        return 
      } catch (error) {
          console.error('Error:', error)
          alert('404 handleMyPage响应失败')
          return 
      }
  }

  handleAddToPrivateModel = async (username, model_id) => {
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
      
    }
  };
 
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

  handleDeleteOneUserModel = async (username, modelID) => {  //返回值为其预览图的路径
    try{
      await axios.post("/api/fnyDeleteOneUserModel",{  //注意修改这个post路径，改完告我一声
        username,modelID
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
        else if(res.data === "unexpected error"){
          alert("删除失败，请重试")
          return
        }
        else if(res.data === "successful"){
          return
        }
      })
      .catch(e=>{
        alert("404 DeleteOneUserModel响应失败: " + e.message);
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
      alert('404 updateOperation2响应失败')
      return       
    }
  }

  componentDidMount() {
    this.setState({All_Materials_List: []})
    this.handleGetModelPreviewPictures()
    this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
      My_Materials_List: []
    }),()=> {
      this.addUpdateOperations()
    })
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

    handleGetFileOfOneModel = (modelID) => {  //返回值为模型的路径
      const our_url = "/api/fnyGetFileOfOneModel/" + modelID;
    
      return new Promise((resolve, reject) => {
          axios.post(our_url, {
              responseType: 'arraybuffer'
          })
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
                alert("服务器加载模型出错");
                resolve('');
              }
              else if (res.data.text === "successful") {  //出错
                resolve(res.data.array);
              }
          })
          .catch(e => {
              alert("404 GetFileOfOneModel响应失败: " + e.message);
              resolve('');
          });
      });
    };

    pyfun5(url1){
      alert(url1)
      // const { PythonShell } = require('python-shell');
      // // 配置PythonShell选项
      // const options = {
      //   args: [url1,'true','true']
      // };
      // PythonShell.run('./view_scene.py', options, function (err, result) {
      //   if (err) throw err;
       
      //   // 处理Python脚本的输出结果
      //   console.log(result);
      // })
      const { spawn } = window.require('child_process');
      return new Promise((resolve, reject) => {
        //参数先usecolor,再canedit
        const process = spawn('python', ['./view_scene.py',' ','true','true'],{ stdio: 'pipe' });
        process.stdin.write(url1)
        process.stdin.end()
        process.stdout.on('data',(data)=>{
          console.log("python stdout: "+data);
          alert("python stdout: "+data);
        })
        process.stderr.on('data',(data)=>{
          console.log("python stderr: "+data);
          alert("python stderr: "+data);
        })
        process.on('close',(code)=>{
          console.log("python quit with code: "+code);
          alert("python quit with code: "+code);
        })
      });
    }

    openModal = async (modelID) => {
      document.body.style.overflow = 'hidden'; 
      const arrayString = await this.handleGetFileOfOneModel(modelID);
      //fny_todo
      this.pyfun5(arrayString)
    };

    closeModal = () => {
      this.setState({ isModalOpen: false });
      document.body.style.overflow = 'auto'; // 恢复背景滚动
    };

    openDeleteReminder = () => {
        this.setState({ isDeleteReminderOpen: true });
        document.body.style.overflow = 'hidden'; // 防止背景滚动
      };

    closeDeleteReminderConfirm = () => {
      this.setState({ isDeleteReminderOpen: false });
      document.body.style.overflow = 'auto'; // 恢复背景滚动
      this.handleDelete();
    };

    closeDeleteReminderCancel = () => {
      this.setState({ isDeleteReminderOpen: false });
      document.body.style.overflow = 'auto'; // 恢复背景滚动
    };

    handleAdd = () => {
        //TODO: connect nodejs
        for(let i = 0; i < this.state.selectedAllItems.length; i++){
          this.handleAddToPrivateModel(this.props.currentUser, this.state.selectedAllItems[i])
        }
        this.setState({ selectedAllItems: [] });
    }

    pyfun3(url1,url2){
      alert(url1)
      alert(url2)
      const { spawn } = window.require('child_process');
      //alert("enter pyfun3")
      return new Promise((resolve, reject) => {
        const process = spawn('python', ['./create_new_pcd.py',url1+'.npy',url2+'.npy']);
      });
    }

    handleCompose = async () => {
        document.body.style.overflow = 'hidden'; // 防止背景滚动
        const documentURL1 = await this.handleGetFileOfOneModel(this.state.selectedMyItems[0])
        const documentURL2 = await this.handleGetFileOfOneModel(this.state.selectedMyItems[1])
        //fny_todo
        this.pyfun3(documentURL1,documentURL2)
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
        alert('404 updateOperation2响应失败')
        return       
      }
    }

    handleDelete = async () => {
        //TODO: connect nodejs
        // const filtered_Array = this.state.My_Materials_List.filter(item => !this.state.selectedMyItems.includes(item.id));
        // const modifiedArray = filtered_Array.map((item, index) => ({
        //     ...item,
        //     id: index + 1,
        //   }));
        
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

    render() {
        let items = []
        let condition1 = this.props.activeButton === 1
        if(condition1){
            items = this.state.All_Materials_List;
        }
        else{
            items = this.state.My_Materials_List;
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
            <List class="materials-post-list" style={this.props.Materials_List_Style}
                grid={{ column: 3 }}
                dataSource={currentItems}
                renderItem={(item) => (
                <List.Item key={item.id} style={{display: 'flex', borderBottom: '1px solid rgba(2, 9, 16, 0.13)', borderRight: '1px solid rgba(2, 9, 16, 0.13)', breakInside: 'avoid'}}>
                <div style={{ marginLeft: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ marginTop: '-5px'}}>
                    <h2>{item.text}</h2>
                    <img src={item.pic} onClick={()=>this.openModal(item.id)} alt="Sunset" style={{height: '150px', width: '200px'}} />
                  </div>
                  <div style={{ position: 'absolute', top: '10px', right: '20px'}}>
                    <Checkbox onChange={() => this.handleAllCheckboxChange(item.id)} checked={this.state.selectedAllItems.includes(item.id)}/>
                  </div>
                </div>
                </List.Item>
                )}>
                <div style={PaginationStyle} >
              <Pagination current={currentPage} pageSize={itemsPerPage} total={filteredItems.length} onChange={this.handlePageChange} hideOnSinglePage={true}/>
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
            <Modal isOpen={this.state.isModalOpen} onClose={this.closeModal} />
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
                    <img src={item.pic} onClick={()=>this.openModal(item.id)} alt="Sunset" style={{height: '150px', width: '200px'}} />
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
                    <Button style={{position: 'absolute', top: '91%', right:'18%'}} type="primary" size="large" onClick={this.handleCompose}>拼接</Button>
                  </ConfigProvider>
                :
                  <ConfigProvider autoInsertSpaceInButton={false}> 
                    <Button style={{position: 'absolute', top: '91%', right:'18%'}} type="primary" size="large" disabled>拼接</Button>
                  </ConfigProvider>}
            {this.state.selectedMyItems.length != 0
                ? <ConfigProvider autoInsertSpaceInButton={false}> 
                    <Button style={{position: 'absolute', top: '91%', right:'10%'}} type="primary" danger size="large" onClick={this.openDeleteReminder}>删除</Button>
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
            // <Modal isOpen={this.state.isModalOpen} onClose={this.closeModal} />
            <DeleteReminder isOpen={this.state.isDeleteReminderOpen} onCloseConfirm={this.closeDeleteReminderConfirm} onCloseCancel={this.closeDeleteReminderCancel}/>
        </div>
      )
    }
  }
  
  export default MaterialsList;