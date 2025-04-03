import React from "react";
import "./RouteSelectorModal.css";

export interface Route {
  id: number;
  label: string;
  startingLocation: string;
  endingLocation: string;
  time: string;
  days: string[];
}

interface RouteSelectorModalProps {
  isOpen: boolean;
  routes: Route[];
  onSelectRoute: (route: Route) => void;
  onAddNewRoute: () => void;
  closeModal: () => void;
}

const RouteSelectorModal: React.FC<RouteSelectorModalProps> = ({
  isOpen,
  routes,
  onSelectRoute,
  onAddNewRoute,
  closeModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content route-selector">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        <button className="add-route-button" onClick={onAddNewRoute}>
          Add New Route +
        </button>

        {routes.length > 0 ? (
          <div className="route-list">
            {routes.map((route) => (
              <div
                key={route.id}
                className="route-item"
                onClick={() => onSelectRoute(route)}
              >
                {route.label}
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">No routes yet. Add one above!</p>
        )}
      </div>
    </div>
  );
};

export default RouteSelectorModal;
