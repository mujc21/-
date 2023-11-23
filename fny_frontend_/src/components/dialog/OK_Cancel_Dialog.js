import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './OK_Cancel_Dialog.css'
import OKButton from '../fny_button/OK_Button'
import CancelButton from '../fny_button/Cancel_Button'

export default class OKCancelDialog extends Component {
    static propTypes = {
        message_text:PropTypes.string.isRequired,
        question_text:PropTypes.string.isRequired,
        OK_Button_text:PropTypes.string,
        Cancel_Button_text:PropTypes.string,
        Main_Style: PropTypes.object,
        Message_Style: PropTypes.object,
        Question_Style: PropTypes.object,
        OK_Button_Style: PropTypes.object,
        Cancel_Button_Style: PropTypes.object
    }

    static defaultProps = {
        OK_Button_text: '确认',
        Cancel_Button_text: '取消',
        Main_Style:{
            top: '10px',
            border: '5px black solid',
            backgroundColor: '#f6f6f6'
        },
        Message_Style:{
            paddingTop: '15px',
            textAlign: 'center', 
            color: 'black'
        },
        Question_Style:{
            paddingTop: '15px',
            textAlign: 'center', 
            color: 'black'
        },
        OK_Button_Style:{
            top: '20px',
            left: '15px'
        },
        Cancel_Button_Style:{
            top: '20px',
            left: '30px'
        }
    }

    render() {
        return <div class="fny_dialog" style={this.props.Main_Style}>
                    <h2 style={this.props.Message_Style}>{this.props.message_text}</h2>
                    <h4 style={this.props.Question_Style}>{this.props.question_text}</h4>
                    <OKButton button_text={this.props.OK_Button_text} button_style={this.props.OK_Button_Style}/>
                    <CancelButton button_text={this.props.Cancel_Button_text} button_style={this.props.Cancel_Button_Style}/>
               </div>
    }
}