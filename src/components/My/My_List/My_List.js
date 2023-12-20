import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './My_List.css'; // 导入样式文件
import PreviewInstructions from '../../Preview_Instructions/Preview_Instructions';
import { List } from 'antd'
import axios from 'axios'

class MyList extends Component {
    static propTypes = {
        My_List_Style: PropTypes.object,
        Search_String: PropTypes.string,
        Items: PropTypes.object,
        currentUser: PropTypes.string,
        mode: PropTypes.string,
    }

    state = {
      isModalOpen: false,
      items1: [],
      items2: [],
      items3: []
    }

    handleMyListNumber = (username, mode) => {
      const our_url = '/api/MyListNumber/' + username + '/' + mode;
      return new Promise((resolve, reject) => {
        axios.get(our_url)
        .then(res => {
            if (res.data === "数据库查询失败") {
                alert("数据库查询失败");
                resolve(null);
            } 
            else{
                const totalPosts = res.data.totalPosts;
                resolve(totalPosts)
            }
        })
        .catch(e => {
            alert("404 handleMyListNumber响应失败: " + e.message);
            resolve(0);
        });
      });
    }

    handleMyListAvatar = (username, mode, ordinal) => {
      const our_url = "/api/MyListAvatar/" + username + '/' + mode + '/' + ordinal;
      return new Promise((resolve, reject) => {
          axios.get(our_url, {
              responseType: 'arraybuffer'
          })
          .then(res => {
              if (res.data === "数据库查询失败") {
                  alert("数据库查询失败");
                  resolve(null);
              } else if (res.data === "该条帖子不存在") {
                  alert("该条帖子不存在");
                  resolve(null);
              } else {
                  const blob = new Blob([res.data], { type: 'application/octet-stream' });
                  const url = URL.createObjectURL(blob);
                  resolve(url);
              }
          })
        
          .catch(e => {
              alert("404 handleMyListAvatar响应失败: " + e.message);
              resolve(null);
          });
      });
    };
    
    handleMyListPicture = (username, mode, ordinal) => {
      const our_url = "/api/MyListPicture/" + username + '/' + mode + '/' + ordinal;
      return new Promise((resolve, reject) => {
          axios.get(our_url, {
              responseType: 'arraybuffer'
          })
          .then(res => {
              if (res.data === "数据库查询失败") {
                  alert("数据库查询失败");
                  resolve(null);
              } else if (res.data === "该条帖子不存在") {
                  alert("该条帖子不存在");
                  resolve(null);
              } else {
                  const blob = new Blob([res.data], { type: 'application/octet-stream' });
                  const url = URL.createObjectURL(blob);
                  resolve(url);
              }
          })
        
          .catch(e => {
              alert("404 handleMyListAvatar响应失败: " + e.message);
              resolve(null);
          });
      });
    };

    handleMyListString = (username, mode, ordinal) => {
      const our_url = "/api/MyListString/" + username + '/' + mode + '/' + ordinal;
      return new Promise((resolve, reject) => {
          axios.get(our_url)
          .then(res => {
              if (res.data === "数据库查询失败") {
                  alert("数据库查询失败");
                  resolve({
                      author_name: null,
                      post_text: null,
                      like_num: null
                  });
              } else if (res.data === "该条帖子不存在") {
                  alert("该条帖子不存在");
                  resolve({
                    author_name: null,
                    post_text: null,
                    like_num: null
                  });
              } else if (res.data === "该用户不存在") {
                  alert("该用户不存在");
                  resolve({
                    author_name: null,
                    post_text: null,
                    like_num: null
                  });
              } else {
                  const postInfo = res.data;
                  resolve({
                    author_name: postInfo.author_name,
                    post_text: postInfo.post_text,
                    like_num: postInfo.like_num
                  });
              }
          })
          .catch(e => {
              alert("404 handleLoadPostString响应失败: " + e.message);
              resolve({
                author_name: null,
                post_text: null,
                like_num: null
              });
          });
      });
    };

    loadMyListData = async (username, mode) => {
      const totalNumber = await this.handleMyListNumber(username, mode)

      for(let i = 1; i <= totalNumber; i++) {
        const userInfo = await this.handleMyListString(username, mode, i)
        const avatarInfo = await this.handleMyListAvatar(username, mode, i)
        const pictureInfo = await this.handleMyListPicture(username, mode, i)

        if(mode === "发帖"){
          this.setState((prevState) => { 
              const newItems = [...prevState.items1, {avatar: avatarInfo, user: userInfo.author_name, text: userInfo.post_text, thumb: userInfo.like_num, img: pictureInfo}]
              this.setState({items1: newItems})
          })
        }
        else if(mode === "收藏"){
          this.setState((prevState) => {
            const newItems = [...prevState.items2, {avatar: avatarInfo, user: userInfo.author_name, text: userInfo.post_text, thumb: userInfo.like_num, img: pictureInfo}]
            this.setState({items2: newItems})
          })
        }
        else{
          this.setState((prevState) => {
            const newItems = [...prevState.items3, {avatar: avatarInfo, user: userInfo.author_name, text: userInfo.post_text, thumb: userInfo.like_num, img: pictureInfo}]
            this.setState({items3: newItems})
          })
        }
      }
      return 
    }

    componentDidMount() {
      this.setState({items1: []})
      this.setState({items2: []})
      this.setState({items3: []})
      this.loadMyListData(this.props.currentUser, this.props.mode)
    }

    openModal = () => {
      this.setState({ isModalOpen: true });
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    };

    closeModal = () => {
      this.setState({ isModalOpen: false });
      document.body.style.overflow = 'auto'; // 恢复背景滚动
    };

    render() {
      let items = []
      if (this.props.mode === '发帖'){
        items = this.state.items1
      }
      else if (this.props.mode === '收藏'){
        items = this.state.items2
      }
      else{
        items = this.state.items3
      }

      return (
        <div>
          <List class="my-post-list" style={this.props.My_List_Style}
                grid={{ column: 2 }}
                dataSource={items}
                renderItem={(item) => (
                  <List.Item key={item.id} onClick={this.openModal} style={{display: 'flex', width: '100%', borderBottom: '1px solid rgba(2, 9, 16, 0.13)', borderRight: '1px solid rgba(2, 9, 16, 0.13)', breakInside: 'avoid'}}>
                  <div style={{ marginTop: '10px', marginLeft: '10px'}}>
                      < img src={item.avatar} alt="Sunset" style={{ width: '60px', height: '60px' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ marginLeft: '20px', marginTop: '-5px'}}>
                      <h3>{item.user}</h3>
                      <p style={{ marginTop: '-5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px'}}>{item.text}</p>
                      <img src={item.img} alt="Sunset" style={{height: '150px', width: '200px'}} />
                      </div>
                  </div>
                  <div style={{ marginTop: '30px'}}>
                      <label style={{border: 'none', background: 'none', marginLeft:'15px'}}>
                      <img src="/picture/Compliments.png" alt="Like" style={{width: '24px', height: '24px' }} />
                      </label>
                      <p style={{marginLeft:'45px', marginTop:'-25px'}}>{item.thumb}</p>
                  </div>
                  </List.Item>
                )}>
            </List>
            <PreviewInstructions isOpen={this.state.isModalOpen}/>
        </div>
      );
    }
  }
  
  export default MyList;