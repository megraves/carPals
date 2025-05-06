import { useEffect, useState } from "react";
import "./ProfileInfo.css";

const handleLogout = () => {
  localStorage.removeItem("userSession");
  localStorage.removeItem("userId");
  window.location.href = "/";
};

const ProfileInfo = () => {
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  } | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  if (!user) return <p>Loading User Data...</p>;

  return (
    <div className="profile-info p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold">Profile Info</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Phone:</strong> {user.phone}
      </p>
      <button onClick={handleLogout} className="logout-button">
        Log Out
      </button>
    </div>
  );
};

export default ProfileInfo;
