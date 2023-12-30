import React, { Component, useEffect, } from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation, useNavigate, useParams} from 'react-router-dom';

import './Users.css'

import FanList from './User_List/User_List'
import BackButton from './Button/Back_Button';

const Fans = ({Main_Style, User_List_Style, currentUser, currentEnter, Back_Button_Style}) => {

    const navigate = useNavigate()
    const {username} = useParams()
    const handleButtonClick = () => {
        navigate(-1)
    }
    return ( currentEnter !== null ?
    <div class='zgw_Users' style={Main_Style}>
    <BackButton Back_Button_Style = {Back_Button_Style} handleButtonClick={handleButtonClick}/>
    <p class='focus'>粉丝列表</p>
    <FanList UserListStyle={User_List_Style} currentEnter={currentEnter} currentUser={currentUser}/>
    </div>
    :
    <div class='zgw_Users' style={Main_Style}>
    <BackButton Back_Button_Style = {Back_Button_Style} handleButtonClick={handleButtonClick}/>
    <p class='focus'>粉丝列表</p>
    <FanList UserListStyle={User_List_Style} currentEnter={username} currentUser={currentUser}/>
    </div>
    );
}

Fans.propTypes = {
    MainStyle: PropTypes.object, 
    User_List_Style: PropTypes.object,
    User_List: PropTypes.object,
    Back_Button_Style: PropTypes.object,
}

Fans.defaultProps = {
    User_List_Style:{
        top: '14%',
        left: '0px',
    },

    Back_Button_Style: {top: '6%', left: '4%',}
}

export default Fans;