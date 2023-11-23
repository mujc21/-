import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Item from '../item/Item'

import './list.css'

export default class List extends Component {

    // 对接收的props进行类型、必要性的限制
    static propTypes = {
        todoList: PropTypes.array.isRequired,
        updateTodo: PropTypes.func.isRequired,
        deleteTodo: PropTypes.func.isRequired
    }

    render() {
        // 又是这个奇怪的语法，获取props传来的信息
        const {todoList, updateTodo, deleteTodo} = this.props
        // 注意这段return语法，map同样可以用于不确定元素有多少个时，这在咱们得程序中也很常见
        return (
            <ul className="todo-main">
                {
                    //注意下面的写法
                    todoList.map((todo) => { 
                        return <Item key={todo.id} {...todo} updateTodo={updateTodo} deleteTodo={deleteTodo}/>
                        //注：todo里包含id,name,done，{...todo}会把它们三个拆出来，这也就是Item中可以使用props.name的原因
                    })
                }
            </ul>
        )
    }
}
