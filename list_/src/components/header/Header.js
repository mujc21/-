import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'

import './Header.css'

export default class Header extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        addTodo: PropTypes.func.isRequired
    }
    
    //这个东西咱们可以直接拿来处理咱们的键盘输入
    handleKeyUp = (event) => {  
        // 解构赋值获取target, key
        const {target, key} = event
        // 判断是否是回车
        if (key !== 'Enter') {
            return
        }
        // 添加的todo名字不能为空
        if (target.value.trim() === '') {
            alert('输入不能为空')
            return
        }
        // 准备一个todo对象
        // 这个nanoid()用于生成一个不重复的id，需要加头文件（本文件第三行），咱们也可以用
        const todoObj = {id: nanoid(), name: target.value, done: false}
        // 将todoObj传递给App   注意子组件向父组件传值的方法（通过父组件提供的接口）
        this.props.addTodo(todoObj)
        // 清空输入
        target.value = ''
    }

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        return (
            <div className="todo-header">
                <input onKeyUp={this.handleKeyUp} type="text" placeholder="请输入你的任务名称，按回车键确认"/>
            </div>
        )
    }
}
