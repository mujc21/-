import React, { Component } from 'react';
import './New_Username.css'
import { Button, ConfigProvider, Input } from 'antd'

class NewUsername extends Component {

  state = {
    inputValue: '',
  }

  handleChange = (e) => {
    this.setState({inputValue: e.target.value})
  }

  confirmNewUsername = () => {
    this.props.onCloseConfirm(this.state.inputValue)
    this.setState({inputValue: ''})
  }

  cancelNewUsername = () => {
    this.props.onCloseCancel()
    this.setState({inputValue: ''})
  }

  componentDidUpdate(prevProps) {
    if(prevProps.isOpen === false && this.props.isOpen === true){
        this.props.closeRenameModal()
    }
  }

  render() {
    const { isOpen, onCloseCancel, isRenameReminderOpen, RenameReminderString } = this.props;
    const Rename_Reminder_Style = {
        marginTop: '5px',
        color: 'red',
        fontWeight: '700',
        fontSize: '11px',
        height: '20px',
    }

    return (
      isOpen && (
        <div className="new-username">
          <div className="new-username-content">
            <p style={{marginBottom: '20px'}}>请输入新的用户名：</p >
            <Input type="text" value={this.state.inputValue} onChange={this.handleChange} placeholder='用户名：2-10个字符' class="new-username-input"/>
            {isRenameReminderOpen ? <p style={Rename_Reminder_Style}>{RenameReminderString}</p> : <p style={Rename_Reminder_Style}></p>}
            <ConfigProvider autoInsertSpaceInButton={false}> 
              <Button onClick={() => this.confirmNewUsername()} >确定</Button>
            </ConfigProvider>

            <ConfigProvider autoInsertSpaceInButton={false}> 
              <Button onClick={() => this.cancelNewUsername()} style={{marginLeft: '40px'}}>取消</Button>
            </ConfigProvider>
          </div>
        </div>
      )
    );
  }
}

export default NewUsername;