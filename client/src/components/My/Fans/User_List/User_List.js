import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import './User_List.css'; // 导入样式文件
import { Link } from 'react-router-dom';
import axios from 'axios'
import { Button, ConfigProvider } from 'antd'

const FanList = ({UserListStyle, currentUser, currentEnter}) => {

    const [users, setUsers] = useState([]);

    async function handleFansNumber(username){
        const myurl = '/api/FansNumber/' + username
        return new Promise((resolve, reject) => {
          axios.get(myurl)
          .then(res => {
              if (res.data === "数据库查询失败") {
                alert("数据库查询失败");
                resolve(null);
              } 
              else{
                const num_fans = res.data.num_fans;
                resolve(num_fans)
              }
          })
          .catch(e => {
              alert("404 handleAttentionListNumber响应失败: " + e.message);
              resolve(null);
          });
        });
    }

    async function handleFansAvatar(username, ordinal){
        const myurl = '/api/FansAvatar/' + username + '/' + ordinal
        return new Promise((resolve, reject) => {
            axios.get(myurl,{
                responseType: 'arraybuffer'
            })
            .then(res => {
              if (res.data === "数据库查询失败") {
                alert("数据库查询失败");
                resolve(null);
              } 
              else{
                const blob = new Blob([res.data], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                resolve(url)
              }
            })
            .catch(e => {
              alert("404 handleAttentionListAvatar响应失败: " + e.message);
              resolve(null);
            });
        });
    }

    async function handleFansUsername(username, ordinal){
        const myurl = '/api/FansUsername/' + username + '/' + ordinal
        return new Promise((resolve, reject) => {
            axios.get(myurl)
            .then(res => {
              if (res.data === "数据库查询失败") {
                alert("数据库查询失败");
                resolve(null);
              } 
              else{
                const username = res.data.username;
                resolve(username)
              }
            })
            .catch(e => {
              alert("404 handleAttentionListUsername响应失败: " + e.message);
              resolve(null);
            });
        });
    }

    async function handleWhetherIOrAttentionOrNeither(anothername, myname){
      if(anothername === myname){
        return 'myself'
      }
      const myurl = '/api/listwhetherattention/' + anothername + '/' + myname
      return new Promise((resolve, reject) => {
        axios.get(myurl)
          .then(res => {
            if (res.data === "数据库查询失败") {
              alert("数据库查询失败");
              resolve(null);
            } 
            else{
              const whether_attention = res.data.whether_attention;
              resolve(whether_attention)
            }
          })
          .catch(e => {
            alert("404 handleAttentionListUsername响应失败: " + e.message);
            resolve(null);
          });
      })
    }

    async function handleAddOrDelete(add_or_delete, anothername, username){
      const our_url = "/api/listAttention";
      try{
          await axios.post(our_url,{add_or_delete, anothername, username})
          .then(res=>{
              if(res.data === "successful"){
                const updatedUserList = users.map(user =>
                  user.username === anothername
                    ? { ...user, whether_attention: 1 - user.whether_attention}
                    : user
                );
                setUsers(updatedUserList)
                return
              }
              else{
                  alert("关注各种失败了")
                  return
              }
          })
          .catch(e=>{
              alert("404 响应失败")
              return
          })
      }
      catch{
          alert("404 响应失败")
          return
      }
    }

    async function handleFansList(){
        const totalNumber = await handleFansNumber(currentEnter)
        for(let i = 1; i <= totalNumber; i++){
            const avatar = await handleFansAvatar(currentEnter, i)
            const username = await handleFansUsername(currentEnter, i)
            const whether_attention = await handleWhetherIOrAttentionOrNeither(username, currentUser)
            setUsers(prevUsers => [...prevUsers, {username: username, avatar: avatar, whether_attention: whether_attention}]) 
        }
    }

    async function handleAttention(add_or_delete, postID, username){
      const our_url = "/api/fnyAttention";
      try{
          await axios.post(our_url,{add_or_delete, postID, username})
          .then(res=>{
              if(res.data === "successful"){
                  return 1
              }
              else{
                  alert("关注各种失败了")
                  return 0
              }
          })
          .catch(e=>{
              alert("404 响应失败")
              return 0
          })
      }
      catch{
          alert("404 响应失败")
          return 0
      }
    };

    useEffect(() => {
      handleFansList()
    }, [])

    const linkStyle = {
        textDecoration: 'none', // 不显示下划线
        color: 'inherit'
    };
    return (
        <>  
            <ul className="user-list" style={UserListStyle}>
                {users.map((userItem) => (
                    <li class="user-item">
                      <Link to={`/My/users/${userItem.username}`} style={linkStyle}>
                        <div class="avatar_users" style={{backgroundImage: `url(${userItem.avatar})`}}></div>
                      </Link>
                        <div class="user-content">
                          <p class="username_Users">{userItem.username}</p>
                        </div>
                        {userItem.whether_attention === 1 && <ConfigProvider autoInsertSpaceInButton={false}> <Button style={{marginRight: '50px'}} onClick={() => {handleAddOrDelete(1, userItem.username, currentUser)}} danger>取消关注</Button> </ConfigProvider>}
                        {userItem.whether_attention === 0 && <ConfigProvider autoInsertSpaceInButton={false}> <Button style={{marginRight: '50px'}} onClick={() => {handleAddOrDelete(0, userItem.username, currentUser)}} type="primary">关注</Button> </ConfigProvider>}
                    </li>
                ))}
            </ul>
        </>
        );
    
}

FanList.propTypes = {
    UserListStyle: PropTypes.object,
    users: PropTypes.object,
}
export default FanList;
