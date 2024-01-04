import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Search_Box.css'

export default class SearchBox extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    inputRef = React.createRef()
    state={
        inputValue: '', 
    }

    static propTypes = {
        Search_Box_Style: PropTypes.object,
        Search_Box_Placeholder: PropTypes.string,
        Search_Box_String_Changed: PropTypes.func,
        Search_Box_Type: PropTypes.string,

        Handle_Search: PropTypes.func,
        Handle_Close: PropTypes.func,
    }

    static defaultProps = {
        Handle_Search: null,
        Handle_Close: null,
        Search_Box_Placeholder: '搜索...',
        Search_Box_Type: 'text',
    }

    handleChange = (e) => {
        this.setState({inputValue: e.target.value})
        this.props.Search_Box_String_Changed(e.target.value)
    }

    clearInput = () =>{
        this.setState({inputValue: ''})
        this.props.Search_Box_String_Changed('')
    }
    
    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <div className="input-wrapper" style={this.props.Search_Box_Style}>
            <button className="search-button" onClick={this.props.Handle_Search}>
              <img src={'./picture/search.png'} class="icon-search"/>
            </button>
            <input type="text" value={this.state.inputValue} onChange={this.handleChange} placeholder={this.props.Search_Box_Placeholder} className="search-input" />
            <button className="search-button" onClick={this.clearInput}>
              <img src={'./picture/Close.png'} class="icon-search"/>
            </button>
        </div>
    }
}
