import { JSX, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import ActionButton from "./components/ActionButton/ActionButton";
import RoutesModal from "./components/RoutesModal/RoutesModal";
import "./App.css";
import MapComponent from "./components/MapComponent/MapComponent";
import ProfileInfo from "./components/ProfileInfo/ProfileInfo";
import ProfileRides from "./components/ProfileRides/ProfileRides";

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"find" | "offer" | null>(null);

  const [ridesOpen, setRidesOpen] = useState(false);
  const [palsOpen, setPalsOpen] = useState(false);
  const [rideList, setRideList] = useState<JSX.Element[] | null>(null);
  const [palsList, setPalsList] = useState<JSX.Element[] | null>(null);
  const rides = ["Ride 1", "Ride 2", "Ride 3"];
  const pals = ["Edwin Tran", "Macy Graves", "Sofia Simonoff", "Lauren Shea"];

  const openFindModal = () => {
    setModalMode("find");
    setModalOpen(true);
  };

  const openOfferModal = () => {
    setModalMode("offer");
    setModalOpen(true);
  };

  const mapToList = (inputs: string[]) => {
    return inputs.map((input, index) => (
      <li key={index} className="input-item">
        <button className="input-button">{input}</button>
      </li>
    ));
  };

  const dropDown = (
    inputs: string[],
    listSetter: React.Dispatch<React.SetStateAction<JSX.Element[] | null>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isOpen: boolean
  ) => {
    setOpen(!isOpen);
    if (!isOpen) {
      listSetter(mapToList(inputs));
    } else {
      listSetter(null);
    }
  };

  return (
    <Router>
      <Routes>
        {/* homepage */}
        <Route
          path="/"
          element={
            <div className="home-page">
              <Header />
              <div className="home-content">
                <div className="ride-list-button">
                  <ActionButton
                    label="My Rides"
                    action={() =>
                      dropDown(rides, setRideList, setRidesOpen, ridesOpen)
                    }
                    id="my-rides"
                  />
                  {ridesOpen && <ul className="rides-dropdown">{rideList}</ul>}
                </div>
                <div className="pal-list-button">
                  <ActionButton
                    label="My Pals"
                    action={() =>
                      dropDown(pals, setPalsList, setPalsOpen, palsOpen)
                    }
                    id="my-pals"
                  />
                  {palsOpen && <ul className="pals-dropdown">{palsList}</ul>}
                </div>
                <div className="map-wrapper-home">
                  <MapComponent />
                </div>
              </div>
              <Footer />
            </div>
          }
        />

        {/* profile page */}
        <Route
          path="/profile"
          element={
            <div className="profile-page">
              <Header />
              <ProfileInfo />
              <ProfileRides />
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
              <div className="plan-rides-content">
                <div className="button-section">
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
                <div className="map-wrapper-plan">
                  <MapComponent />
                </div>
                <RoutesModal
                  isOpen={isModalOpen}
                  closeModal={() => setModalOpen(false)}
                  mode={modalMode}
                />
              </div>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
