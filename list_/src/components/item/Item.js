import React, { Component } from 'react'

import './Item.css'

export default class Item extends Component {

    state = {mouse: false}

    // 鼠标移入移出的处理函数
    handleMouse = (flag) => {
        return () => {
            this.setState({mouse: flag})
        }
    }

    // 勾选、取消某一个todo的回调
    handleChange = (id) => {
        return (event) => {
            this.props.updateTodo(id, event.target.checked)
        }
    }

    // 删除一个todo的回调
    handleDelete = (id) => {
        if (window.confirm('确定删除吗？')) { // 此处要加window，否则会报错Unexpected use of 'confirm'.
            this.props.deleteTodo(id)
        }
    }

    render() {
        const {id, name, done} = this.props
        const {mouse} = this.state
        return (
            //注意鼠标移入移出的处理，这在咱们得程序里也常用
            //注意如何实现鼠标移入后删除按钮才会显示出来
            <li style={{backgroundColor: mouse ? '#ddd' : '#fff'}} onMouseEnter={this.handleMouse(true)} onMouseLeave={this.handleMouse(false)}>
                <label>
                    <input type="checkbox" checked={done} onChange={this.handleChange(id)}/>
                    <span>{name}</span>
                </label>
                <button onClick={() => this.handleDelete(id) } className="btn btn-danger" style={{display: mouse ? 'block' : 'none'}}>删除</button>
            </li>
        )
    }
}
