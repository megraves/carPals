import { useEffect, useState } from "react";
import ActionButton from "../ActionButton/ActionButton";
import DropDownModal from "../DropDownModal/DropDownModal";

interface Rider {
  firstName: string;
  lastName: string;
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpTime: string;
  daysNeeded: string[];
  role: string;
}

const DropDown = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [dropModalContent, setDropModalContent] = useState("");

  const [ridesOpen, setRidesOpen] = useState(false);
  const [palsOpen, setPalsOpen] = useState(false);

  const [rideData, setRideData] = useState<Rider[]>([]);
  const [palsData, setPalsData] = useState<Rider[]>([]);

  useEffect(() => {
    fetch("./mock_data.json")
      .then((res) => res.json())
      .then((data) => {
        setRideData(data.slice(18, 22));
        setPalsData(data.slice(3, 10)); 
      })
      .catch((err) => console.error("Failed to fetch mock data:", err));
  }, []);

  const handleRideClick = (item: Rider) => {
    let message = '';

    if (item.role == 'driver') {
        message = `${item.firstName} ${item.lastName} will be picking you up!`
    } else {
        message = `You are picking up ${item.firstName} ${item.lastName}!`
    }
    setDropModalContent(
      [message,
        `Pick-up: ${item.pickUpLocation}`,
        `Drop-off: ${item.dropOffLocation}`,
        `Pick-up time: ${item.pickUpTime}`,
        `Days Needed: ${item.daysNeeded.join(", ")}`
      ].join("\n\n")
    );
    setModalOpen(true);
  };

  const handlePalClick = (item: Rider) => {
    setDropModalContent(
      [
        `${item.firstName} ${item.lastName}:`,
        `Shared Route: ${item.pickUpLocation} to ${item.dropOffLocation}`,
        `on ${item.daysNeeded.join(", ")}`
      ].join("\n")
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDropModalContent("");
  };

  const renderRidesList = (items: Rider[]) => {
    return items.map((item, index) => (
      <li key={index} className="input-item">
        <button className="input-button" onClick={() => handleRideClick(item)}>
          {item.dropOffLocation}
        </button>
      </li>
    ));
  };

  const renderPalsList = (items: Rider[]) => {
    return items.map((item, index) => (
      <li key={index} className="input-item">
        <button className="input-button" onClick={() => handlePalClick(item)}>
          {item.firstName} {item.lastName}
        </button>
      </li>
    ));
  };
  return (
    <>
      <div className="ride-list-button">
        <ActionButton
          label="My Rides"
          action={() => setRidesOpen((prev) => !prev)}
          id="my-rides"
        />
        {ridesOpen && <ul className="rides-dropdown">{renderRidesList(rideData)}</ul>}
      </div>

      <div className="pal-list-button">
        <ActionButton
          label="My Pals"
          action={() => setPalsOpen((prev) => !prev)}
          id="my-pals"
        />
        {palsOpen && <ul className="pals-dropdown">{renderPalsList(palsData)}</ul>}
      </div>

      <DropDownModal
        showModal={isModalOpen}
        closeModal={closeModal}
        content={dropModalContent}
      />
    </>
  );
};

export default DropDown;
