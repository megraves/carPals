import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import ActionButton from "./components/ActionButton/ActionButton";
import RoutesModal from "./components/RoutesModal/RoutesModal";
import MapComponent from "./components/MapComponent/MapComponent";
import MyRidesButton from "./components/MyRidesButton/MyRidesButton";
import MyPalsButton from "./components/MyPalsButton/MyPalsButton";

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"find" | "offer" | null>(null);

  const openFindModal = () => {
    setModalMode("find");
    setModalOpen(true);
  };

  const openOfferModal = () => {
    setModalMode("offer");
    setModalOpen(true);
  };

  return (
    <Router>
      <Routes>
        {/* homepage */}
        <Route
          path="/"
          element={
            <div className="App">
              <Header />
              <MyRidesButton />
              <MyPalsButton />
              <MapComponent />
              <Footer />
            </div>
          }
        />

        {/* profile page */}
        <Route
          path="/profile"
          element={
            <div className="profile">
              <Header />
              <h1>profile page</h1>
              <Footer />
            </div>
          }
        />

        {/* plan a ride page */}
        <Route
          path="/plan-rides"
          element={
            <div className="plan-rides">
              <Header />
              <div className="ride-buttons">
                <ActionButton
                  label="Find a Ride"
                  action={openFindModal}
                  id="find-a-ride"
                />
                <ActionButton
                  label="Offer a Ride"
                  action={openOfferModal}
                  id="offer-a-ride"
                />
              </div>

              <RoutesModal
                isOpen={isModalOpen}
                closeModal={() => setModalOpen(false)}
                mode={modalMode}
              />
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
