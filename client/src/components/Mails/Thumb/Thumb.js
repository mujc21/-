import React, { Component } from 'react'
import Modal from '../../Modal/Modal'
import axios from 'axios'
import BackButton from '../Button/Back_Button'
import { Link } from 'react-router-dom'
import './Thumb.css'
import { Switch, List, Checkbox, Button, Avatar } from 'antd'

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

export default class Thumb extends Component {

    state = {
        data: [],
        list: [],
        initLoading: true,
        loading: false,
        isOpen: false,
    }

    componentDidMount() {
        fetch(fakeDataUrl)
          .then((res) => res.json())
          .then((res) => {
          this.setState({initLoading: false, data: res.results, list: res.results});
        });
    }

    onLoadMore = () => {
        this.setState({loading: true, 
          list: this.state.data.concat(
              [...new Array(count)].map(() => ({
              loading: true,
              name: {},
              picture: {},
              })),
          ),})
        fetch(fakeDataUrl)
          .then((res) => res.json())
          .then((res) => {
            const newData = this.state.data.concat(res.results);
            this.setState({data: newData, list: newData, loading: false})
            window.dispatchEvent(new Event('resize'));
          });
    };

    openModal = () => {
      this.setState({ isModalOpen: true });
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    };

    closeModal = () => {
      this.setState({ isModalOpen: false });
      document.body.style.overflow = 'auto'; // 恢复背景滚动
    };

    render(){
        const loadMore =
        !this.state.initLoading && !this.state.loading ? (
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              height: 32,
              lineHeight: '32px',
            }}
          >
            <Button onClick={() => this.onLoadMore()} style={{marginBottom: '15px'}}>加载更多</Button>
          </div>
        ) : null;

        const Thumb_Content = {
          position: 'absolute',
          top: '16%',
          left: '0px',
          border: 'none',
          borderTop: '1.5px solid rgba(2, 9, 16, 0.13)',
          backgroundColor: 'rgb(248, 248, 248)',
          height: '84%',
          width: '88vw',
          overflowY: 'auto',
        }

        const Back_Button_Style = {
          top: '5.75%', 
          left: '4.07%',
        }

        return <div style={this.props.Main_Style} class="zgw_Thumb_List">
          <Link to='/mails'>
            <BackButton  Back_Button_Style = {Back_Button_Style}/>
          </Link> 
          <p class="zgw_Thumb_Label">赞</p>
          <div style={Thumb_Content}>
            <List
              loading={this.state.initLoading}
              itemLayout="horizontal"
              loadMore={loadMore}
              dataSource={this.state.list}
              renderItem={(item) => (
                  <List.Item>
                      <div>
                        <div style={{width: '84vw', marginLeft: '30px'}}>
                          <div style={{display: 'flex', marginLeft: '-10px'}}>
                            <Avatar src={item.picture.large} style={{ height: '50px', width: '50px'}}/>
                            <h3 style={{ marginLeft: '15px', marginTop: '12px' }}>{item.name?.last}</h3>
                            <p style={{color: 'rgb(64, 64, 64)', marginLeft: '5px', marginTop: '14px', fontWeight: '400'}}>于</p>
                            <p style={{color: 'rgb(64, 64, 128)', marginLeft: '5px', marginTop: '14px', fontWeight: '500'}}>2023.1.4 12:39</p>
                            <p style={{color: 'rgb(64, 64, 64)', marginLeft: '5px', marginTop: '14px', fontWeight: '400'}}>赞了我的帖子</p>
                          </div>
                        </div>
                        <div  onClick={() => this.openModal()} style={{cursor: 'pointer', marginTop: '10px', marginBottom: '-12px', display: 'flex', backgroundColor: 'rgb(228, 228, 228)', width: '88vw', height: '100px'}}>
                          <img src="/picture/result_image.jpg" style={{marginLeft: '20px', top: '0px', height: '100px'}}/>
                          <p style={{fontWeight: '400', color: 'rgb(96, 96, 96)', marginLeft: '10px', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '76vw'}}>Ant Design, a design language for background applications, is refined by Ant UED Team hhhhhhhh hhhhhhhhhAnt Design, a design language for background applications, </p>
                        </div>
                      </div>
                  </List.Item>
              )}
              />
          </div>
          <Modal isOpen={this.state.isModalOpen} onClose={this.closeModal} />
        </div>
    }
}