import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Modal from '../../../Modal'
import './My_List.css'; // 导入样式文件

class MyList extends Component {
    static propTypes = {
        My_List_Style: PropTypes.object,
        Search_String: PropTypes.string,
        Items: PropTypes.object,
    }

    state = {
      isModalOpen: false,
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

      const items = this.props.Items
      const filteredItems = items.filter(item => item.text.toLowerCase().includes(this.props.Search_String.toLowerCase()));

      const updatedFilteredItems = filteredItems.map((item, index) => ({
        ...item,
        count: index + 1,
      }));
  
      return (
        <div>
          {/* <button onClick={this.handleSort}>排序</button>
          <input
            type="text"
            placeholder="筛选"
            value={filterText}
            onChange={this.handleFilter}
          /> */}
          <ul class="my-post-list" style={this.props.My_List_Style}>
            {updatedFilteredItems.map(item => ( item.count %2 !== 0?(
              <li key={item.id} onClick={this.openModal} style={{display: 'flex', width: '50%', borderBottom: '1px solid rgba(2, 9, 16, 0.13)', borderRight: '1px solid rgba(2, 9, 16, 0.13)', breakInside: 'avoid'}}>
                <div style={{ marginTop: '10px', marginLeft: '10px'}}>
                    < img src="/picture/head_structure.jpeg" alt="Sunset" style={{ width: '60px', height: '60px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ marginLeft: '20px', marginTop: '-5px'}}>
                    <h3>Deesan</h3>
                    <p style={{ marginTop: '-5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px'}}>这是我的日复一日，超爱!</p>
                    <img src="/picture/result_image.jpg" alt="Sunset" style={{height: '150px', width: '200px'}} />
                    </div>
                </div>
                <div style={{ marginTop: '30px'}}>
                    <label style={{border: 'none', background: 'none', marginLeft:'15px'}}>
                    <img src="/picture/Compliments.png" alt="Like" style={{width: '24px', height: '24px' }} />
                    </label>
                    <p style={{marginLeft:'45px', marginTop:'-25px'}}>{item.thumb}</p>
                </div>
            </li>
            ):<li key={item.id} onClick={this.openModal} style={{display: 'flex', position:'absolute', marginTop:'-242.5px', left: '50%', width: '50%', borderBottom: '1px solid rgba(2, 9, 16, 0.13)', breakInside: 'avoid'}}>
                <div style={{ marginTop: '10px', marginLeft: '10px'}}>
                    < img src="/picture/head_structure.jpeg" alt="Sunset" style={{ width: '60px', height: '60px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ marginLeft: '20px', marginTop: '-5px'}}>
                    <h3>Deesan</h3>
                    <p style={{ marginTop: '-5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px'}}>这是我的日复一日，超爱!</p>
                    <img src="/picture/result_image.jpg" alt="Sunset" style={{height: '150px', width: '200px'}} />
                    </div>
                </div>
                <div style={{ marginTop: '30px'}}>
                    <label style={{border: 'none', background: 'none', marginLeft:'15px'}}>
                    <img src="/picture/Compliments.png" alt="Like" style={{width: '24px', height: '24px' }} />
                    </label>
                    <p style={{marginLeft:'45px', marginTop:'-25px'}}>{item.thumb}</p>
                </div>
            </li>
            ))}
          </ul>
          <Modal isOpen={this.state.isModalOpen} onClose={this.closeModal} />
        </div>
      );
    }
  }
  
  export default MyList;