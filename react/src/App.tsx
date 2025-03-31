import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
    <Router>
      <Routes>
        {/* homepage */}
        <Route
          path="/"
          element={
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
          }
        />

        {/* profile page */}
        <Route 
          path="/profile"
          element={
            <h1>profile page</h1>
          }
        />
        {/* find rides page */}
        <Route
          path="/rides"
          element={
            <h1>find rides page</h1>
          }
        />
        {/* offer rides page */}
        <Route 
          path="/offer"
          element={
            <h1>offer rides page</h1>
          }
        />
      </Routes>
    </Router>

  );
}

export default App;
