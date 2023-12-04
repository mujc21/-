import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Reported_List.css'
import OneReportedUser from '../One_Reported_User/One_Reported_User'

export default class ReportedList extends Component {

    // 对接收的props进行类型、必要性的限制（限制类型为fun，且父组件必须传这个值）
    // 在咱们写代码时最好加上这个，减少合并时出现的问题
    static propTypes = {
        User_List: PropTypes.array,
        Main_Style: PropTypes.object,
        Head_Clicked: PropTypes.func,
        Ban_User_Clicked: PropTypes.func,
        Reset_Password_Clicked: PropTypes.func,
    }

    static defaultProps = {
        User_List: [],
        Main_Style: {

        },
        Head_Clicked: null,
        Ban_User_Clicked: null,
        Reset_Password_Clicked: null,
    }

    // 注意不要忘记定义render，返回值就是页面要渲染的东西
    render() {
        if(this.props.User_List.length===0){
            return <div class="fny_user_list" style={this.props.Main_Style}> 
                <h1 class="fny_no_user_h">无举报记录</h1>
            </div>
        }
        let temp_Main_Style={}
        for(var key in this.props.Main_Style){
            temp_Main_Style[key]=this.props.Main_Style[key]
        }
        temp_Main_Style['width']="830px"
        temp_Main_Style['overflow']='hidden'
        return <div class="fny_user_list" style={this.props.Main_Style}> 
                {
                    //注意下面的写法
                    this.props.User_List.map((one_User,index) => { 
                        var temp_Top=0
                        if(index!==0){
                            temp_Top=index*5+15
                        }
                        temp_Main_Style["top"]=temp_Top+"px"
                        return <OneReportedUser {...one_User} Main_Style={temp_Main_Style} Picture_Clicked={this.props.Head_Clicked} Ban_User_Clicked={this.props.Ban_User_Clicked} Reset_Password_Clicked={this.props.Reset_Password_Clicked} User_index={index}/>
                    })
                }
            </div>
    }
}
