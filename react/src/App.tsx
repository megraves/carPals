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

        // Extract form data using FormData
        const formData = new FormData(form);
        const startingLocation = formData.get("startingLocation") as string;
        const endingLocation = formData.get("endingLocation") as string;
        const pickupTime = formData.get("pickupTime") as string;

        // Extract selected days from DOM
        const selectedDays = Array.from(
          document.querySelectorAll(".day-box.selected")
        ).map((dayElement) => dayElement.getAttribute("title") || "");

        // Update state with ride details
        setRideDetails({
          startingLocation,
          endingLocation,
          pickupTime,
          daysNeeded: selectedDays,
        });

        // Close modal after submission
        setModalOpen(false);
      };

      // Attach event listener to the form
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
      <RoutesModal isOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
      
      {/* Confirmation Popup */}
      {rideDetails && (
        <RideConfirmation 
          rideDetails={rideDetails} 
          onClose={() => setRideDetails(null)}
        />
      )}

      <MyRidesButton />
      <MyPalsButton />
      <MapComponent /> {/* Confirmation appears above this */}
      <Footer />
    </div>
  );
}

export default App;
