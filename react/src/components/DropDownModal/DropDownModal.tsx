import React from 'react'
import "./DropDownModal.css"

interface DropDownModalProps {
    showModal: boolean;
    closeModal: () => void;
    content: string;
  }



  const DropDownModal: React.FC<DropDownModalProps> = ({ showModal, closeModal, content }) => {
    if (!showModal) return null;
  
    const lines = content.split("\n");
  
    return (
      <div className="drop-modal-overlay">
        <div className="drop-modal-box">
          <button className="close-button" onClick={closeModal}>
            &times;
          </button>
          <div className="drop-modal-content">
            {lines.map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default DropDownModal
