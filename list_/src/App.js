import React, { Component } from 'react'

import Header from './components/header/Header'
import List from './components/list/list'
import Footer from './components/footer/Footer'

import './App.css'

export default class App extends Component {

  // 在运行过程中会因事件发生改变的数据要放到state里
  state = {todoList:[
      {id: '1', name: '吃饭', done: true},
      {id: '2', name: '睡觉', done: true},
      {id: '3', name: '写代码', done: false}
  ]}

  //组件的拆分：每个部分是一个组件。本程序拆分了Header,Footer,List,Item组件，这样可以分别对它们进行定义，
  //并且组合很方便。这对于合作也很重要。在后面的程序中可以理解到组件的使用。

  //注意：关于this指针的问题。类似于面向对象，我们需要时刻确定this指针指向正确的地方。
  //在组件之间通信时这非常重要。每个组件都有自己的this指针，如果出错无法调用正确的函数。
  //处理this指针问题有四种方法，以下使用的是最常用的一种，注意以下的几个函数定义形式都是“箭头函数”，
  //即fun=(arg)=>{ ... } 的形式。这样就基本不用再为this操心了。

  // addTodo用于添加一个todo，接收的参数是类似{id: '1', name: '吃饭', done: true}的todo对象
  addTodo = (todoObj) => {
      // 获取原todoList
      const {todoList} = this.state
      // 加一个todo
      const newTodos = [todoObj, ...todoList]  //...用于将一个对象“展开”得到很多对象
      // 更新状态只能用setState函数
      this.setState({todoList: newTodos})
  }

  // updateTodo用于更新一个todo对象
  updateTodo = (id, done) => {
      // 获取状态中的todoList
      const {todoList} = this.state
      const newTodos = todoList.map((todoObj) => {  //map函数用于实现循环遍历数组中的每个元素
                                                    //map的返回值是个大小不变的数组，每个元素都经过了定义的操作
          if (todoObj.id === id) {
              return {...todoObj, done: done}  //...将todoObj展开，其中的done被覆盖为新的done
          } else {
              return todoObj
          }
      })
      this.setState({todoList: newTodos})
  }

  // deleteTodo用于删除一个todo对象
  deleteTodo = (id) => {
      // 获取原todoList
      const {todoList} = this.state
      // 删除指定id的todo对象
      const newTodos = todoList.filter((todoObj) => {  //map循环，filter过滤。filter过滤掉数组里不符合条件的元素
                                                       //注意map里的return是数组里的一个元素，filter的return是个bool
          return todoObj.id !== id
      })
      this.setState({todoList: newTodos})
  }

  // checkAllTodo用于todo对象的全选
  checkAllTodo = (done) => {
      const {todoList} = this.state
      const newTodos = todoList.map((todoObj) => { return {...todoObj, done:done} })
      this.setState({todoList: newTodos})
  }

  // clearAllDoneTodo用于清除所有已完成任务
  clearAllDoneTodo = () => {
      const {todoList} = this.state
      const newTodos = todoList.filter((todoObj) => { return !todoObj.done })
      this.setState({todoList: newTodos})
  }


  //网页渲染时实际上仅仅渲染了此函数return的内容。各个部分都是组件，这就实现了拆分和合并。
  //父子组件间传递值。父组件通过添加属性来给子组件传值（比如下文的todoList={todoList} updateTodo={this.updateTodo}等）
  //子组件可以通过props来读取传来的数据（具体见各个组件的代码）
  //再次注意this指针的问题，由于前面使用了箭头函数，这里就很方便了，直接updateTodo={this.updateTodo}这样的写法就可以。
  render() {
      const {todoList} = this.state
      return (
          <div className="todo-container">
              <div className="todo-wrap">
                  <Header addTodo={this.addTodo}/>
                  <List todoList={todoList} updateTodo={this.updateTodo} deleteTodo={this.deleteTodo}/>
                  <Footer todoList={todoList} checkAllTodo={this.checkAllTodo} clearAllDoneTodo={this.clearAllDoneTodo}/>
              </div>
          </div>
      )
  }
}