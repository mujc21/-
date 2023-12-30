import React, { Component } from 'react';
import './Error_Reminder.css'
import { Button, ConfigProvider } from 'antd'

class ErrorReminder extends Component {
  render() {
    const { isOpen, onClose, errorString } = this.props;
    return (
      isOpen && (
        <div className="error-reminder">
          <div className="error-reminder-content">
            <p style={{marginBottom: '30px'}}>{errorString}</p >
            <ConfigProvider autoInsertSpaceInButton={false}> 
              <Button onClick={onClose} style={{left: '60px'}}>确定</Button>
            </ConfigProvider>
          </div>
        </div>
      )
    );
  }
}

export default ErrorReminder;