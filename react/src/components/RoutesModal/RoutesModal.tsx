import React, { useState, useEffect } from "react";
import "./RoutesModal.css";

interface RoutesModalProps {
  isOpen: boolean;
  closeModal: () => void;
  mode: "find" | "offer" | null;
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

const RoutesModal: React.FC<RoutesModalProps> = ({
  isOpen,
  closeModal,
  mode,
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Reset selected days when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDays([]); // Clear selected days when modal is closed
    }
  }, [isOpen]);

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
        <h2 className="modal-title">
          {mode === "find" ? "Find a Ride" : "Offer a Ride"}
        </h2>
        <form className="modal-form">
          <label>Starting Location:</label>
          <input
            type="text"
            name="startingLocation"
            placeholder="Enter starting location"
            required
          />

          <label>Ending Location:</label>
          <input
            type="text"
            name="endingLocation"
            placeholder="Enter ending location"
            required
          />

          <label>{mode === "find" ? "Pick Up Time:" : "Leaving Time:"}</label>
          <input type="time" name="pickupTime" required />

          <label>{mode === "find" ? "Days Needed:" : "Days Going:"}</label>
          <div className="days-selector">
            {daysOfWeek.map(({ short, full }) => (
              <div
                key={full}
                className={`day-box ${
                  selectedDays.includes(full) ? "selected" : ""
                }`}
                onClick={() => toggleDaySelection(full)}
                title={full}
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
