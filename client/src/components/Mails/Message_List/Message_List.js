import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './Message_List.css'; // 导入样式文件
import { Link, useParams} from 'react-router-dom';
import BackButton from '../Button/Back_Button'


const MessageList = ({MainStyle, Back_Button_Style = {top: '46px', left: '46px',}, Message_List_Style = {top: '112px', left: '0px',}, self_info = null, messages}) =>{
  MessageList.propTypes = {
    MainStyle: PropTypes.object,
    Back_Button_Style: PropTypes.object,
    Message_List_Style: PropTypes.object,
    avatar: PropTypes.string,
    messages: PropTypes.object,
    self_info: PropTypes.object,
  }
  const {username} = useParams()
  const filteredMessages = messages.filter(message => message.username === username)
  return (
    <div class='zgw_Message_List' style={MainStyle}>
        <Link to='/mails'>
          <BackButton  Back_Button_Style = {Back_Button_Style}/>
        </Link>
        <label class = 'zgw_Username'>{username}</label>
        <ul style={Message_List_Style} class='chat_box'>
            {filteredMessages.map(filteredMessage => (filteredMessage.message.map((chatItem) =>(
              <li key={chatItem.id} className={chatItem.sender !== username ? 'own-message' : 'other-message'}>
              {chatItem.sender === '' ? (
                <>
                  <p className="message2">{chatItem.chat}</p>
                  <div className="avatar2" style={{ backgroundImage: `url(${self_info.avatar})`, backgroundSize: 'cover'}}></div>
                </>
              ) : (
                <>
                  <div className="avatar1" style={{ backgroundImage: `url(${chatItem.avatar})`, backgroundSize: 'cover'}}></div>
                  <p className="message1">{chatItem.chat}</p>
                </>
              )}
            </li>
            ))
            ))}
        </ul>
    </div>
  );
}
export default MessageList;

// class MessageListWithoutUsername extends Component {
//     static propTypes = {
//         MainStyle: PropTypes.object,
//         Back_Button_Style: PropTypes.object,
//         Message_List_Style: PropTypes.object,
//         avatar: PropTypes.string,
//         messages: PropTypes.object,
//     }

//     static defaultProps = {
//         Message_List_Style:{
//             top: '112px',
//             left: '0px',
//         },
//         Back_Button_Style:{
//             top: '46px',
//             left: '46px',
//         },
//     }
//     render() {   //from database!!!!!
//       const {username} = this.props
//       const filteredMessages = messages.filter(message => message.username === username)

//       return (
//           <div class='zgw_Message_List' style={MainStyle}>
//               <Link to='/mails'>
//                 <BackButton  Back_Button_Style = {Back_Button_Style}/>
//               </Link>
//               <label class = 'zgw_Username'>User1</label>
//               <ul style={Message_List_Style} class='chat_box'>
//                   {filteredMessages.message.map((message) => (
//                   <li key={message.id} className={message.sender === 'User1' ? 'own-message' : 'other-message'}>
//                   {message.sender !== '' ? (
//                     <>
//                       <p className="message2">{message.message}</p>
//                       <div className="avatar2" style={{ backgroundImage: `url(path/to/${message.sender}.jpg)` }}></div>
//                     </>
//                   ) : (
//                     <>
//                       <div className="avatar1" style={{ backgroundImage: `url(${message.avatar})`, backgroundSize: 'cover'}}></div>
//                       <p className="message1">{message.message}</p>
//                     </>
//                   )}
//                 </li>
//                   ))}
//               </ul>
//           </div>
//       );
//     }
// }
// const MessageList = WithUsername(MessageListWithoutUsername);
