import React, { Component } from 'react';
import './New_Password.css'
import { Button, ConfigProvider, Input } from 'antd'

class NewPassword extends Component {

  state = {
    inputOriginalValue: '',
    inputNewValue: '',
  }

  handleOriginalChange = (e) => {
    this.setState({inputOriginalValue: e.target.value})
  }

  handleNewChange = (e) => {
    this.setState({inputNewValue: e.target.value})
  }

  confirmNewPassword = () => {
    this.props.onCloseConfirm(this.state.inputOriginalValue, this.state.inputNewValue)
    this.setState({inputOriginalValue: ''})
    this.setState({inputNewValue: ''})
  }

  cancelNewPassword = () => {
    this.props.onCloseCancel()
    this.setState({inputOriginalValue: ''})
    this.setState({inputNewValue: ''})
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
        height: '10px',
    }

    return (
      isOpen && (
        <div className="new-password">
          <div className="new-password-content">
            <p style={{marginBottom: '10px'}}>请输入原始密码：</p >
            <Input type="password" value={this.state.inputOriginalValue} onChange={this.handleOriginalChange} placeholder='原始密码' class="new-password-input"/>
            {isRenameReminderOpen && RenameReminderString !== "密码长度应为8-15位，请重新输入" ? <p style={Rename_Reminder_Style}>{RenameReminderString}</p> : <p style={Rename_Reminder_Style}></p>}
            <p style={{marginBottom: '10px'}}>请输入新密码：</p >
            <Input type="password" value={this.state.inputNewValue} onChange={this.handleNewChange} placeholder='新密码，8-15个字符' class="new-password-input"/>
            {isRenameReminderOpen && RenameReminderString === "密码长度应为8-15位，请重新输入" ? <p style={Rename_Reminder_Style}>{RenameReminderString}</p> : <p style={Rename_Reminder_Style}></p>}
            <ConfigProvider autoInsertSpaceInButton={false}> 
              <Button onClick={() => this.confirmNewPassword()} >确定</Button>
            </ConfigProvider>

            <ConfigProvider autoInsertSpaceInButton={false}> 
              <Button onClick={() => this.cancelNewPassword()} style={{marginLeft: '40px'}}>取消</Button>
            </ConfigProvider>
          </div>
        </div>
      )
    );
  }
}

export default NewPassword;