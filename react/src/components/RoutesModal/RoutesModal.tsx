import React, { useState } from "react";
import "./RoutesModal.css";

interface RoutesModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const daysOfWeek = [
  { short: "Su", full: "Sunday" },
  { short: "Mo", full: "Monday" },
  { short: "Tu", full: "Tuesday" },
  { short: "We", full: "Wednesday" },
  { short: "Th", full: "Thursday" },
  { short: "Fr", full: "Friday" },
  { short: "Sa", full: "Saturday" },
];

const RoutesModal: React.FC<RoutesModalProps> = ({ isOpen, closeModal }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDaySelection = (day: string) => {
    setSelectedDays(
      (prevSelected) =>
        prevSelected.includes(day)
          ? prevSelected.filter((d) => d !== day) // Deselect if selected
          : [...prevSelected, day] // Select if not selected
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        <h2 className="modal-title">Plan Your Route</h2>
        <form className="modal-form">
          <label>Starting Location:</label>
          <input type="text" placeholder="Enter starting location" required />

          <label>Ending Location:</label>
          <input type="text" placeholder="Enter ending location" required />

          <label>Pickup Time:</label>
          <input type="time" required />

          <label>Days Needed:</label>
          <div className="days-selector">
            {daysOfWeek.map(({ short, full }) => (
              <div
                key={full}
                className={`day-box ${
                  selectedDays.includes(full) ? "selected" : ""
                }`}
                onClick={() => toggleDaySelection(full)}
                title={full} // Show full name on hover
              >
                {short}
              </div>
            ))}
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoutesModal;
