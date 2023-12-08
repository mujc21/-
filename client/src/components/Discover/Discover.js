import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Discover.css'

import SearchBox from '../Search_Box/Search_Box'
import SelectBar from '../Select_Bar/Select_Bar'
import DiscoverList from './Discover_List/Discover_List'

export default class Discover extends Component {

    componentDidMount(){
        const sortedItems = [...this.state.items].sort((a, b) => b.thumb - a.thumb);
        this.setState({ items: sortedItems });   
        if(this.props.resetInitialJump !== null){
            this.props.resetInitialJump();
        }
    }
    state = {
        Search_Content: '',
        Final_Search_Content: '',
        select_Bar_State: '点赞最多',
        items: [
            { id: 1, avatar: 'Ite1', user: 'Ite1', text: 'Ite1', thumb: 1, img:'Ite1', store: 9, time: 9},
            { id: 2, avatar: 'Ite2', user: 'Ite2', text: '', thumb: 2, img:'Ite1', store: 8, time: 8},
            { id: 3, avatar: 'Ite3', user: 'Ite3', text: 'Ite3', thumb: 3, img:'Ite1', store: 7, time: 7},
            { id: 4, avatar: 'Ite4', user: 'Ite4', text: 'Ite4', thumb: 4, img:'Ite1', store: 6, time: 6},
            { id: 5, avatar: 'Ite5', user: 'Ite5', text: 'Ite5', thumb: 5, img:'Ite1', store: 5, time: 5},
            { id: 6, avatar: 'Ite5', user: 'Ite6', text: 'Ite4', thumb: 6, img:'Ite1', store: 4, time: 4},
            { id: 7, avatar: 'Iteg', user: 'Ite7', text: 'Ite6', thumb: 7, img:'Ite1', store: 3, time: 3},
            { id: 8, avatar: 'Iteg', user: 'Ite8', text: 'Ite6', thumb: 8, img:'Ite1', store: 2, time: 2},
            { id: 9, avatar: 'Iteg', user: 'Ite9', text: 'Ite7', thumb: 9, img:'Ite1', store: 1, time: 1},
            // 添加更多项
            ],
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
            top: '30px',
            left: '270px',
            width: '449px',
            borderRadius: '0px',
            borderWidth: '3px',
            height: '40px',
        },
        Search_Input_Palceholder: '搜索...',

        Discover_List_Style:{
            top: '112px',
            left: '0px',
        },

        resetInitialJump: null,
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
        if (new_state === '点赞最多'){
            const sortedItems = [...this.state.items].sort((a, b) => b.thumb - a.thumb);
            this.setState({ items: sortedItems });
        }
        else if (new_state === '收藏最多'){
            const sortedItems = [...this.state.items].sort((a, b) => b.store - a.store);
            this.setState({ items: sortedItems });
        }
        else if (new_state === '最新发布'){
            const sortedItems = [...this.state.items].sort((a, b) => a.time - b.time);
            this.setState({ items: sortedItems });
        }
        this.setState({select_Bar_State:new_state})
    }

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <div class='zgw_discover' style={this.props.Main_Style}>
            <SearchBox Search_Box_String_Changed={this.Search_Box_String_Changed} Search_Box_Style={this.props.Search_Box_Style} Search_Box_Palceholder={this.props.Search_Box_Palceholder} Handle_Search={this.Handle_Search} Handle_Close={this.Handle_Close}/>
            <p style={{position: 'absolute', left: '800px', top: '33px'}}>排序方式</p>
            <SelectBar Select_Bar_Style={{position: 'absolute',left: '880px', top: '47px', width: '120px', height: '25px', fontSize:'12px'}} Select_Bar_Options={['点赞最多','收藏最多','最新发布']} Select_Bar_Changed={this.fun_Select_Bar_changed}/>
            <DiscoverList Discover_List_Style={this.props.Discover_List_Style} Search_String={this.state.Final_Search_Content} Items={this.state.items}/>
            </div>
    }
}
