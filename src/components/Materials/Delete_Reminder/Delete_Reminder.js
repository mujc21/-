import React, { Component } from 'react';
import './Delete_Reminder.css'
import { Button, ConfigProvider } from 'antd'

class DeleteReminder extends Component {
  render() {
    const { isOpen, onCloseConfirm, onCloseCancel } = this.props;

    return (
      isOpen && (
        <div className="delete-reminder">
          <div className="delete-reminder-content">
            <p style={{marginBottom: '20px'}}>确定删除？</p >
            <ConfigProvider autoInsertSpaceInButton={false}> 
              <Button onClick={onCloseConfirm}>确定</Button>
            </ConfigProvider>

            <ConfigProvider autoInsertSpaceInButton={false}> 
              <Button onClick={onCloseCancel} style={{marginLeft: '40px'}}>取消</Button>
            </ConfigProvider>
          </div>
        </div>
      )
    );
  }
}

export default DeleteReminder;