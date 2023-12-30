import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Divider, List} from 'antd';
import './Preview_Instructions.css'
import SingleKey from '../Operation_Instructions/Single_Key/Single_Key';

export default class PreviewInstructions extends Component {
    static propTypes = {
        text: PropTypes.string,
        isOpen: PropTypes.bool,
    }
    defaultProps = {
        text: '',
    }
    render(){
        const data1 = [
            {instruction: 'K', text: '固定视角', special: false},
            {instruction: 'C', text: '裁剪点云', special: false},
            {instruction: 'S', text: '保存新点云',special: false},
            {instruction: 'P', text: '截取封面图', special: false},
            {instruction: 'Ctrl + 点击', text: '选取多边形截取点云', special: true},];

        return(
            this.props.isOpen && 
            <div class="preview-instruction-box">
                <div class="preview-instruction-box-content">
                    <Divider orientation="left" style={{fontSize: '18px', fontWeight: '600'}}>点云预览操作帮助</Divider>
                      <List 
                        grid={{ column: 3 }}
                        dataSource={data1}
                        renderItem={(item) => ( !item.special ?
                            <List.Item>
                            <div style={{display: 'flex'}}>
                                <SingleKey instruction={item.instruction}/>
                                <p style={{fontSize: '18px', fontWeight: '400', color: '#0047ab', marginLeft: '20px'}}>{item.text}</p>
                            </div>
                            </List.Item>
                            :
                            <List.Item>
                            <div style={{display: 'flex'}}>
                                <p style={{marginLeft: '-26px', fontSize: '18px', fontWeight: '400', color: 'blueviolet'}}>{item.instruction}</p>
                                <p style={{fontSize: '18px', fontWeight: '400', color: '#0047ab', marginLeft: '20px'}}>{item.text}</p>
                            </div>
                            </List.Item>
                        )}/>
                </div>
            </div>
        )  
    }
}
