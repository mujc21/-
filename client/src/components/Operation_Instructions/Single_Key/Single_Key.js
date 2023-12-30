import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Single_Key.css'

export default class SingleKey extends Component {
    static propTypes = {
        instruction: PropTypes.string,
    }
    defaultProps = {
        instruction: '',
    }
    render(){
        return(
            <label class="iconLabel">
            <div class="icon1">
                <div class="iconBox">
                  <p style={{fontSize: '24px', fontWeight: '400', lineHeight: '50px', color: 'blueviolet'}}>{this.props.instruction}</p>
                </div>
            </div>
          </label>
        )  
    }
}