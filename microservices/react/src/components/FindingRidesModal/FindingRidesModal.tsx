import React, { useEffect, useState } from "react";
import MapComponent from "../MapComponent/MapComponent";
import RideCard from "../rideCard/rideCard";
import "./FindingRidesModal.css";


interface Route {
  id: string;
  type: string;
  startLocation: string;
  endLocation: string;
  pickupTime: string;
  daysOfWeek: string[];
  createdAt: string;
}

export interface RideMatch {
 id: string;
 firstName: string;
 lastName: string;
 pickUpLocation: string;
 dropOffLocation: string;
 pickUpTime: string;
 daysNeeded: string[];
 distance: number;
 rating?: number;
 vehicle?: string;
}


// interface RawRideData {
//  id?: string;
//  firstName: string;
//  lastName: string;
//  pickUpLocation: string;
//  dropOffLocation: string;
//  pickUpTime: string;
//  daysNeeded?: string[];
//  rating?: number;
//  vehicle?: string;
// }


interface MatchingRidesModalProps {
 isOpen: boolean;
 closeModal: () => void;
 onConfirm: (ride: RideMatch) => void;
 restoreMap: () => void;
 userRoute: Route;
}


const MatchingRidesModal: React.FC<MatchingRidesModalProps> = ({
 isOpen,
 closeModal,
 restoreMap,
 onConfirm,
 userRoute
}) => {
 const [selectedRide, setSelectedRide] = useState<RideMatch | null>(null);
 const [matchedRides, setMatchedRides] = useState<RideMatch[]>([]);
 const [allRides, setAllRides] = useState<RideMatch[]>([]);
 const [showConfirmation, setShowConfirmation] = useState(false);
 const [showSuccess, setShowSuccess] = useState(false);


 // Filter states
 const [distanceFilter, setDistanceFilter] = useState<string>("");
 const [driverNameFilter, setDriverNameFilter] = useState<string>("");
 const [timeRangeFilter, setTimeRangeFilter] = useState<string>("");


 useEffect(() => {
  if (isOpen) {
    const fetchMatchedRides = async (): Promise<RideMatch[]> => {
      try {
        const response = await fetch("http://localhost:3000/match-routes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userRoute),
        });

        if (!response.ok) throw new Error("Matching failed");
        return await response.json();
      } catch (error) {
        console.error("Error fetching matched rides:", error);
        return [];
      }
    };

    fetchMatchedRides().then((rides) => {
      setAllRides(rides);
      setMatchedRides(rides);
    });
  }
}, [isOpen, userRoute]);


 useEffect(() => {
   const applyFilters = (rides: RideMatch[]): RideMatch[] => {
     let filtered = [...rides];


     if (distanceFilter) {
       const maxDistance = parseInt(distanceFilter);
       filtered = filtered.filter(ride => ride.distance <= maxDistance);
     }


     if (driverNameFilter) {
       filtered = filtered.filter(ride =>
         `${ride.firstName} ${ride.lastName}`.toLowerCase()
           .includes(driverNameFilter.toLowerCase())
       );
     }


     if (timeRangeFilter) {
       const [startHour, endHour] = timeRangeFilter.split('-').map(Number);
       filtered = filtered.filter(ride => {
         const rideHour = parseInt(ride.pickUpTime.split(':')[0]);
         return rideHour >= startHour && rideHour < endHour;
       });
     }


     return filtered;
   };


   setMatchedRides(applyFilters(allRides));
 }, [distanceFilter, driverNameFilter, timeRangeFilter, allRides]);


 const handleConfirmRide = () => {
   if (selectedRide) {
     onConfirm(selectedRide);
     setShowConfirmation(false);
     setShowSuccess(true);
     setTimeout(() => {
       setShowSuccess(false);
       closeModal();
       restoreMap();
     }, 3000);
   }
 };


 if (!isOpen) return null;


 return (
   <div className="modal-overlay">
     {/* Confirmation Dialog */}
     {showConfirmation && (
       <div className="confirmation-dialog">
         <div className="confirmation-content">
           <h3>Confirm Ride Request</h3>
           <p>Request ride with {selectedRide?.firstName} {selectedRide?.lastName}?</p>
           <div className="confirmation-buttons">
             <button
               className="confirm-button"
               onClick={handleConfirmRide}
             >
               Confirm
             </button>
             <button
               className="cancel-button"
               onClick={() => setShowConfirmation(false)}
             >
               Cancel
             </button>
           </div>
         </div>
       </div>
     )}


     {/* Success Message */}
     {showSuccess && (
       <div className="success-notification">
         <svg viewBox="0 0 24 24" className="success-icon">
           <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
         </svg>
         <span>Ride Requested Successfully!</span>
       </div>
     )}


     <div className="modal-large">
       <button
         className="close-button"
         onClick={closeModal}
         aria-label="Close modal"
       >
         &times;
       </button>


       <div className="modal-layout">
         <div className="modal-map">
           <MapComponent mapId="modal-map" className="modal-container" />
           <button className="back-button" onClick={closeModal}>
             Back
           </button>
         </div>


         <div className="modal-list">
           <h2 className="title">Nearby Drivers</h2>


           <div className="filter-section">
             <div className="filter-group">
               <label htmlFor="distance-filter">Distance:</label>
               <select
                 id="distance-filter"
                 value={distanceFilter}
                 onChange={(e) => setDistanceFilter(e.target.value)}
               >
                 <option value="">Any distance</option>
                 <option value="5">Within 5 miles</option>
                 <option value="10">Within 10 miles</option>
                 <option value="25">Within 25 miles</option>
               </select>
             </div>


             <div className="filter-group">
               <label htmlFor="driver-filter">Driver Name:</label>
               <input
                 id="driver-filter"
                 type="text"
                 placeholder="Search driver..."
                 value={driverNameFilter}
                 onChange={(e) => setDriverNameFilter(e.target.value)}
               />
             </div>


             <div className="filter-group">
               <label htmlFor="time-filter">Departure Time:</label>
               <select
                 id="time-filter"
                 value={timeRangeFilter}
                 onChange={(e) => setTimeRangeFilter(e.target.value)}
               >
                 <option value="">Any time</option>
                 <option value="0-6">12am - 6am</option>
                 <option value="6-12">6am - 12pm</option>
                 <option value="12-18">12pm - 6pm</option>
                 <option value="18-24">6pm - 12am</option>
               </select>
             </div>
           </div>


           <div className="ride-list-scroll">
             {matchedRides.length > 0 ? (
               matchedRides.map((ride: RideMatch) => (
                 <div
                   key={ride.id}
                   className={`ride-list-item ${
                     selectedRide?.id === ride.id ? "expanded" : ""
                   }`}
                   onClick={() => {
                     setSelectedRide(ride);
                     setShowConfirmation(true);
                   }}
                 >
                   {selectedRide?.id === ride.id ? (
                     <RideCard {...ride} />
                   ) : (
                     <div className="ride-summary">
                       <h3>{ride.firstName} {ride.lastName}</h3>
                       <p>{ride.distance} miles away</p>
                       <p>Departure: {ride.pickUpTime}</p>
                     </div>
                   )}
                 </div>
               ))
             ) : (
               <div className="no-results">
                 No rides match your filters. Try adjusting your criteria.
               </div>
             )}
           </div>


           <div className="confirm-container">
             <button
               className="modern-button"
               onClick={() => {
                 closeModal();
                 restoreMap();
               }}
             >
             </button>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};


export default MatchingRidesModal;
