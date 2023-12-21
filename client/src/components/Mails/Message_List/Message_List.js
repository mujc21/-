import React, { Component, useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types'
import './Message_List.css'; // 导入样式文件
import { Link, useParams} from 'react-router-dom';
import BackButton from '../Button/Back_Button'
import TextArea from 'antd/es/input/TextArea';


const MessageList = ({MainStyle, Back_Button_Style = {top: '5.75%', left: '4.07%',}, Message_List_Style = {top: '14%', left: '0px',}, self_info = null, messages}) =>{

  let inputRef = useRef(null)
  let scrollContainer = useRef(null)

  const {username} = useParams()
  const [inputValue, setInputValue] = useState('')
  const [filteredMessages, setFilteredMessages] = useState(messages.filter(message => message.username === username))


  useEffect(() => {
    if(scrollContainer.current){{
        scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
      }
    }
  }, [filteredMessages])

  const send = (e) =>{
    if (inputValue !== ''){
      setFilteredMessages(prevArray => [{id: prevArray[0].id, username: prevArray[0].username, message: [...prevArray[0].message, {id: prevArray[0].message.length + 1, sender: '', chat: inputValue}], avatar: prevArray[0].avatar}])
      setInputValue('')
    }
    e.preventDefault()
    e.stopPropagation()
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
        <ul style={Message_List_Style} class='chat_box' ref={scrollContainer}>
            {filteredMessages.map(filteredMessage => (filteredMessage.message.map((chatItem) =>(
              <li key={chatItem.id} className={chatItem.sender !== username ? 'own-message' : 'other-message'}>
              {chatItem.sender === '' ? (
                <>
                  <p className="message2">{chatItem.chat}</p>
                  <img src={`${self_info.avatar}`} class="avatar2"/>
                </>
              ) : (
                <>
                  <img src={`${chatItem.avatar}`} class="avatar1"/>
                  <p className="message1">{chatItem.chat}</p>
                </>
              )}
            </li>
            ))
            ))}
        </ul>
        <TextArea style={{position:'absolute', width: '100%', marginBottom:'-1px', marginLeft:'-0.5px', top:'87.8vh', height: '12vh', borderRadius:'0px', borderWidth:'1.5px', borderColor: 'darkgray',}} placeholder='请输入...' ref={inputRef} value={inputValue} onPressEnter={send} onChange={handleChange}/>
    </div>
  );
}

MessageList.propTypes = {
  MainStyle: PropTypes.object,
  Back_Button_Style: PropTypes.object,
  Message_List_Style: PropTypes.object,
  avatar: PropTypes.string,
  messages: PropTypes.object,
  self_info: PropTypes.object,
}

export default MessageList;

