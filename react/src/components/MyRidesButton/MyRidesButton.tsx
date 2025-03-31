import { useState } from "react";
import "./MyRidesButton.css";


const MyRidesButton = () => {

  const [dropOpen, setDropOpen] = useState(false);
  
  const rides = ["Ride 1", "Ride 2", "Ride 3"];

  return (

    <div className="my-rides" >
      <button className="my-rides-button" onClick={() => setDropOpen(!dropOpen)}>
        My Rides
      </button>
      {dropOpen && (
        <ul className="rides-dropdown">
          {rides.map((ride, index) => (
            <li key={index} className="ride-item">{ride}</li>
          ))}
        </ul>
      )}
    </div>

  );
};

export default MyRidesButton;