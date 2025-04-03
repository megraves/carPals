import React, { useEffect, useState } from "react";
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
  onConfirm: (ride: RideMatch) => void;
  restoreMap: () => void;
}

const MatchingRidesModal: React.FC<MatchingRidesModalProps> = ({
  isOpen,
  closeModal,
  onConfirm,
  restoreMap,
}) => {
  const [selectedRide, setSelectedRide] = useState<RideMatch | null>(null);
  const [matchedRides, setMatchedRides] = useState<RideMatch[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch("./mock_data.json")
        .then((res) => res.json())
        .then((data) => setMatchedRides(data.slice(1, 16)))
        .catch((err) => console.error("Failed to fetch mock rides: ", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    setSelectedRide(null);
    restoreMap();
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-large">
        <button className="close-button" onClick={handleCloseModal}>
          &times;
        </button>

        <div className="modal-layout">
          {/* Left: Map */}
          <div className="modal-map">
            <MapComponent mapId="modal-map" className="modal-container" />
          </div>

          {/* Right: Scrollable List with Fixed Submit Button */}
          <div className="modal-list">
            <h2>Nearby Drivers</h2>
            <div className="ride-list-scroll">
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
            </div>

            <div className="confirm-container">
              <button
                className="confirm-ok-button"
                onClick={() => {
                  closeModal();
                  restoreMap();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingRidesModal;
