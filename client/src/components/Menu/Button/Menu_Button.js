import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Menu_Button.css'

export default class MenuButton extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        onButtonClick: PropTypes.func,
        activeButton: PropTypes.object,
        Menu_Button_Text: PropTypes.string,
        Menu_Button_Style: PropTypes.object,
        Menu_Button_Pic: PropTypes.string,
    }

    static defaultProps = {
        Menu_Button_Text: '',
        Menu_Button_Style: {
            left: '0px',
        },
        Menu_Button_Clicked: null,
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        if (this.props.Menu_Button_Text === '发现'){
            return <button onClick={() => this.props.onButtonClick(1)} class={`zgw_menu_button ${this.props.activeButton === 1 ? 'active' : ''}`} style={this.props.Menu_Button_Style}>
            <img src={this.props.Menu_Button_Pic} class="icon"/>
            <span class="text_menu">{this.props.Menu_Button_Text}</span>
            </button>
        }
        else if (this.props.Menu_Button_Text === '发布'){
            return <button onClick={() => this.props.onButtonClick(2)} class={`zgw_menu_button ${this.props.activeButton === 2 ? 'active' : ''}`} style={this.props.Menu_Button_Style}>
            <img src={this.props.Menu_Button_Pic} class="icon"/>
            <span class="text_menu">{this.props.Menu_Button_Text}</span>
            </button>
        }
        else if (this.props.Menu_Button_Text === '消息'){
            return <button onClick={() => this.props.onButtonClick(3)} class={`zgw_menu_button ${this.props.activeButton === 3 ? 'active' : ''}`} style={this.props.Menu_Button_Style}>
            <img src={this.props.Menu_Button_Pic} class="icon"/>
            <span class="text_menu">{this.props.Menu_Button_Text}</span>
            </button>
        }
        else if (this.props.Menu_Button_Text === '我的'){
            return <button onClick={() => this.props.onButtonClick(4)} class={`zgw_menu_button ${this.props.activeButton === 4 ? 'active' : ''}`} style={this.props.Menu_Button_Style}>
            <img src={this.props.Menu_Button_Pic} class="icon"/>
            <span class="text_menu">{this.props.Menu_Button_Text}</span>
            </button>
        }
        else if (this.props.Menu_Button_Text === '素材库'){
            return <button onClick={() => this.props.onButtonClick(5)} class={`zgw_menu_button ${this.props.activeButton === 5 ? 'active' : ''}`} style={this.props.Menu_Button_Style}>
            <img src={this.props.Menu_Button_Pic} class="icon"/>
            <span class="text_menu">{this.props.Menu_Button_Text}</span>
            </button>
        }
    }
}
