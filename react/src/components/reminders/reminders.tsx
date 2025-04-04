// src/components/Reminders/Reminders.tsx
import React from "react";
import "./reminder.css";

interface Reminder {
  id: number;
  title: string;
  date: string; // e.g. "Monday, April 8"
  time: string; // e.g. "9:00 AM"
}

const dummyReminders: Reminder[] = [
  { id: 1, title: "Ride to UMass", date: "Monday, April 8", time: "9:00 AM" },
  { id: 2, title: "Ride to Work", date: "Tuesday, April 9", time: "7:30 AM" },
];

const Reminders: React.FC = () => {
  return (
    <div className="reminders-container">
      <h3 className="title">Upcoming Rides</h3>
      {dummyReminders.length === 0 ? (
        <p className="empty-reminder">No rides scheduled yet.</p>
      ) : (
        <ul>
          {dummyReminders.map((r) => (
            <li key={r.id}>
              <strong>{r.title}</strong> <br />
              {r.date} @ {r.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reminders;
