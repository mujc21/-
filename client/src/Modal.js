import React, { Component } from 'react';
import './Modal.css'

class Modal extends Component {
  render() {
    const { isOpen, onClose } = this.props;

    return (
      isOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>This is the modal content.</p >
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      )
    );
  }
}

export default Modal;