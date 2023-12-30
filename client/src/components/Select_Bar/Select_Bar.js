import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'

import './Select_Bar.css'

export default class SelectBar extends Component {

    state ={
        current_value: '',
    }
    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        Select_Bar_Options: PropTypes.array,
        Select_Bar_Changed: PropTypes.func,
        Select_Bar_Style: PropTypes.object,
    }

    static defaultProps = {
        Select_Bar_Options: ['点赞最多','收藏最多'],
        Select_Bar_Style: {
            position: 'relative',
            top: '30px',
            left: '45px',
        },
    }
    
    //注意这个回调方法
    //this.setState({current_value: e.target.value})
    //this.props.Select_Bar_Changed(e.target.value)
    //上面这样写是不行的，必须使用下面这个方法
    handle_change = (e) => {
        const new_value= e.target.value  //这一步一定不能省，涉及到异步更新等问题，我也没弄懂，总之不能删
        this.setState(() => ({  //括号里的prevState,prevProps可删去
            current_value: new_value
        }),()=> {
            this.props.Select_Bar_Changed(new_value)
        })
    }

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return <select class="fny_select" style={this.props.Select_Bar_Style} onChange={this.handle_change}> 
                {
                    //注意下面的写法
                    this.props.Select_Bar_Options.map((one_option) => { 
                        return <option value={one_option}>{one_option}</option>  
                    })
                }
            </select>
    }
}
