import React from 'react'
import "./DropDownModal.css"

interface DropDownModalProps {
    showModal: boolean;
    closeModal: () => void;
    content: string;
  }



const DropDownModal: React.FC<DropDownModalProps> = ({ showModal, closeModal, content }) => {
    if (!showModal) return null;

    return (
        <div className="drop-modal-overlay">
        <div className="drop-modal-content">
          <button className="close-button" onClick={closeModal}>
            &times;
          </button>
          <p>{content}</p>
        </div>
      </div>
    );
}

export default DropDownModal
