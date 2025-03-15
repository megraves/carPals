import React from "react";

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
