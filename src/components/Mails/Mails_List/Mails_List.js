import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './Mails_List.css'; // 导入样式文件
import { Link } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';
import axios from 'axios'

export default class MailsList extends Component {
    static propTypes = {
        MailsListStyle: PropTypes.object,
        messages: PropTypes.object,
    }

    state = {
        users: [],
        two_side_attention_list: []  //查询结果会放到这里，每个元素是一个用户名
        // {
        //   send_or_receive: 1,  //0表示发，1表示收
        //   content:item.message_content,  //一句话的内容
        //   send_time:item.send_time  //发送时间
        // }
    }

    //给出用户，返回所有与他互关的人
    handleGetUserTwoSideAttentionList = async (username) => {
        return new Promise((resolve, reject) => {
            axios.post("/api/fnyGetTwoSideAttentionList",{
                username
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
                else if(res.data.text === "error when searching Attentioned users"){
                    alert("错误：查找关注信息失败")
                    resolve(null)
                }
                else if(res.data.text === "successful"){
                    resolve(res.data.two_side_attention_list)
                }
            })
            .catch(e=>{
                alert("404 fnyGetTwoSideAttentionList响应失败: " + e.message);
            })
        })
    };

    handleAttentionPageAvatar = (username) => {
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

    handleAttentionList = async () => {
        const two_side_attention_list = await this.handleGetUserTwoSideAttentionList(this.props.currentUser)
        for(let i = 0; i < two_side_attention_list.length; i++){
            const username = two_side_attention_list[i]
            const avatar = await this.handleAttentionPageAvatar(two_side_attention_list[i])
            const chat_messages = await this.handleGetLastChatMessage(this.props.currentUser, username)
            this.setState((prevState) => {
                this.setState({users: [...prevState.users, {username: username, avatar: avatar, chat_messages: chat_messages}]})
            })
        }
    }

    handleGetLastChatMessage = async (username, ano_username) => {  //username是当前用户，ano_username是他在和谁聊天

        return new Promise((resolve, reject) =>{
            axios.post("/api/fnyGetLastChatMessage",{
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

    componentDidMount(){
        this.handleAttentionList()
    }

    render() {       //from database!!!!!
        const users = this.state.users
        // const totalHeight = 129 + messages.length * 121;

        const linkStyle = {
            textDecoration: 'none', // 不显示下划线
            color: 'inherit'
        };

        return (
        <>
            <ul className="message-list" style={this.props.MailsListStyle}>
                {users.map((messageItem) => (
                <Link to={`/mails/${messageItem.username}`} style={linkStyle}>
                    <li class="message-item">
                        <Link to={`/My/users/${messageItem.username}`}>
                          <img src={`${messageItem.avatar}`} class="avatar"/>
                        </Link>
                        <div class="message-content">
                        <p class="username">{messageItem.username}</p>
                        <p class="message">{messageItem.chat_messages !== '' ? messageItem.chat_messages.content : ''}</p>
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


