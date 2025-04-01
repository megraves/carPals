import React from "react";
import "./ActionButton.css";

interface ActionButton {
  label: string;
  id: string;
  action: () => void;
}

const Button: React.FC<ActionButton> = ({ label, action }) => {
  return (
    <button onClick={action} className="action-button">
      {label}
    </button>
  );
};

export default Button;
