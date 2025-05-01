import { useState } from 'react';
import './InviteFriends.css';

interface InviteFriendsProps {
  userId: string;
}

const InviteFriends = ({ userId }: InviteFriendsProps) => {
  const [inviteLink, setInviteLink] = useState('');
  const [message, setMessage] = useState('Join me on CarPals for sustainable commuting!');
  const [isCopied, setIsCopied] = useState(false);

  const generateLink = () => {
    const baseUrl = window.location.origin;
    setInviteLink(`${baseUrl}/invite/${userId}`);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
  };

  return (
    <div className="invite-friends">
      <h3>Invite Friends</h3>
      <textarea
        className="invite-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Add a personal message"
      />
      <button className="generate-btn" onClick={generateLink}>
        Generate Invite Link
      </button>
      
      {inviteLink && (
        <div className="link-section">
          <input 
            type="text" 
            className="invite-link" 
            value={inviteLink} 
            readOnly 
          />
          <button className="copy-btn" onClick={copyToClipboard}>
            {isCopied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
};

export default InviteFriends;
