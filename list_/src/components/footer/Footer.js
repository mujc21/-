import React, { Component } from 'react'

import './Footer.css'

export default class Footer extends Component {

    // 子组件向父组件传信息，使用props提供好的接口
    handleChangeAll = (event) => {
        this.props.checkAllTodo(event.target.checked)
    }

    // 清除已完成任务的回调
    handleClearAll = () => {
        this.props.clearAllDoneTodo()
    }

    render() {
        //奇怪的语法，获取父组件传来的todoList
        const {todoList} = this.props

        // ruduce函数：通常用于累加。reduce((pre, currentTodo) => pre + (currentTodo.done ? 1 : 0), 0)中
        // 箭头“=>”前的(pre, currentTodo)中，pre是本次操作前的值，currentTodo是当前被操作的数组元素
        // pre + (currentTodo.done ? 1 : 0)是执行的操作。此处含义为如果done==true则加1
        // 最后的0指定pre的初始值
        // 已完成的个数
        const doneCount = todoList.reduce((pre, currentTodo) => pre + (currentTodo.done ? 1 : 0), 0)

        // 总数
        const total = todoList.length

        //注意子组件向父组件传值和一些其他的语法
        return (
            <div className="todo-footer">
                <label>
                    <input type="checkbox" onChange={this.handleChangeAll} checked={doneCount === total && total !== 0}/>
                </label>
                <span>
                    <span>已完成{doneCount}</span> / 全部{total}
                </span>
                <button onClick={this.handleClearAll} className="btn btn-danger">清除已完成任务</button>
            </div>
        )
    }
}
