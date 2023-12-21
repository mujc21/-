import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './User_List.css'; // 导入样式文件
import { Link } from 'react-router-dom';

const UserList = ({UserListStyle, users, Set_Last_URL, Last_URL}) => {
    const linkStyle = {
        textDecoration: 'none', // 不显示下划线
        color: 'inherit'
    };
    return (
        <>  
            <ul className="user-list" style={UserListStyle}>
                {users.map((userItem) => (
                <Link to={`/My/users/${userItem.username}`} style={linkStyle}>
                    <li key={userItem.id} class="user-item">
                        <div class="avatar_users" style={{backgroundImage: `url(${userItem.avatar})`}}></div>
                        <div class="user-content">
                          <p class="username_Users">{userItem.username}</p>
                        </div>
                    </li>
                </Link>

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

