import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent: React.FC = () => {
  useEffect(() => {
    const map = L.map("map").setView([42.3601, -71.0589], 13); // Default to Boston

    // Load OpenStreetMap tiles
    const tileLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
        detectRetina: true, // Higher resolution tiles
        maxZoom: 18,
      }
    );

    tileLayer.addTo(map);

    // Try to get user's location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          map.setView(userLocation, 13);
          L.marker(userLocation)
            .addTo(map)
            .bindPopup("You are here")
            .openPopup();
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Geolocation failed. Showing default location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }

    return () => {
      map.remove(); // Clean up when unmounting
    };
  }, []);

  return <div id="map" className="map-container"></div>;
};

export default MapComponent;
