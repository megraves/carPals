document.addEventListener("DOMContentLoaded", function () {
  console.log("Leaflet loaded:", typeof L !== "undefined" ? "Yes" : "No");

  if (typeof L === "undefined") {
    console.error("Leaflet did not load correctly!");
    return;
  }

  var map = L.map("map").setView([42.3601, -71.0589], 13); // Default to Boston

  // Force OpenStreetMap tiles to load
  var tileLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors",
      detectRetina: true, // Higher resolution tiles
      maxZoom: 18,
    }
  );

  tileLayer.addTo(map);
  console.log("Tile layer added:", tileLayer);

  // Try to get user's location
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var userLocation = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        map.setView(userLocation, 13);
        L.marker(userLocation).addTo(map).bindPopup("You are here").openPopup();
        console.log("User location set:", userLocation);
      },
      function (error) {
        console.error("Geolocation error:", error);
        alert("Geolocation failed. Showing default location.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});
