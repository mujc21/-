import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Divider, List} from 'antd';
import './Preview_Instructions.css'
import SingleKey from './Single_Key/Single_Key';

export default class PreviewInstructions extends Component {
    static propTypes = {
        text: PropTypes.string,
        isOpen: PropTypes.bool,
    }
    defaultProps = {
        text: '',
    }
    render(){
        const data = [
            {instruction: 'K', text: '固定视角', special: false},
            {instruction: 'C', text: '裁剪点云（需要先固定视角）', special: false},
            {instruction: 'S', text: '保存新点云',special: false},
            {instruction: 'Ctrl + 点击', text: '选取多边形截取点云', special: true},];

        const data1 = [
            {instruction: '1', text: '沿 x 轴正向旋转'},
            {instruction: '2', text: '沿 x 轴逆向旋转'},
            {instruction: '3', text: '沿 y 轴正向旋转'},
            {instruction: '4', text: '沿 y 轴逆向旋转'},
            {instruction: '5', text: '沿 z 轴正向旋转'},
            {instruction: '6', text: '沿 z 轴逆向旋转'},
            {instruction: '7', text: '增加旋转角度'},
            {instruction: '8', text: '减小旋转角度'},];

        const data2 = [
            {instruction: 'A', text: '沿 x 轴正轴平移'},
            {instruction: 'S', text: '沿 x 轴负轴平移'},
            {instruction: 'D', text: '沿 y 轴正轴平移'},
            {instruction: 'F', text: '沿 y 轴负轴平移'},
            {instruction: 'G', text: '沿 z 轴正轴平移'},
            {instruction: 'H', text: '沿 z 轴负轴平移'},
            {instruction: 'J', text: '增加平移距离'},
            {instruction: 'K', text: '减小平移距离'},];
        
        const data3 = [
            {instruction: 'C', text: '切换操作点云'},
            {instruction: 'P', text: '取当前页面为封面图'},
            {instruction: 'U', text: '放大点云'},
            {instruction: 'I', text: '缩小点云'}];

        return(
            <div class="preview-instruction-box">
                <div class="preview-instruction-box-content">
                    <Divider orientation="left" style={{fontSize: '18px', fontWeight: '600', marginTop: '-10px'}}>点云预览操作帮助</Divider>
                      <List 
                        grid={{ column: 3 }}
                        dataSource={data}
                        renderItem={(item) => ( !item.special ?
                            <List.Item>
                            <div style={{display: 'flex'}}>
                                <SingleKey instruction={item.instruction}/>
                                <p style={{fontSize: '18px', fontWeight: '400', color: '#0047ab', marginLeft: '20px', transform: 'translateY(-10px)'}}>{item.text}</p>
                            </div>
                            </List.Item>
                            :
                            <List.Item>
                            <div style={{display: 'flex'}}>
                                <p style={{marginLeft: '-26px', fontSize: '18px', fontWeight: '400', color: 'blueviolet', transform: 'translateY(-10px)'}}>{item.instruction}</p>
                                <p style={{fontSize: '18px', fontWeight: '400', color: '#0047ab', marginLeft: '20px', transform: 'translateY(-10px)'}}>{item.text}</p>
                            </div>
                            </List.Item>
                        )}/>
                    <Divider orientation="left" style={{fontSize: '18px', fontWeight: '600', marginTop: '-15px'}}>点云拼接操作帮助</Divider>
                      <List>
                      <div style={{marginLeft: '20px', marginRight: '20px'}}>
                        <Divider orientation="left">旋转</Divider>
                      </div>
                      <List 
                        grid={{ column: 3 }}
                        dataSource={data1}
                        renderItem={(item) => (
                            <List.Item>
                            <div style={{display: 'flex'}}>
                                <SingleKey instruction={item.instruction}/>
                                <p style={{fontSize: '18px', fontWeight: '400', color: '#0047ab', marginLeft: '20px', transform: 'translateY(-10px)'}}>{item.text}</p>
                            </div>
                            </List.Item>
                        )}/>
                        <div style={{marginLeft: '20px', marginRight: '20px'}}>
                           <Divider orientation="left" style={{marginTop: '-15px'}}>平移</Divider>
                        </div>
                        <List 
                        grid={{ column: 3 }}
                        dataSource={data2}
                        renderItem={(item) => (
                            <List.Item>
                            <div style={{display: 'flex'}}>
                                <SingleKey instruction={item.instruction}/>
                                <p style={{fontSize: '18px', fontWeight: '400', color: '#0047ab', marginLeft: '20px', transform: 'translateY(-10px)'}}>{item.text}</p>
                            </div>
                            </List.Item>
                        )}/>
                        <div style={{marginLeft: '20px', marginRight: '20px'}}>
                           <Divider orientation="left" style={{marginTop: '-15px'}}>其他</Divider>
                        </div>
                        <List 
                        grid={{ column: 3 }}
                        dataSource={data3}
                        renderItem={(item) => (
                            <List.Item>
                            <div style={{display: 'flex'}}>
                                <SingleKey instruction={item.instruction}/>
                                <p style={{fontSize: '18px', fontWeight: '400', color: '#0047ab', marginLeft: '20px', transform: 'translateY(-10px)'}}>{item.text}</p>
                            </div>
                            </List.Item>
                        )}/>
                      </List>
                </div>
            </div>
        )  
    }
}
