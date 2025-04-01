import React from "react";
import "./RideConfirmation.css";

interface RideDetails {
  startingLocation: string;
  endingLocation: string;
  pickupTime: string;
  daysNeeded: string[];
}

interface RideConfirmationProps {
  rideDetails: RideDetails | null;
  isVisible: boolean;
  onClose: () => void;
}

const RideConfirmation: React.FC<RideConfirmationProps> = ({ rideDetails, isVisible, onClose }) => {
  if (!isVisible || !rideDetails) {
    return null;
  }

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Ride Request Confirmed! 🚗</h2>
        <div className="confirmation-details">
          <p><strong>From:</strong> {rideDetails.startingLocation}</p>
          <p><strong>To:</strong> {rideDetails.endingLocation}</p>
          <p><strong>Time:</strong> {rideDetails.pickupTime}</p>
          <p><strong>Days:</strong> {rideDetails.daysNeeded.join(", ")}</p>
        </div>
        <button className="confirm-ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default RideConfirmation;
