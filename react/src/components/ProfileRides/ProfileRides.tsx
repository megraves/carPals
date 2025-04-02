import './ProfileRides.css';

const MyRides = () => {
  const mockRides = [
    { id: 1, date: "2025-04-05", time: "9:00 AM", route: "Boston to Amherst" },
    { id: 2, date: "2025-04-06", time: "3:00 PM", route: "Amherst to Boston" },
  ];

  return (
    <div className="profile-rides">
      <h2>My Rides</h2>
      <ul>
        {mockRides.map((ride) => (
          <li key={ride.id} className="ride-item">
            <div className="ride-header">
              <p><strong>{ride.route}</strong></p>
              <p><span>{ride.date} at {ride.time}</span></p>
            </div>
            <div className="ride-details">
              <p>Details can go here.</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyRides;
