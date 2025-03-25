import React from "react";
import logo from "../../assets/CarPals_Logo_And_Name.png";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="CarPals Logo" className="logo" />
      </div>
      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/rides">Find Rides</a>
        <a href="/offer">Offer Ride</a>
        <a href="/profile">Profile</a>
      </nav>
    </header>
  );
};

export default Header;
