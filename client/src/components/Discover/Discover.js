import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Discover.css'

import SearchBox from '../Search_Box/Search_Box'
import SelectBar from '../Select_Bar/Select_Bar'
import DiscoverList from './Discover_List/Discover_List'

export default class Discover extends Component {

    componentDidMount(){
        if(this.props.resetInitialJump !== null){
            this.props.resetInitialJump();
        }
    }
    state = {
        Search_Content: '',
        Final_Search_Content: '',
        select_Bar_State: '点赞最多',
    };
    
    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        MainStyle: PropTypes.object,
        Search_Box_Style: PropTypes.object,
        Search_Box_Palceholder: PropTypes.string,
        Mails_List_Style: PropTypes.object,
        resetInitialJump: PropTypes.func,
    }

    static defaultProps = {
        Search_Box_Style: {
            position: 'absolute',
            color: 'white',
            top: '4%',
            left: '24%',
            width: '449px',
            borderRadius: '0px',
            borderWidth: '3px',
            height: '40px',
        },
        Search_Input_Palceholder: '搜索...',

        Discover_List_Style:{
            top: '16%',
            left: '0px',
        }
    }

    Search_Box_String_Changed = (new_Key_String) =>{
        this.setState({Search_Content: new_Key_String})
    }

    Handle_Search = () =>{
        const temp_string = this.state.Search_Content
        this.setState({Final_Search_Content: temp_string})
        // alert("搜索内容："+temp_string)
    }

    Handle_Close = () =>{
        this.setState({Search_Content: ''})
    }

    fun_Select_Bar_changed = (new_state) => {
        this.setState({select_Bar_State:new_state})
    }

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <div class='zgw_discover' style={this.props.Main_Style}>
            <SearchBox Search_Box_String_Changed={this.Search_Box_String_Changed} Search_Box_Style={this.props.Search_Box_Style} Search_Box_Palceholder={this.props.Search_Box_Palceholder} Handle_Search={this.Handle_Search} Handle_Close={this.Handle_Close}/>
            <p style={{position: 'absolute', left: '70.85%', top: '4.125%'}}>排序方式</p>
            <SelectBar Select_Bar_Style={{position: 'absolute',left: '77.94%', top: '5.875%', width: '120px', height: '25px', fontSize:'12px'}} Select_Bar_Options={['点赞最多','收藏最多','最新发布']} Select_Bar_Changed={this.fun_Select_Bar_changed}/>
            <DiscoverList Discover_List_Style={this.props.Discover_List_Style} Search_String={this.state.Final_Search_Content} select_Bar_State={this.state.select_Bar_State}/>
            </div>
    }
}
