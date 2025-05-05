import React from "react";
//import "./RideCard.css";

interface RideCardProps {
  firstName: string;
  lastName: string;
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpTime: string;
  daysNeeded: string[];
}

const RideCard: React.FC<RideCardProps> = ({
  firstName,
  lastName,
  pickUpLocation,
  dropOffLocation,
  pickUpTime,
  daysNeeded,
}) => {
  return (
    <div className="ride-card">
      <h3 className="ride-name">
        {firstName} {lastName}
      </h3>
      <p>
        <strong>Pickup:</strong> {pickUpLocation}
      </p>
      <p>
        <strong>Dropoff:</strong> {dropOffLocation}
      </p>
      <p>
        <strong>Time:</strong> {pickUpTime}
      </p>
      <p>
        <strong>Days:</strong> {daysNeeded.join(", ")}
      </p>
    </div>
  );
};

export default RideCard;
