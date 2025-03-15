import React, { useState } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import RoutesButton from "./components/RoutesButton";
import RoutesModal from "./components/RoutesModal";
import MapComponent from "./components/MapComponent";

function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="App">
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
