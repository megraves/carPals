import {  useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import ActionButton from "./components/ActionButton/ActionButton";
import RoutesModal from "./components/RoutesModal/RoutesModal";
import "./App.css";
import MapComponent from "./components/MapComponent/MapComponent";
import ProfileInfo from "./components/ProfileInfo/ProfileInfo";
import ProfileRides from "./components/ProfileRides/ProfileRides";
import InviteFriends from "./components/InviteFriends/InviteFriends";
import DropDown from "./components/DropDown/DropDown";
import OfferingRidesModal from "./components/OfferingRidesModal/OfferingRidesModal";


function App() {

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"find" | "offer" | null>(null);
  

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




  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="home-page">
              <Header />
              <div className="home-content">
                <div className="rides-pals-button">
                  <DropDown/>
                </div>
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
