import { useState } from "react";
import "./MyPalsButton.css";


const MyPalsButton = () => {

  const [dropOpen, setDropOpen] = useState(false);
  
  const pals = ["Edwin Tran", "Macy Graves", "Sofia Simonoff", "Lauren Shea"];

  return (

    <div className="my-pals" >
      <button className="my-pals-button" onClick={() => setDropOpen(!dropOpen)}>
        My Pals
      </button>
      {dropOpen && (
        <ul className="pals-dropdown">
          {pals.map((pal, index) => (
            <li key={index} className="pal-item">{pal}</li>
          ))}
        </ul>
      )}
    </div>

  );
};

export default MyPalsButton;