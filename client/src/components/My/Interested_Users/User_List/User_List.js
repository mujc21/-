import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import './User_List.css'; // 导入样式文件
import { Link } from 'react-router-dom';
import axios from 'axios'
import { Button, ConfigProvider } from 'antd'

const UserList = ({UserListStyle, currentUser, currentEnter}) => {

    const [users, setUsers] = useState([]);

    async function handleAttentionListNumber(username){
        const myurl = 'http://43.138.68.84:8082/api/AttentionListNumber/' + username
        return new Promise((resolve, reject) => {
          axios.get(myurl)
          .then(res => {
              if (res.data === "数据库查询失败") {
                
                resolve(null);
              } 
              else{
                const num_following = res.data.num_following;
                resolve(num_following)
              }
          })
          .catch(e => {
              
              resolve(null);
          });
        });
    }

    async function handleAttentionListAvatar(username, ordinal){
        const myurl = 'http://43.138.68.84:8082/api/AttentionListAvatar/' + username + '/' + ordinal
        return new Promise((resolve, reject) => {
            axios.get(myurl,{
                responseType: 'arraybuffer'
            })
            .then(res => {
              if (res.data === "数据库查询失败") {
                
                resolve(null);
              } 
              else{
                const blob = new Blob([res.data], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                resolve(url)
              }
            })
            .catch(e => {
              
              resolve(null);
            });
        });
    }

    async function handleAttentionListUsername(username, ordinal){
        const myurl = 'http://43.138.68.84:8082/api/AttentionListUsername/' + username + '/' + ordinal
        return new Promise((resolve, reject) => {
            axios.get(myurl)
            .then(res => {
              if (res.data === "数据库查询失败") {
                
                resolve(null);
              } 
              else{
                const username = res.data.username;
                resolve(username)
              }
            })
            .catch(e => {
              
              resolve(null);
            });
        });
    }

    async function handleWhetherIOrAttentionOrNeither(anothername, myname){
      if(anothername === myname){
        return 'myself'
      }
      const myurl = 'http://43.138.68.84:8082/api/listwhetherattention/' + anothername + '/' + myname
      return new Promise((resolve, reject) => {
        axios.get(myurl)
          .then(res => {
            if (res.data === "数据库查询失败") {
              
              resolve(null);
            } 
            else{
              const whether_attention = res.data.whether_attention;
              resolve(whether_attention)
            }
          })
          .catch(e => {
            
            resolve(null);
          });
      })
    }

    async function handleAddOrDelete(add_or_delete, anothername, username){
      const our_url = "http://43.138.68.84:8082/api/listAttention";
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
                  
                  return
              }
          })
          .catch(e=>{
              
              return
          })
      }
      catch{
          
          return
      }
    }

    async function handleAttentionList(){
        const totalNumber = await handleAttentionListNumber(currentEnter)
        for(let i = 1; i <= totalNumber; i++){
          const username = await handleAttentionListUsername(currentEnter, i)
          const avatar = await handleAttentionListAvatar(currentEnter, i)
          const whether_attention = await handleWhetherIOrAttentionOrNeither(username, currentUser)
          setUsers(prevUsers => [...prevUsers, {username: username, avatar: avatar, whether_attention: whether_attention}]) 
        }
    }

    async function handleAttention (add_or_delete, postID, username) {
      const our_url = "http://43.138.68.84:8082/api/Attention";
      try{
          await axios.post(our_url,{add_or_delete, postID, username})
          .then(res=>{
              if(res.data === "successful"){
                  return 1
              }
              else{
                  
                  return 0
              }
          })
          .catch(e=>{
              
              return 0
          })
      }
      catch{
          
          return 0
      }
    };

    useEffect(() => {
      handleAttentionList()
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
                        <img class="avatar_users" src={userItem.avatar}></img>
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

UserList.propTypes = {
    UserListStyle: PropTypes.object,
    users: PropTypes.object,
}
export default UserList;
