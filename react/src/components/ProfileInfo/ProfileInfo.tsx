import './ProfileInfo.css';

const ProfileInfo = () => {
    const mockData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(123) 456-7890",
    };
  
    return (
      <div className="profile-info p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold">Profile Info</h2>
        <p><strong>Name:</strong> {mockData.name}</p>
        <p><strong>Email:</strong> {mockData.email}</p>
        <p><strong>Phone:</strong> {mockData.phone}</p>
      </div>
    );
  };
  
  export default ProfileInfo;