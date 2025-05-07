import React, { useState, useEffect } from "react";
import "./RoutesModal.css";
import MatchingRidesModal from "../FindingRidesModal/FindingRidesModal";

interface RoutesModalProps {
  isOpen: boolean;
  closeModal: () => void;
  mode: "find" | "offer" | null;
  setShowPageMap: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  createdAt: string;
  routes: BackendRoute[];
}

interface BackendRoute {
  id?: string;
  label: string;
  startLocation: string;
  endLocation: string;
  pickupTime: string;
  daysOfWeek: string[];
  type: "offering" | "requested";
}

type Step = "select" | "form" | "confirm";

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
  const [step, setStep] = useState<Step>(mode === "find" ? "form" : "select");
  const [formData, setFormData] = useState({
    label: "",
    startingLocation: "",
    endingLocation: "",
    pickupTime: "",
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [currentRoute, setCurrentRoute] = useState<SavedRoute | null>(null);
  const [showFindingRidesModal, setShowFindingRidesModal] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [activeInput, setActiveInput] = useState<"start" | "end" | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!isOpen || !userId) return;

    setStep("select");

    const fetchUserRoutes = async () => {
      try {
        const res = await fetch(`http://localhost:3000/database`);
        const data = await res.json();

        const rawUser = (data?.users as BackendUser[]).find(
          (u) => u.id === userId
        );

        const userRoutes: SavedRoute[] =
          rawUser?.routes?.map((route, i) => ({
            id: i + 1,
            label: route.label,
            startingLocation: route.startLocation,
            endingLocation: route.endLocation,
            pickupTime: route.pickupTime,
            selectedDays: route.daysOfWeek,
          })) || [];

        setSavedRoutes(userRoutes);
      } catch (err) {
        console.error("Failed to fetch user routes:", err);
      }
    };

    fetchUserRoutes();
  }, [isOpen, userId]);

  const formatTime = (timeStr: string) => {
    const [hourStr, minuteStr] = timeStr.split(":");
    const hour = parseInt(hourStr, 10);
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minuteStr} ${isPM ? "PM" : "AM"}`;
  };

  const toggleDaySelection = (day: string) => {
    setSelectedDays((prevSelected) =>
      prevSelected.includes(day)
        ? prevSelected.filter((d) => d !== day)
        : [...prevSelected, day]
    );
  };

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
      const data = await res.json();
      const suggestions = data.map(
        (item: NominatimResult) => item.display_name
      );
      if (type === "start") {
        setStartSuggestions(suggestions);
      } else {
        setEndSuggestions(suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
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
    setHasSaved(false);
  };

  const handleBack = () => {
    setStep(mode === "find" ? "form" : "select");
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

  const openFindModal = () => {
    setShowFindingRidesModal(true);
  };

  const handleSaveRoute = async () => {
    if (!currentRoute || hasSaved) return;

    const userSession = localStorage.getItem("userSession");
    if (!userSession) {
      alert("You must be logged in to save a route.");
      return;
    }

    const routeData = {
      type: mode === "offer" ? "offering" : "requested",
      startLocation: currentRoute.startingLocation,
      endLocation: currentRoute.endingLocation,
      pickupTime: currentRoute.pickupTime,
      daysOfWeek: currentRoute.selectedDays,
      label: currentRoute.label,
    };

    try {
      const res = await fetch(`http://localhost:3000/users/${userId}/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routeData),
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Failed to save route: " + (error?.error || "Unknown error"));
        return;
      }

      setSavedRoutes([
        ...savedRoutes,
        {
          ...currentRoute,
          startingLocation: routeData.startLocation,
          endingLocation: routeData.endLocation,
        },
      ]);

      setFormData({
        label: "",
        startingLocation: "",
        endingLocation: "",
        pickupTime: "",
      });
      setSelectedDays([]);
      setCurrentRoute(null);
      setStep("select");
      setHasSaved(true);
    } catch (error) {
      console.error("Error saving route:", error);
      alert("An error occurred while saving your route.");
    }
  };

  const handleDeleteRoute = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedRoutes(savedRoutes.filter((route) => route.id !== id));
    if (currentRoute?.id === id) {
      setCurrentRoute(null);
    }
  };

  const handleSeeDrivers = (route: SavedRoute, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentRoute(route);
    setShowFindingRidesModal(true);
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
                      setStep("confirm");
                    }}
                  >
                    <div className="route-info">
                      <h3 style={{ fontWeight: "bold" }}>{route.label}</h3>
                      <p>
                        <strong>From:</strong> {route.startingLocation}
                      </p>
                      <p>
                        <strong>To:</strong> {route.endingLocation}
                      </p>
                      <p>
                        <strong>Time:</strong> {formatTime(route.pickupTime)}
                      </p>
                      <p>
                        <strong>Days:</strong> {route.selectedDays.join(", ")}
                      </p>
                    </div>
                    <div className="route-actions">
                      <button
                        className="action-btn delete-btn"
                        onClick={(e) => handleDeleteRoute(route.id, e)}
                      >
                        Delete
                      </button>
                      <button
                        className="action-btn drivers-btn"
                        onClick={(e) => handleSeeDrivers(route, e)}
                      >
                        See Drivers
                      </button>
                    </div>
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
              <label>Route Name:</label>
              <input
                type="text"
                required
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              />

              <label>Starting Location:</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  required
                  value={formData.startingLocation}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, startingLocation: val });
                    if (debounceTimer) clearTimeout(debounceTimer);
                    const timer = setTimeout(() => {
                      fetchAddressSuggestions(val, "start");
                    }, 500);
                    setDebounceTimer(timer);
                    setActiveInput("start");
                  }}
                  onBlur={() => setTimeout(() => setStartSuggestions([]), 200)}
                />
                {activeInput === "start" && startSuggestions.length > 0 && (
                  <ul className="autocomplete-list">
                    {startSuggestions.map((s, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setFormData({ ...formData, startingLocation: s });
                          setStartSuggestions([]);
                        }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <label>Ending Location:</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  required
                  value={formData.endingLocation}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, endingLocation: val });
                    if (debounceTimer) clearTimeout(debounceTimer);
                    const timer = setTimeout(() => {
                      fetchAddressSuggestions(val, "end");
                    }, 500);
                    setDebounceTimer(timer);
                    setActiveInput("end");
                  }}
                  onBlur={() => setTimeout(() => setEndSuggestions([]), 200)}
                />
                {activeInput === "end" && endSuggestions.length > 0 && (
                  <ul className="autocomplete-list">
                    {endSuggestions.map((s, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setFormData({ ...formData, endingLocation: s });
                          setEndSuggestions([]);
                        }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

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
          </>
        )}

        {step === "confirm" && currentRoute && (
          <>
            <h2 className="title">Confirm Route</h2>
            <div className="confirmation-details">
              <h3 style={{ fontWeight: "bold" }}>{currentRoute.label}</h3>
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
              onClick={handleSaveRoute}
              disabled={hasSaved}
            >
              Save Route
            </button>
            {mode === "find" && (
              <button className="submit-button" onClick={openFindModal}>
                Find Rides
              </button>
            )}
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
          </>
        )}
      </div>

      <MatchingRidesModal
        isOpen={showFindingRidesModal}
        closeModal={() => {
          setShowFindingRidesModal(false);
          closeModal();
          setShowPageMap(true);
        }}
        restoreMap={() => setShowPageMap(true)}
        onConfirm={handleConfirmRide}
        userRoute={{
          id: String(currentRoute?.id || "temp"),
          type: "requested",
          startLocation: currentRoute?.startingLocation || "",
          endLocation: currentRoute?.endingLocation || "",
          pickupTime: currentRoute?.pickupTime || "",
          daysOfWeek: currentRoute?.selectedDays || [],
          createdAt: new Date().toISOString(),
        }}
      />
    </div>
  );
};

export default RoutesModal;
