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
  const [formData, setFormData] = useState({
    startingLocation: "",
    endingLocation: "",
    pickupTime: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Reset selected days when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDays([]);
      setFormData({
        startingLocation: "",
        endingLocation: "",
        pickupTime: "",
      });
      setShowConfirmation(false);
    }
  }, [isOpen]);

  const toggleDaySelection = (day: string) => {
    setSelectedDays((prevSelected) =>
      prevSelected.includes(day)
        ? prevSelected.filter((d) => d !== day)
        : [...prevSelected, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>

        {showConfirmation ? (
          <>
            <h2>Ride Request Confirmed! 🚗</h2>
            <div className="confirmation-details">
              <p>
                <strong>From:</strong> {formData.startingLocation}
              </p>
              <p>
                <strong>To:</strong> {formData.endingLocation}
              </p>
              <p>
                <strong>Time:</strong> {formData.pickupTime}
              </p>
              <p>
                <strong>Days:</strong> {selectedDays.join(", ")}
              </p>
            </div>
            <button className="confirm-ok-button" onClick={closeModal}>
              OK
            </button>
          </>
        ) : (
          <>
            <h2 className="modal-title">
              {mode === "find" ? "Find a Ride" : "Offer a Ride"}
            </h2>
            <form className="modal-form" onSubmit={handleSubmit}>
              <label>Starting Location:</label>
              <input
                type="text"
                name="startingLocation"
                placeholder="Enter starting location"
                required
                value={formData.startingLocation}
                onChange={(e) =>
                  setFormData({ ...formData, startingLocation: e.target.value })
                }
              />

              <label>Ending Location:</label>
              <input
                type="text"
                name="endingLocation"
                placeholder="Enter ending location"
                required
                value={formData.endingLocation}
                onChange={(e) =>
                  setFormData({ ...formData, endingLocation: e.target.value })
                }
              />

              <label>
                {mode === "find" ? "Pick Up Time:" : "Leaving Time:"}
              </label>
              <input
                type="time"
                name="pickupTime"
                required
                value={formData.pickupTime}
                onChange={(e) =>
                  setFormData({ ...formData, pickupTime: e.target.value })
                }
              />

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
          </>
        )}
      </div>
    </div>
  );
};

export default RoutesModal;
