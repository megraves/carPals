import React, { useState } from "react";
import MapComponent from "../MapComponent/MapComponent";
import "./OfferingRidesModal.css";

interface OfferingRidesModalProps {
  isOpen: boolean;
  closeModal: () => void;
  restoreMap: () => void;
  onSuccess?: () => void;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

const OfferingRidesModal: React.FC<OfferingRidesModalProps> = ({
  isOpen,
  closeModal,
  restoreMap,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    startLocation: "",
    endLocation: "",
    departureTime: "",
    availableDays: [] as string[],
    seatsAvailable: "1",
    vehicleType: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [activeInput, setActiveInput] = useState<"start" | "end" | null>(null);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const vehicleTypes = ["Sedan", "SUV", "Truck", "Van", "Hatchback"];

  const fetchAddressSuggestions = async (
    query: string,
    type: "start" | "end"
  ) => {
    if (!query.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&addressdetails=1&limit=5&countrycodes=us`;

    try {
      const res = await fetch(url);
      const data: NominatimResult[] = await res.json();
      const suggestions = data.map((item) => item.display_name);

      if (type === "start") {
        setStartSuggestions(suggestions);
      } else {
        setEndSuggestions(suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Ride offered:", formData);

    setShowSuccess(true);

    setFormData({
      startLocation: "",
      endLocation: "",
      departureTime: "",
      availableDays: [],
      seatsAvailable: "1",
      vehicleType: "",
    });

    setTimeout(() => {
      setShowSuccess(false);
      closeModal();
      restoreMap();
      if (onSuccess) onSuccess();
    }, 2000);
  };

  const toggleDaySelection = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {showSuccess && (
        <div className="success-notification-overlay">
          <div className="success-notification">
            Ride offer submitted successfully!
          </div>
        </div>
      )}

      <div className="modal-overlay">
        <div className="modal-large">
          <button className="close-button" onClick={closeModal}>
            &times;
          </button>

          <div className="modal-layout">
            <div className="modal-map">
              <MapComponent
                mapId="offer-ride-map"
                className="modal-container"
              />
            </div>

            <div className="modal-form-container">
              <form onSubmit={handleSubmit} className="scrollable-form">
                <h2>Offer a Ride</h2>

                <div className="form-group" style={{ position: "relative" }}>
                  <label>Start Location</label>
                  <input
                    type="text"
                    value={formData.startLocation}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, startLocation: val });
                      fetchAddressSuggestions(val, "start");
                      setActiveInput("start");
                    }}
                    onBlur={() =>
                      setTimeout(() => setStartSuggestions([]), 200)
                    }
                    required
                  />
                  {activeInput === "start" && startSuggestions.length > 0 && (
                    <ul className="autocomplete-list">
                      {startSuggestions.map((s, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setFormData({ ...formData, startLocation: s });
                            setStartSuggestions([]);
                          }}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="form-group" style={{ position: "relative" }}>
                  <label>End Location</label>
                  <input
                    type="text"
                    value={formData.endLocation}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, endLocation: val });
                      fetchAddressSuggestions(val, "end");
                      setActiveInput("end");
                    }}
                    onBlur={() => setTimeout(() => setEndSuggestions([]), 200)}
                    required
                  />
                  {activeInput === "end" && endSuggestions.length > 0 && (
                    <ul className="autocomplete-list">
                      {endSuggestions.map((s, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setFormData({ ...formData, endLocation: s });
                            setEndSuggestions([]);
                          }}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="form-group">
                  <label>Departure Time</label>
                  <input
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departureTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Seats Available</label>
                  <select
                    value={formData.seatsAvailable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seatsAvailable: e.target.value,
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num.toString()}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleType: e.target.value })
                    }
                    required
                  >
                    <option value="">Select vehicle</option>
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Days Available</label>
                  <div className="days-checkbox-group">
                    {daysOfWeek.map((day) => (
                      <label key={day} className="day-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.availableDays.includes(day)}
                          onChange={() => toggleDaySelection(day)}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <button type="submit" className="submit-button">
                    Submit Ride Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferingRidesModal;
