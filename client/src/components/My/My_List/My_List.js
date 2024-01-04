import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './My_List.css'; // 导入样式文件
import PreviewInstructions from '../../Preview_Instructions/Preview_Instructions';
import { List } from 'antd'
import axios from 'axios'
import Modal from '../../Modal/Modal'
import { Link } from 'react-router-dom'

class MyList extends Component {
    static propTypes = {
        My_List_Style: PropTypes.object,
        Search_String: PropTypes.string,
        Items: PropTypes.object,
        currentUser: PropTypes.string,
        mode: PropTypes.string,
        Current_Post_id: null
    }

    state = {
      isLoading: false,
      isModalOpen: false,
      items1: [],
      items2: [],
      items3: []
    }

    handleMyListNumber = (username, mode) => {
      const our_url = 'http://43.138.68.84:8082/api/MyListNumber/' + username + '/' + mode;
      return new Promise((resolve, reject) => {
        axios.get(our_url)
        .then(res => {
            if (res.data === "数据库查询失败") {
                
                resolve(null);
            } 
            else{
                const totalPosts = res.data.totalPosts;
                resolve(totalPosts)
            }
        })
        .catch(e => {
            
            resolve(0);
        });
      });
    }

    handleMyListAvatar = (username, mode, ordinal) => {
      const our_url = "http://43.138.68.84:8082/api/MyListAvatar/" + username + '/' + mode + '/' + ordinal;
      return new Promise((resolve, reject) => {
          axios.get(our_url, {
              responseType: 'arraybuffer'
          })
          .then(res => {
              if (res.data === "数据库查询失败") {
                  
                  resolve(null);
              } else if (res.data === "该条帖子不存在") {
                  
                  resolve(null);
              } else {
                  const blob = new Blob([res.data], { type: 'application/octet-stream' });
                  const url = URL.createObjectURL(blob);
                  resolve(url);
              }
          })
        
          .catch(e => {
              
              resolve(null);
          });
      });
    };
    
    handleMyListPicture = (username, mode, ordinal) => {
      const our_url = "http://43.138.68.84:8082/api/MyListPicture/" + username + '/' + mode + '/' + ordinal;
      return new Promise((resolve, reject) => {
          axios.get(our_url, {
              responseType: 'arraybuffer'
          })
          .then(res => {
              if (res.data === "数据库查询失败") {
                  
                  resolve(null);
              } else if (res.data === "该条帖子不存在") {
                  
                  resolve(null);
              } else {
                  const blob = new Blob([res.data], { type: 'application/octet-stream' });
                  const url = URL.createObjectURL(blob);
                  resolve(url);
              }
          })
        
          .catch(e => {
              
              resolve(null);
          });
      });
    };

    handleMyListString = (username, mode, ordinal) => {
      const our_url = "http://43.138.68.84:8082/api/MyListString/" + username + '/' + mode + '/' + ordinal;
      return new Promise((resolve, reject) => {
          axios.get(our_url)
          .then(res => {
              if (res.data === "数据库查询失败") {
                  
                  resolve({
                      author_name: null,
                      post_text: null,
                      like_num: null,
                      post_id: null
                  });
              } else if (res.data === "该条帖子不存在") {
                  
                  resolve({
                    author_name: null,
                    post_text: null,
                    like_num: null,
                    post_id: null
                  });
              } else if (res.data === "该用户不存在") {
                  
                  resolve({
                    author_name: null,
                    post_text: null,
                    like_num: null,
                    post_id: null
                  });
              } else {
                  const postInfo = res.data;
                  resolve({
                    author_name: postInfo.author_name,
                    post_text: postInfo.post_text,
                    like_num: postInfo.like_num,
                    post_id: postInfo.post_id
                  });
              }
          })
          .catch(e => {
              
              resolve({
                author_name: null,
                post_text: null,
                like_num: null,
                post_id: null
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
              const newItems = [...prevState.items1, {id: userInfo.post_id, avatar: avatarInfo, user: userInfo.author_name, text: userInfo.post_text, thumb: userInfo.like_num, img: pictureInfo}]
              this.setState({items1: newItems})
          })
        }
        else if(mode === "收藏"){
          this.setState((prevState) => {
            const newItems = [...prevState.items2, {id: userInfo.post_id, avatar: avatarInfo, user: userInfo.author_name, text: userInfo.post_text, thumb: userInfo.like_num, img: pictureInfo}]
            this.setState({items2: newItems})
          })
        }
        else{
          this.setState((prevState) => {
            const newItems = [...prevState.items3, {id: userInfo.post_id, avatar: avatarInfo, user: userInfo.author_name, text: userInfo.post_text, thumb: userInfo.like_num, img: pictureInfo}]
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
      this.loadMyListData(this.props.currentEnter, this.props.mode)
    }

    componentDidUpdate(prevProps) {
      if(this.props.enter == 'My'){
        if((prevProps.avatar !== './picture/default-avatar.jpg' && prevProps.avatar !== this.props.avatar) || (prevProps.currentUser !== this.props.currentUser) ){
          this.setState({items1: []})
          this.setState({items2: []})
          this.setState({items3: []})
          // 
          this.loadMyListData(this.props.currentEnter, this.props.mode)
        }
      }
      if(this.props.currentEnter !== prevProps.currentEnter){
        this.setState({items1: []})
        this.setState({items2: []})
        this.setState({items3: []})
        this.loadMyListData(this.props.currentEnter, this.props.mode)
      }
    }

    openModal = (itemID) => {
      this.setState({ isModalOpen: true });
      this.setState({ Current_Post_id: itemID });
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    };

    closeModal = () => {
      this.setState({ isModalOpen: false });
      document.body.style.overflow = 'auto'; // 恢复背景滚动
      this.props.refresh(this.props.currentEnter)
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
                  <List.Item key={item.id} style={{display: 'flex', width: '100%', borderBottom: '1px solid rgba(2, 9, 16, 0.13)', borderRight: '1px solid rgba(2, 9, 16, 0.13)', breakInside: 'avoid'}}>
                  <div style={{ marginTop: '10px', marginLeft: '10px'}}>
                    <Link to={`/My/users/${item.user}`}>
                      <img src={item.avatar} alt="Sunset" style={{ width: '60px', height: '60px', borderRadius: '30px'}} />
                    </Link>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ marginLeft: '20px', marginTop: '-5px'}}>
                      <h3>{item.user}</h3>
                      <p style={{ height: '25px', marginTop: '-5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px'}}>{item.text}</p>
                      <img src={item.img} onClick={() => this.openModal(item.id)} alt="Sunset" style={{height: '150px', maxWidth: '200px', cursor: 'pointer'}} />
                      </div>
                  </div>
                  <div style={{ position: 'absolute', marginTop: '30px', right: '40px'}}>
                      <label style={{border: 'none', background: 'none', marginLeft:'15px'}}>
                        <img src="./picture/Compliments.png" alt="Like" style={{width: '24px', height: '24px' }} />
                      </label>
                      <p style={{marginLeft:'45px', marginTop:'-25px'}}>{item.thumb}</p>
                  </div>
                  </List.Item>
                )}>
            </List>
            <Modal isOpen={this.state.isModalOpen} currentPostID={this.state.Current_Post_id} onClose={this.closeModal} currentEnter={this.props.currentEnter} currentUser={this.props.currentUser} selfAvatar={this.props.avatar} enter="My"/>
        </div>
      );
    }
  }
  
  export default MyList;