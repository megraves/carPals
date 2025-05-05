import "./ProfileInfo.css";

interface ProfileInfoProps {
  user: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  if (!user) return <p>Loading User Datas...</p>;

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
    </div>
  );
};

export default ProfileInfo;
