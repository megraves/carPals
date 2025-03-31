import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import RoutesButton from "./components/RoutesButton/RoutesButton";
import RoutesModal from "./components/RoutesModal/RoutesModal";
import MapComponent from "./components/map/MapComponent";
import MyRidesButton from "./components/MyRidesButton/MyRidesButton";
import MyPalsButton from "./components/MyPalsButton/MyPalsButton";

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
      <MyRidesButton />
      <MyPalsButton />
      <MapComponent />
      <Footer />
    </div>
  );
}

export default App;
