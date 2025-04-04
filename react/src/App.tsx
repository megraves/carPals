import React, { JSX, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import ActionButton from "./components/ActionButton/ActionButton";
import RoutesModal from "./components/RoutesModal/RoutesModal";
import "./App.css";
import MapComponent from "./components/MapComponent/MapComponent";
import ProfileInfo from "./components/ProfileInfo/ProfileInfo";
import ProfileRides from "./components/ProfileRides/ProfileRides";
import DropDownModal from "./components/DropDownModal/DropDownModal";
import InviteFriends from "./components/InviteFriends/InviteFriends";
import OfferingRidesModal from "./components/OfferingRidesModal/OfferingRidesModal";


function App() {

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"find" | "offer" | null>(null);
  const [DropModalContent, setDropModalContent] = useState("");
  
  const [ridesOpen, setRidesOpen] = useState(false);
  const [rideList, setRideList] = useState<JSX.Element[] | null>(null);
  const rides = ["Ride 1", "Ride 2", "Ride 3"];

  const [palsOpen, setPalsOpen] = useState(false);
  const [palsList, setPalsList] = useState<JSX.Element[] | null>(null);
  const pals = ["Edwin Tran", "Macy Graves", "Sofia Simonoff", "Lauren Shea"];
  
  const [showPageMap, setShowPageMap] = useState(true);
  const [showOfferingRidesModal, setShowOfferingRidesModal] = useState(false);

  const openFindModal = () => {
    setModalMode("find");
    setModalOpen(true);
  };


  const openOfferModal = () => {
    setShowOfferingRidesModal(true);
    setShowPageMap(false);
  };


  const mapToList = (inputs: string[]) => {
    return inputs.map((input, index) => (
      <li key={index} className="input-item">
        <button className="input-button" onClick={() => handleItemClick(input)}>
          {input}
        </button>
      </li>
    ));
  };


  const dropDown = (
    inputs: string[],
    listSetter: React.Dispatch<React.SetStateAction<JSX.Element[] | null>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setOpen((prev) => !prev);
    listSetter((prev) => (prev ? null : mapToList(inputs)));
  };


  const handleItemClick = (item: string) => {
    setDropModalContent(`Information about ${item}`);
    setModalOpen(true);
  };


  const closeModal = () => {
    setModalOpen(false);
    setDropModalContent("");
  };


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="home-page">
              <Header />
              <div className="home-content">
                <div className="ride-list-button">
                  <ActionButton
                    label="My Rides"
                    action={() => dropDown(rides, setRideList, setRidesOpen)}
                    id="my-rides"
                  />
                  {ridesOpen && <ul className="rides-dropdown">{rideList}</ul>}
                </div>
                <div className="pal-list-button">
                  <ActionButton
                    label="My Pals"
                    action={() => dropDown(pals, setPalsList, setPalsOpen)}
                    id="my-pals"
                  />
                  {palsOpen && <ul className="pals-dropdown">{palsList}</ul>}
                </div>
                <DropDownModal
                  showModal={isModalOpen}
                  closeModal={closeModal}
                  content={DropModalContent}
                />
                <div className="map-wrapper-home">
                  <MapComponent mapId="home-map" className="home-container" />
                </div>
              </div>
              <Footer />
            </div>
          }
        />


        <Route
          path="/profile"
          element={
            <div className="profile-page">
              <Header />
              <ProfileInfo />
              <ProfileRides />
              <InviteFriends userId="current-user-id" />
              <Footer />
            </div>
          }
        />


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
                  {showPageMap && (
                    <MapComponent mapId="plan-map" className="plan-container" />
                  )}
                </div>
                <RoutesModal
                  isOpen={isModalOpen}
                  closeModal={() => {
                    setModalOpen(false);
                    setShowPageMap(true);
                  }}
                  mode={modalMode}
                  setShowPageMap={setShowPageMap}
                />
                <OfferingRidesModal
                  isOpen={showOfferingRidesModal}
                  closeModal={() => {
                    setShowOfferingRidesModal(false);
                    setShowPageMap(true);
                  }}
                  restoreMap={() => setShowPageMap(true)}
                  onSuccess={() => {
                    setShowOfferingRidesModal(false);
                    setShowPageMap(true);
                  }}
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
