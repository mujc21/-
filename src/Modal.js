import React, { Component } from 'react';
import './Modal.css'

class Modal extends Component {
  render() {
    const { isOpen, onClose } = this.props;

    return (
      isOpen && (
        <div className="modal1">
          <div className="modal1-content">
            <p>This is the modal content.</p >
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      )
    );
  }
}

export default Modal;