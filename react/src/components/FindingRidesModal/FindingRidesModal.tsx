import React, { useState } from "react";
import MapComponent from "../MapComponent/MapComponent";
import RideCard from "../rideCard/rideCard";
import "./FindingRidesModal.css";

export interface RideMatch {
  firstName: string;
  lastName: string;
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpTime: string;
  daysNeeded: string[];
}

interface MatchingRidesModalProps {
  isOpen: boolean;
  closeModal: () => void;
  matchedRides: RideMatch[];
  onConfirm: (ride: RideMatch) => void;
}

const MatchingRidesModal: React.FC<MatchingRidesModalProps> = ({
  isOpen,
  closeModal,
  matchedRides,
  onConfirm,
}) => {
  const [selectedRide, setSelectedRide] = useState<RideMatch | null>(null);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-large">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>

        <div className="modal-layout">
          {/* Left: Map */}
          <div className="modal-map">
            <MapComponent />
          </div>

          {/* Right: List */}
          <div className="modal-list">
            <h2>Nearby Drivers</h2>
            {matchedRides.map((ride, index) => (
              <div
                key={index}
                className={`ride-list-item ${
                  selectedRide === ride ? "expanded" : ""
                }`}
                onClick={() => setSelectedRide(ride)}
              >
                {selectedRide === ride ? (
                  <RideCard {...ride} />
                ) : (
                  <h3>
                    {ride.firstName} {ride.lastName}
                  </h3>
                )}
              </div>
            ))}

            {selectedRide && (
              <button
                className="confirm-ok-button"
                onClick={() => onConfirm(selectedRide)}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingRidesModal;
