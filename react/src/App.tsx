import React, { useState } from "react";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import RoutesButton from "./components/RoutesButton/RoutesButton";
import RoutesModal from "./components/RoutesModal/RoutesModal";
import MapComponent from "./components/map/MapComponent";

function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="App">
      <Header />
      <RoutesButton openModal={() => setModalOpen(true)} />
      <RoutesModal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
      />
      <MapComponent />
      <Footer />
    </div>
  );
}

export default App;
