import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar'; // Import the Navbar component
import Home from '../../pages/Home';
import Events from '../../pages/Events';
import Profile from '../../pages/Profile';
import Internships from '../../pages/Internships';

function StudentDashboard() {
  return (
    <div className="dashboard-container">
      <Navbar /> {/* Include the Navbar */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/internships" element={<Internships />} />
        </Routes>
      </div>
    </div>
  );
}

export default StudentDashboard;
