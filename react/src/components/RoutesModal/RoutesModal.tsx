import React, { useState, useEffect } from "react";
import "./RoutesModal.css";
import MatchingRidesModal from "../FindingRidesModal/FindingRidesModal";
import { RideMatch } from "../FindingRidesModal/FindingRidesModal";

interface RoutesModalProps {
  isOpen: boolean;
  closeModal: () => void;
  mode: "find" | "offer" | null;
  setShowPageMap: React.Dispatch<React.SetStateAction<boolean>>;
}

type Step = "select" | "form" | "confirm" | "match";

interface SavedRoute {
  id: number;
  label: string;
  startingLocation: string;
  endingLocation: string;
  pickupTime: string;
  selectedDays: string[];
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
  setShowPageMap,
}) => {
  const [step, setStep] = useState<Step>("select");

  const [formData, setFormData] = useState({
    label: "",
    startingLocation: "",
    endingLocation: "",
    pickupTime: "",
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [currentRoute, setCurrentRoute] = useState<SavedRoute | null>(null);
  const [matchedRides, setMatchedRides] = useState<RideMatch[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setStep("select");
      setFormData({
        label: "",
        startingLocation: "",
        endingLocation: "",
        pickupTime: "",
      });
      setSelectedDays([]);
      setCurrentRoute(null);
    }
  }, [isOpen]);

  const formatTime = (timeStr: string) => {
    const [hourStr, minuteStr] = timeStr.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedTime = `${formattedHour}:${minuteStr} ${isPM ? "PM" : "AM"}`;

    return formattedTime;
  };

  const toggleDaySelection = (day: string) => {
    setSelectedDays((prevSelected) =>
      prevSelected.includes(day)
        ? prevSelected.filter((d) => d !== day)
        : [...prevSelected, day]
    );
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    const newRoute: SavedRoute = {
      id: savedRoutes.length + 1,
      label: formData.label,
      startingLocation: formData.startingLocation,
      endingLocation: formData.endingLocation,
      pickupTime: formData.pickupTime,
      selectedDays,
    };

    setCurrentRoute(newRoute);
    setStep("confirm");
  };
  const handleBack = () => {
    setStep("select");
    setFormData({
      label: "",
      startingLocation: "",
      endingLocation: "",
      pickupTime: "",
    });
    setSelectedDays([]);
  };

  const handleConfirmRide = () => {
    setStep("select");
    setShowPageMap(true);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>

        {step === "select" && (
          <>
            <h2 className="title">Your Routes</h2>
            <button className="submit-button" onClick={() => setStep("form")}>
              Add New Route +
            </button>

            {savedRoutes.length === 0 ? (
              <p className="empty-message">
                No routes yet. Add one to get started!
              </p>
            ) : (
              <div className="route-list">
                {savedRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="route-item"
                    onClick={() => {
                      setCurrentRoute(route);
                      setStep("match");
                    }}
                  >
                    {route.label}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {step === "form" && (
          <>
            <h2 className="modal-title">
              {mode === "find" ? "Find a Ride" : "Offer a Ride"}
            </h2>
            <form className="modal-form" onSubmit={handleSubmitForm}>
              <label>Route Name: </label>
              <input
                type="text"
                required
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              ></input>
              <label>Starting Location:</label>
              <input
                type="text"
                required
                value={formData.startingLocation}
                onChange={(e) =>
                  setFormData({ ...formData, startingLocation: e.target.value })
                }
              />

              <label>Ending Location:</label>
              <input
                type="text"
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
            <button className="back-button" onClick={() => handleBack()}>
              Back
            </button>
          </>
        )}

        {step === "confirm" && currentRoute && (
          <>
            <h2 className="title">Confirm Route</h2>
            <div className="confirmation-details">
              <p>
                <strong>From:</strong> {currentRoute.startingLocation}
              </p>
              <p>
                <strong>To:</strong> {currentRoute.endingLocation}
              </p>
              <p>
                <strong>Time:</strong> {formatTime(currentRoute.pickupTime)}
              </p>
              <p>
                <strong>Days:</strong> {currentRoute.selectedDays.join(", ")}
              </p>
            </div>
            <button
              className="submit-button"
              onClick={() => {
                setSavedRoutes([...savedRoutes, currentRoute]);
                setFormData({
                  label: "",
                  startingLocation: "",
                  endingLocation: "",
                  pickupTime: "",
                });
                setSelectedDays([]);
                setCurrentRoute(null);
                setStep("select");
              }}
            >
              Submit
            </button>
            <button className="back-button" onClick={() => handleBack()}>
              Back
            </button>
          </>
        )}
      </div>

      <MatchingRidesModal
        isOpen={step === "match"}
        closeModal={() => setStep("select")}
        onConfirm={handleConfirmRide}
        restoreMap={() => setShowPageMap(true)}
      />
    </div>
  );
};

export default RoutesModal;
