import React, { Component } from 'react'

import './App.css'

import OKCancelDialog from './components/dialog/OK_Cancel_Dialog'

export default class App extends Component {
  render() {
    return <div>
        <OKCancelDialog message_text="提示消息" question_text="是否确认消息" OK_Button_text="差不多"/>
      </div>
  }
}