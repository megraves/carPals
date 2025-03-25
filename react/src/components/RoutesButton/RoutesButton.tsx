import React from "react";
import "./RoutesButton.css";

interface RoutesButtonProps {
  openModal: () => void;
}

const RoutesButton: React.FC<RoutesButtonProps> = ({ openModal }) => {
  return (
    <button onClick={openModal} className="routes-button">
      Routes
    </button>
  );
};

export default RoutesButton;
