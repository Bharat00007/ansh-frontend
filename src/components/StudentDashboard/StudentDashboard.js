import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from '../../pages/StudentDashboard/Home';
import Events from '../../pages/StudentDashboard/Events';
import Profile from '../../pages/StudentDashboard/Profile';
import Internships from '../../pages/StudentDashboard/Internships';

function StudentDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("❌ Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <Navbar />  {/* Ensure Navbar is displayed on all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/internships" element={<Internships />} />
      </Routes>
    </div>
  );
}

export default StudentDashboard;
