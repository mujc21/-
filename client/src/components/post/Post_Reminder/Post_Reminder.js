import React, { Component } from 'react';
import './Post_Reminder.css'
import { Button, ConfigProvider } from 'antd'

class PostReminder extends Component {
  render() {
    const { isOpen, onCloseConfirm, Reminder} = this.props;

    return (
      isOpen && (
        <div className="post-reminder">
          <div className="post-reminder-content">
            <p style={{marginBottom: '20px', marginRight: '40px'}}>{Reminder}</p>
            <ConfigProvider autoInsertSpaceInButton={false}> 
              <Button onClick={onCloseConfirm}>确定</Button>
            </ConfigProvider>
          </div>
        </div>
      )
    );
  }
}

export default PostReminder;