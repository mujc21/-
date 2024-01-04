import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Materials.css'
import SearchBox from '../Search_Box/Search_Box'
import MaterialsList from './Materials_List/Materials_List'


export default class Materials extends Component {
    static propTypes = {
        Main_Style: PropTypes.object,
        My_Materials_Button_Style: PropTypes.object,
        My_Materials_Button_String: PropTypes.string,
        All_Materials_Button_Style: PropTypes.object,
        All_Materials_Button_String: PropTypes.string,
        Materials_List_Style: PropTypes.object,
        currentUser: PropTypes.string,
    }
    static defaultProps = {
        My_Materials_Button_String: '个人',
        My_Materials_Button_Style:{
            left: '68%',
        },

        All_Materials_Button_String: '全部',
        All_Materials_Button_Style:{
            left: '26%',
        },
        Materials_List_Style:{
            top: '22%',
            left: '10%',
        },
        Search_Box_Style: {
            position: 'absolute',
            color: 'white',
            top: '4%',
            left: '31%',
            width: '449px',
            borderRadius: '0px',
            borderWidth: '3px',
            height: '40px',
        },
        Search_Input_Palceholder: '搜索...',
    }
    state = {
        activeButton: 1,
        selectedItems: [],
        Search_Content: '',
        Final_Search_Content: '',
    }

    Search_Box_String_Changed = (new_Key_String) =>{
        this.setState({Search_Content: new_Key_String})
    }

    Handle_Search = () =>{
        const temp_string = this.state.Search_Content
        this.setState({Final_Search_Content: temp_string})
        // 
    }

    Handle_Close = () =>{
        this.setState({Search_Content: ''})
    }

    handleButtonClick = (buttonId) => {
        this.setState({activeButton: buttonId});
    };

    setMyMaterialsList = (newList) => {
        this.setState({My_Materials_List: newList})
    }

    render() {

        return (
            <div class='zgw_materials'>
                {/* <SearchBox Search_Box_String_Changed={this.Search_Box_String_Changed} Search_Box_Style={this.props.Search_Box_Style} Search_Box_Palceholder={this.props.Search_Box_Palceholder} Handle_Search={this.Handle_Search} Handle_Close={this.Handle_Close}/> */}
                <p class="Title" style={{position: 'absolute', left: '43.5%', top: '5%', letterSpacing:'.07em', fontSize: '2.5em', fontWeight: 'normal', margin:'0 auto'}} > 素材库 </p>
                <button onClick={() => this.handleButtonClick(1)} style={this.props.All_Materials_Button_Style} class={`MaterialsButtonStyle ${this.state.activeButton === 1 ? 'active' : ''}`}>{this.props.All_Materials_Button_String}</button>
                <button onClick={() => this.handleButtonClick(2)} style={this.props.My_Materials_Button_Style} class={`MaterialsButtonStyle ${this.state.activeButton === 2 ? 'active' : ''}`}>{this.props.My_Materials_Button_String}</button>
                <svg height="50%" width="100%">
                <line x1="10%" y1="40%" x2="90%" y2="40%" style={{ stroke: 'rgb(8, 68, 255)', strokeWidth: 1}} />
                </svg>
                <MaterialsList Materials_List_Style={this.props.Materials_List_Style} Search_String={this.state.Final_Search_Content} activeButton={this.state.activeButton} currentUser={this.props.currentUser}/>
            </div>
        );
    }
}