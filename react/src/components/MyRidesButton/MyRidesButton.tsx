import { useState } from "react";
import "./MyRidesButton.css";


const MyRidesButton = () => {

  const [dropOpen, setDropOpen] = useState(false);
  const [selectRide, setSelectRide] = useState<string | null>(null);
  const rides = ["Ride 1", "Ride 2", "Ride 3"];

  const handleRideClick = (ride: string) => {
    setSelectRide(ride);
  };

  const closePopup = () => {
    setSelectRide(null);
  };

  return (

    <div className="my-rides" >
      <button className="my-rides-button" onClick={() => setDropOpen(!dropOpen)}>
        My Rides
      </button>
      {dropOpen && (
        <ul className="rides-dropdown">
          {rides.map((ride, index) => (
            <button key={index} className="ride-item" onClick={() => handleRideClick(ride)}>{ride}</button>
          ))}
        </ul>
      )}

      {selectRide && (
        <div className="popup-overlay">
          <div className="popup-box">
            <span className="close-btn" onClick={closePopup}>&times;</span>
            <p>You selected: {selectRide}</p>
          </div>
        </div>
      )}

    </div>

  );
};

export default MyRidesButton;