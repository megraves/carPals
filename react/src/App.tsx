import { useState, useEffect } from "react";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import RoutesButton from "./components/RoutesButton/RoutesButton";
import RoutesModal from "./components/RoutesModal/RoutesModal";
import MapComponent from "./components/map/MapComponent";
import MyRidesButton from "./components/MyRidesButton/MyRidesButton";
import MyPalsButton from "./components/MyPalsButton/MyPalsButton";
import RideConfirmation from "./components/RideConfirmation/RideConfirmation";

interface RideDetails {
  startingLocation: string;
  endingLocation: string;
  pickupTime: string;
  daysNeeded: string[];
}

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);

  useEffect(() => {
    if (isModalOpen) {
      const handleFormSubmit = (event: Event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        const formData = new FormData(form);
        const startingLocation = formData.get("startingLocation") as string;
        const endingLocation = formData.get("endingLocation") as string;
        const pickupTime = formData.get("pickupTime") as string;

        const selectedDays = Array.from(
          document.querySelectorAll(".day-box.selected") || []
        ).map((dayElement) => dayElement.getAttribute("title") || "");

        if (!startingLocation || !endingLocation || !pickupTime || selectedDays.length === 0) {
          alert("Please fill out all fields before submitting.");
          return;
        }

        setRideDetails({
          startingLocation,
          endingLocation,
          pickupTime,
          daysNeeded: selectedDays,
        });

        setModalOpen(false);
      };

      const form = document.querySelector(".modal-form");
      form?.addEventListener("submit", handleFormSubmit);

      return () => {
        form?.removeEventListener("submit", handleFormSubmit);
      };
    }
  }, [isModalOpen]);

  return (
    <div className="App">
      <Header />
      <RoutesButton openModal={() => setModalOpen(true)} />
      <RoutesModal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
      />
      
      {rideDetails && (
        <div className="confirmation-section">
          <RideConfirmation 
            rideDetails={rideDetails} 
            onClose={() => setRideDetails(null)} 
          />
        </div>
      )}

      <MyRidesButton />
      <MyPalsButton />
      <MapComponent />
      <Footer />
    </div>
  );
}

export default App;
