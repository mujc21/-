import React, { Component } from 'react'
import './App.css';

import OKCancelDialog from './components/Dialog/OK_Cancel_Dialog'
import AddAuditor from './components/AddAuditor/Add_Auditor'
import SelectBar from './components/Select_Bar/Select_Bar'
import OneUser from './components/One_User/One_User';

export default class App extends Component {

  // 在运行过程中会因事件发生改变的数据要放到state里
  state = {
    add_Auditor_Email_String:'',
    add_Auditor_Password_String:'',
    select_Bar_State: '',
  }

  fun_OK_Cancel_Dialog_OK_Clicked = () =>{
    alert("在确认/取消对话框中，确认按钮被按下")
  }
  
  fun_OK_Cancel_Dialog_Cancel_Clicked = () =>{
    alert("在确认/取消对话框中，取消按钮被按下")
  }

  fun_Add_Auditor_Change_Email = (new_Email_String) =>{
    this.setState({add_Auditor_Email_String: new_Email_String})
  }

  fun_Add_Auditor_Change_Key = (new_Key_String) =>{
    this.setState({add_Auditor_Password_String: new_Key_String})
  }

  fun_Add_Auditor_OK_Clieked = () =>{
    const temp_email = this.state.add_Auditor_Email_String
    const temp_key= this.state.add_Auditor_Password_String
    alert("在添加管理员对话框中，确认按钮被按下\n用户名为："+temp_email+'\n密码为：'+temp_key)
  }

  fun_Add_Auditor_Cancel_Clieked = () =>{
    alert("在添加管理员对话框中，取消按钮被按下")
  }

  fun_Select_Bar_changed = (new_state) => {
    this.setState(() => ({  //必须这样写，用回调函数，否则出错，原因未知
      select_Bar_State:new_state
    }),()=> {
    alert("下拉框值修改为："+this.state.select_Bar_State)
    })
  }

  envelope_Style={
    position: 'relative',
    top: '30px',
    left: '30px',
    height: "250px",
    width: "250px",
    border: '5px solid black',
    backgroundImage: "url('/picture/envelop.png')",
    backgroundPosition: 'center',  
    backgroundSize: 'cover',
	  backgroundRepeat: 'no-repeat',
  }

  //网页渲染时实际上仅仅渲染了此函数return的内容。各个部分都是组件，这就实现了拆分和合并。
  //父子组件间传递值。父组件通过添加属性来给子组件传值（比如下文的todoList={todoList} updateTodo={this.updateTodo}等）
  //子组件可以通过props来读取传来的数据（具体见各个组件的代码）
  //再次注意this指针的问题，由于前面使用了箭头函数，这里就很方便了，直接updateTodo={this.updateTodo}这样的写法就可以。
  render() {
      return (
        <div>
          <OKCancelDialog OK_Clicked={this.fun_OK_Cancel_Dialog_OK_Clicked} Cancel_Clicked={this.fun_OK_Cancel_Dialog_Cancel_Clicked}/>
          <AddAuditor Main_Style={{position:'relative', left:'450px', top: '-250px'}} Email_Input_Changed={this.fun_Add_Auditor_Change_Email} Key_Input_Changed={this.fun_Add_Auditor_Change_Key} OK_Clicked={this.fun_Add_Auditor_OK_Clieked} Cancel_Clicked={this.fun_Add_Auditor_Cancel_Clieked}/>
          <SelectBar Select_Bar_Style={{position: 'relative',left: '900px', top: '-400px', width: '150px', height: '35px'}} Select_Bar_Options={['点赞最多','收藏最多','最新发布']} Select_Bar_Changed={this.fun_Select_Bar_changed}/>
          <OneUser Main_Style={{position:'relative', left:'50px', top: '-100px'}}/>
        </div>
      )
  }
}