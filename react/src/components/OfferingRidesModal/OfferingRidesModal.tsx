import React, { useState } from "react";
import MapComponent from "../MapComponent/MapComponent";
import "./OfferingRidesModal.css";


interface OfferingRidesModalProps {
 isOpen: boolean;
 closeModal: () => void;
 restoreMap: () => void;
 onSuccess?: () => void;
}


const OfferingRidesModal: React.FC<OfferingRidesModalProps> = ({
 isOpen,
 closeModal,
 restoreMap,
 onSuccess,
}) => {
 const [formData, setFormData] = useState({
   startLocation: "",
   endLocation: "",
   departureTime: "",
   availableDays: [] as string[],
   seatsAvailable: "1",
   vehicleType: "",
 });


 const [showSuccess, setShowSuccess] = useState(false);


 const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
 const vehicleTypes = ["Sedan", "SUV", "Truck", "Van", "Hatchback"];


 const handleSubmit = (e: React.FormEvent) => {
   e.preventDefault();
   console.log("Ride offered:", formData);
  
   // Show success message
   setShowSuccess(true);
  
   // Reset form
   setFormData({
     startLocation: "",
     endLocation: "",
     departureTime: "",
     availableDays: [],
     seatsAvailable: "1",
     vehicleType: "",
   });


   // Hide success and close after 2 seconds
   setTimeout(() => {
     setShowSuccess(false);
     closeModal();
     restoreMap();
     if (onSuccess) onSuccess();
   }, 2000);
 };


 const toggleDaySelection = (day: string) => {
   setFormData(prev => ({
     ...prev,
     availableDays: prev.availableDays.includes(day)
       ? prev.availableDays.filter(d => d !== day)
       : [...prev.availableDays, day]
   }));
 };


 if (!isOpen) return null;


 return (
   <>
     {/* Success Notification */}
     {showSuccess && (
       <div className="success-notification-overlay">
         <div className="success-notification">
           Ride offer submitted successfully!
         </div>
       </div>
     )}


     <div className="modal-overlay">
       <div className="modal-large">
         <button className="close-button" onClick={closeModal}>
           &times;
         </button>


         <div className="modal-layout">
           <div className="modal-map">
             <MapComponent mapId="offer-ride-map" className="modal-container" />
           </div>


           <div className="modal-form-container">
             <form onSubmit={handleSubmit} className="scrollable-form">
               <h2>Offer a Ride</h2>


               <div className="form-group">
                 <label>Start Location</label>
                 <input
                   type="text"
                   value={formData.startLocation}
                   onChange={(e) =>
                     setFormData({...formData, startLocation: e.target.value})
                   }
                   required
                 />
               </div>


               <div className="form-group">
                 <label>End Location</label>
                 <input
                   type="text"
                   value={formData.endLocation}
                   onChange={(e) =>
                     setFormData({...formData, endLocation: e.target.value})
                   }
                   required
                 />
               </div>


               <div className="form-group">
                 <label>Departure Time</label>
                 <input
                   type="time"
                   value={formData.departureTime}
                   onChange={(e) =>
                     setFormData({...formData, departureTime: e.target.value})
                   }
                   required
                 />
               </div>


               <div className="form-group">
                 <label>Seats Available</label>
                 <select
                   value={formData.seatsAvailable}
                   onChange={(e) =>
                     setFormData({...formData, seatsAvailable: e.target.value})
                   }
                 >
                   {[1, 2, 3, 4, 5, 6].map(num => (
                     <option key={num} value={num.toString()}>{num}</option>
                   ))}
                 </select>
               </div>


               <div className="form-group">
                 <label>Vehicle Type</label>
                 <select
                   value={formData.vehicleType}
                   onChange={(e) =>
                     setFormData({...formData, vehicleType: e.target.value})
                   }
                   required
                 >
                   <option value="">Select vehicle</option>
                   {vehicleTypes.map(type => (
                     <option key={type} value={type}>{type}</option>
                   ))}
                 </select>
               </div>


               <div className="form-group">
                 <label>Days Available</label>
                 <div className="days-checkbox-group">
                   {daysOfWeek.map(day => (
                     <label key={day} className="day-checkbox">
                       <input
                         type="checkbox"
                         checked={formData.availableDays.includes(day)}
                         onChange={() => toggleDaySelection(day)}
                       />
                       {day}
                     </label>
                   ))}
                 </div>
               </div>


               <div className="form-group">
                 <button type="submit" className="submit-button">
                   Submit Ride Offer
                 </button>
               </div>
             </form>
           </div>
         </div>
       </div>
     </div>
   </>
 );
};


export default OfferingRidesModal;