import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Modal from '../../Modal/Modal';
import ErrorReminder from '../../Error_Reminder/Error_Reminder'
import './Discover_List.css'; // 导入样式文件
import { Pagination, List, Spin } from 'antd'
import axios from 'axios'
import { Link } from 'react-router-dom'

class DiscoverList extends Component {
    static propTypes = {
        Discover_List_Style: PropTypes.object,
        Search_String: PropTypes.string,
        select_Bar_State: PropTypes.string,
    }

    handleLoadPostNumber = (Search_String) => {
      const our_url = "http://43.138.68.84:8082/api/discover-postnum";
      const postData = {Search_String}
      return new Promise((resolve, reject) => {
        axios.get(our_url, {
          params: postData
      })
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

    handleLoadPostAvatar = (currentPage, select_Bar_State, Search_String, ordinal) => {
      const our_url = "http://43.138.68.84:8082/api/discover-postavatar/" + currentPage + "/" + ordinal;
      const postData = {
        select_Bar_State: select_Bar_State, 
        Search_String: Search_String, 
      };

      return new Promise((resolve, reject) => {
          axios.get(our_url, {
              params: postData,
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

    handleLoadPostPicture = (currentPage, select_Bar_State, Search_String,ordinal) => {
      const our_url = "http://43.138.68.84:8082/api/discover-postpicture/" + currentPage + "/" + ordinal;
      const postData = {
        select_Bar_State: select_Bar_State, 
        Search_String: Search_String, 
      };

      return new Promise((resolve, reject) => {
          axios.get(our_url, {
              params: postData,
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

    handleLoadPostString = (currentPage, select_Bar_State, Search_String,ordinal) => {
      const our_url = "http://43.138.68.84:8082/api/discover-poststring/" + currentPage + "/" + ordinal;
      const postData = {
        select_Bar_State: select_Bar_State, 
        Search_String: Search_String, 
      };
      return new Promise((resolve, reject) => {
          axios.get(our_url, {
            params: postData
        })
          .then(res => {
              if (res.data === "数据库查询失败") {
                  
                  resolve({
                      post_id: null,
                      author_name: null,
                      post_text: null,
                      like_num: null
                  });
              } else if (res.data === "该条帖子不存在") {
                  
                  resolve({
                    post_id: null,
                    author_name: null,
                    post_text: null,
                    like_num: null
                  });
              } else if (res.data === "该用户不存在") {
                  
                  resolve({
                    post_id: null,
                    author_name: null,
                    post_text: null,
                    like_num: null
                  });
              } else {
                  const postInfo = res.data;
                  resolve({
                    post_id: postInfo.post_id,
                    author_name: postInfo.author_name,
                    post_text: postInfo.post_text,
                    like_num: postInfo.like_num
                  });
              }
          })
          .catch(e => {
              
              resolve({
                post_id: null,
                author_name: null,
                post_text: null,
                like_num: null
              });
          });
      });
    };

    min(a, b) {
      return a < b ? a : b;
    }

    loadPostData = async (currentPage, select_Bar_State, Search_String) => {

      const totalNumber = await this.handleLoadPostNumber(Search_String)
      this.setState({totalPostNumber: totalNumber})

      let postNumber =  totalNumber - ((currentPage - 1) * 6);
      postNumber = await this.min(postNumber, 6)

      for(let i = 1; i <= postNumber; i++) {
        const userInfo = await this.handleLoadPostString(currentPage, select_Bar_State, Search_String,i)
        const avatarInfo = await this.handleLoadPostAvatar(currentPage, select_Bar_State, Search_String,i)
        const pictureInfo = await this.handleLoadPostPicture(currentPage, select_Bar_State, Search_String,i)

        this.setState((prevState) => {
          const newItems = [...prevState.items, {id: userInfo.post_id, avatar: avatarInfo, user: userInfo.author_name, text: userInfo.post_text, thumb: userInfo.like_num, img: pictureInfo}]
          this.setState({items: newItems})
        })
      }
      return 

    }

    componentDidMount(){
      this.setState(() => ({
        items: [],
      }),()=>{
        this.loadPostData(1, this.props.select_Bar_State, this.props.Search_String)
      })
    }

    componentDidUpdate(prevProps){
      if(this.props.select_Bar_State != prevProps.select_Bar_State || this.props.Search_String != prevProps.Search_String){
        this.setState(() => ({
          items: [], currentPage: 1
        }),()=>{
          this.loadPostData(this.state.currentPage, this.props.select_Bar_State, this.props.Search_String)
        })
      }
    }

    state = {
      isLoading: false,
      isModalOpen: false,
      isMounted: false,
      isErrorReminderOpen: false,
      Current_Post_id: null,
      errorString: '',
      currentPage: 1,
      totalPostNumber: 9,
      items: [],
    }

    handlePageChange = (newPage) =>{
      this.setState({currentPage: newPage})
      this.setState(() => ({
        items: []
      }),()=>{
        this.loadPostData(this.state.currentPage, this.props.select_Bar_State, this.props.Search_String)
      })
    };

    openErrorReminder = (responseString) => {
      this.setState({ errorString: responseString })
      this.setState({ isErrorReminderOpen: true });
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    closeErrorReminder = () => {
      this.setState({ isErrorReminderOpen: false });
      document.body.style.overflow = 'auto'; // 恢复背景滚动
    }

    openModal = (itemID) => {
      this.setState({ isModalOpen: true });
      this.setState({ Current_Post_id: itemID });
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    };

    closeModal = () => {
      this.setState({ isModalOpen: false });
      document.body.style.overflow = 'auto'; // 恢复背景滚动
      this.setState(() => ({
          items: [],
        }),()=>{
          this.loadPostData(this.state.currentPage, this.props.select_Bar_State, this.props.Search_String)
        })
    };

    render() {
      const items = this.state.items

      const PaginationStyle = {
          position: 'relative',
          bottom: '0',
          padding: '8px',
        }
  
      return (
        <div>
          {this.state.isLoading && 
          <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,}}>
            <Spin tip="Loading..." />
          </div>}
          <List class="post-list" style={this.props.Discover_List_Style}
                grid={{ column: 2 }}
                dataSource={items}
                renderItem={(item) => (
                <List.Item key={item.id} style={{display: 'flex', borderBottom: '1px solid rgba(2, 9, 16, 0.13)', borderRight: '1px solid rgba(2, 9, 16, 0.13)', breakInside: 'avoid'}}>
                    <div style={{ marginTop: '10px', marginLeft: '10px'}}>
                    <Link to={`/My/users/${item.user}`}>
                      <img src={item.avatar} alt="Sunset" style={{ width: '80px', height: '80px', borderRadius: '40px', pointer: 'cursor'}} />
                    </Link>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ marginLeft: '20px' }}>
                    <h3>{item.user}</h3>
                    <p style={{ marginTop: '-5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minHeight: '30px', maxWidth: '300px'}}>{item.text}</p>
                    <img src={item.img} onClick={() => this.openModal(item.id)} alt="Sunset" style={{height: '250px', maxWidth: '300px', cursor: 'pointer'}} />
                    </div>
                </div>
                <div style={{ position: 'absolute', marginTop: '50px', right: '80px'}}>
                    <label style={{border: 'none', background: 'none', }}>
                      <img src="./picture/Compliments.png" alt="Like" style={{width: '24px', height: '24px' }} />
                    </label>
                    <p style={{marginLeft:'30px', marginTop:'-25px', fontSize: '16px'}}>{item.thumb}</p>
                </div>
                </List.Item>
                )}>
                <div style={PaginationStyle} >
                  <Pagination current={this.state.currentPage} pageSize={6} total={this.state.totalPostNumber} showSizeChanger={false} onChange={this.handlePageChange}/>
                </div> 
            </List>
            <Modal isOpen={this.state.isModalOpen} currentPostID={this.state.Current_Post_id} onClose={this.closeModal} currentUser={this.props.currentUser} selfAvatar={this.props.selfAvatar} enter="Discover"/>
            <ErrorReminder isOpen={this.state.isErrorReminderOpen} onClose={this.closeErrorReminder} errorString={this.state.errorString}/>
        </div>
      );
    }
  }
  
  export default DiscoverList;