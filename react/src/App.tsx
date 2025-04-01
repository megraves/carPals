import { JSX, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import ActionButton from "./components/ActionButton/ActionButton";
import RoutesModal from "./components/RoutesModal/RoutesModal";
import MapComponent from "./components/map/MapComponent";



function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"find" | "offer" | null>(null);
  
  const [dropOpen, setDropOpen] = useState(false);
  const [rideList, setRideList] = useState<JSX.Element[] | null>(null);
  const rides = ["ride 1", "ride 2", "ride 3"];

  const openFindModal = () => {
    setModalMode("find");
    setModalOpen(true);
  };

  const openOfferModal = () => {
    setModalMode("offer");
    setModalOpen(true);
  };

  const mapRidesToList = (rides: string[]) => {
    return rides.map((ride, index) => (
      <li key={index} className="ride-item">
        <button className="ride-button">
        {ride}
        </button>
      </li>
    ));
  };

  const ridesDropDown = () => {
    setDropOpen(!dropOpen);
    if (!dropOpen) {
      setRideList(mapRidesToList(rides));
    } else {
      setRideList(null);
    }
  }




  return (
    <Router>
      <Routes>
        {/* homepage */}
        <Route
          path="/"
          element={
            <div className="App">
              <Header />
              <div className="ride-list">
                <ActionButton
                  label="My Rides"
                  action={ridesDropDown}
                  id="my-rides"
                />
                {dropOpen && (
                  <ul className="rides-dropdown">
                    {rideList}
                  </ul>
                )}
              </div>
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
