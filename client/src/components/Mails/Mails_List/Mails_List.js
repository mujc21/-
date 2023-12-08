import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './Mails_List.css'; // 导入样式文件
import { Link } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';

export default class MailsList extends Component {
    static propTypes = {
        MailsListStyle: PropTypes.object,
        messages: PropTypes.object,
    }
    render() {       //from database!!!!!
        const messages = this.props.messages
        // const totalHeight = 129 + messages.length * 121;

        const linkStyle = {
            textDecoration: 'none', // 不显示下划线
            color: 'inherit'
        };

        return (
        <>
            <ul className="message-list" style={this.props.MailsListStyle}>
                {messages.map((messageItem) => (
                <Link to={`/mails/${messageItem.username}`} style={linkStyle}>
                    <li key={messageItem.id} class="message-item">
                        <div class="avatar" style={{backgroundImage: `url(${messageItem.avatar})`}}></div>
                        <div class="message-content">
                        <p class="username">{messageItem.username}</p>
                        <p class="message">{messageItem.message.length > 0 ? messageItem.message[messageItem.message.length - 1].chat : ''}</p>
                        </div>
                    </li>
                </Link>

                ))}
            </ul>
            {/* <div className="footer" style={{top: totalHeight + 'px', left: '515px'}}>
                <p>没有更多邮件了</p>
            </div> */}
        </>
        );
    }
}


