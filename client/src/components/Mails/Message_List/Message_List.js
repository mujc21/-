import React, { Component, useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types'
import './Message_List.css'; // 导入样式文件
import { Link, useParams} from 'react-router-dom';
import BackButton from '../Button/Back_Button'
import TextArea from 'antd/es/input/TextArea'
import axios from 'axios'
import { List } from 'antd'


const MessageList = ({MainStyle, Back_Button_Style = {top: '5.75%', left: '4.07%',}, Message_List_Style = {top: '14%', left: '0px',}, selfAvatar = null, messages, currentUser}) =>{

  let inputRef = useRef(null)
  let scrollContainer = useRef(null)

  const {username} = useParams()
  const [inputValue, setInputValue] = useState('')
  const [users, setUsers] = useState({})
  const [chat_messages, setChat_messages] = useState([])

  const handleAttentionPageAvatar = (username) => {
    const our_url = "/api/mypageavatar/" + username;

    return new Promise((resolve, reject) => {
        axios.get(our_url, {
            responseType: 'arraybuffer'
        })
        .then(res => {
            if (res.data === "数据库查询失败") {
                alert("数据库查询失败");
                resolve('');
            } else if (res.data === "该用户不存在") {
                alert("该用户不存在");
                resolve('');
            } else {
                const blob = new Blob([res.data], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                // ipcRenderer.send('start-download', url)
                resolve(url);
            }
        })
        .catch(e => {
            alert("404 handleMyPageAvatar响应失败: " + e.message);
            resolve('');
        });
    });
  };

  const handleAttentionList = async () => {
      const avatar = await handleAttentionPageAvatar(username)
      const chat_messages = await handleGetChatMessages(currentUser, username)
      setUsers({username: username, avatar: avatar}) 
      setChat_messages(chat_messages)
  }

  const handleGetChatMessages = async (username,ano_username) => {  //username是当前用户，ano_username是他在和谁聊天
    return new Promise((resolve, reject) =>{
        axios.post("/api/fnyGetChatMessages",{
            username,ano_username
        })
        .then(res=>{
        if(res.data.text === "error when finding user"){
            alert("错误：找不到用户")
            resolve(null)
        }
        else if(res.data.text === "user not found"){
            alert("用户不存在")
            resolve(null)
        }
        else if(res.data.text === "error when searching chat message"){
            alert("错误：查询聊天记录失败")
            resolve(null)
        }
        else if(res.data.text === "successful"){
            resolve(res.data.chat_message)
        }
        })
        .catch(e=>{
            alert("404 fnyGetChatMessages响应失败: " + e.message);
            resolve(null)
        })
    })
  };

  const handleAddChatMessage = async (username,ano_username,text) => {  //username是当前用户，ano_username是他在和谁聊天
    try{
      await axios.post("/api/fnyAddChatMessage",{
        username,ano_username,text
      })
      .then(res=>{
        if(res.data === "error when finding user"){
          alert("错误：找不到用户")
          return
        }
        else if(res.data === "user not found"){
          alert("用户不存在")
          return
        }
        else if(res.data === "insert error"){
          alert("错误：记录聊天信息失败")
          return
        }
        else if(res.data === "successful"){
          return
        }
      })
      .catch(e=>{
        alert("404 fnyAddChatMessage响应失败: " + e.message);
      })
    }
    catch{
      
    }
    finally{
      
    }
  };


  useEffect(() => {
    if(scrollContainer.current){{
        scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
      }
    }
  }, [chat_messages.length])

  useEffect(() => {
    handleAttentionList()
    const timer = setInterval(() => {
      updateChat()
    }, 6000);
    return () => clearInterval(timer);
  }, [])

  const updateChat = async() => {
    const chat_messages1 = await handleGetChatMessages(currentUser, username)
    if(chat_messages1 !== null && chat_messages1.length !== chat_messages.length){
      setChat_messages(chat_messages1)
    }
  }

  const send = async (e) =>{
    e.preventDefault()
    e.stopPropagation()
    if (inputValue !== ''){
      // setFilteredMessages(prevArray => [{id: prevArray[0].id, username: prevArray[0].username, message: [...prevArray[0].message, {id: prevArray[0].message.length + 1, sender: '', chat: inputValue}], avatar: prevArray[0].avatar}])
      await handleAddChatMessage(currentUser, username, inputValue);
      const chat_messages = await handleGetChatMessages(currentUser, username)
      const username1 = users.username
      const avatar = users.avatar
      setUsers({username: username1, avatar: avatar}) 
      setChat_messages(chat_messages)
      setInputValue('')
    }
  }

  const handleChange = (e) =>{
    setInputValue(e.target.value)
  }
  
  return (
    <div class='zgw_Message_List' style={MainStyle}>
        <Link to='/mails'>
          <BackButton  Back_Button_Style = {Back_Button_Style}/>
        </Link>
        <label class = 'zgw_Username'>{username}</label>
        {chat_messages.length === 0 ?
            <ul style={Message_List_Style} class='chat_box' ref={scrollContainer}/>
        :
        <ul style={Message_List_Style} class='chat_box' ref={scrollContainer}>
            {chat_messages.map((chatItem) =>(
              <li>
              {chatItem.send_or_receive === 0 ? (
                <div className={chatItem.send_or_receive === 0 ? 'own-message' : 'other-message'}>
                  <p className="message2">{chatItem.content}</p>
                  <img src={`${selfAvatar}`} class="avatar2"/>
                </div>
              ) : (
                <div className={chatItem.send_or_receive === 0 ? 'own-message' : 'other-message'}>
                  <Link to={`/My/users/${username}`}>
                    <img src={`${users.avatar}`} class="avatar1"/>
                  </Link>
                  <p className="message1">{chatItem.content}</p>
                </div>
              )}
            </li>
            ))}
        </ul>
        }
        <TextArea style={{position:'absolute', width: '100%', marginBottom:'-1px', top:'87.8vh', height: '12vh', borderRadius:'0px', borderWidth:'1px', borderColor: 'darkgray',}} placeholder='请输入...' ref={inputRef} value={inputValue} onPressEnter={send} onChange={handleChange}/>
    </div>
  );
}

MessageList.propTypes = {
  MainStyle: PropTypes.object,
  Back_Button_Style: PropTypes.object,
  Message_List_Style: PropTypes.object,
  avatar: PropTypes.string,
  messages: PropTypes.object,
  selfAvatar: PropTypes.object,
}

export default MessageList;

