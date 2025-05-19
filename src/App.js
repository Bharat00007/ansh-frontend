import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import OrganizerDashboard from "./components/OrganizerDashboard/OrganizerDashboard";
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import LandingPage from "./pages/LandingPage";
import LoginSignup from "./pages/LoginSignup";
import Home from "./pages/StudentDashboard/Home";
import Events from "./pages/StudentDashboard/Events";
import Profile from "./pages/StudentDashboard/Profile";
import Internships from "./pages/StudentDashboard/Internships";
import EventAnalytics from "./components/OrganizerDashboard/EventAnalytics";
import "./App.css";
import PaymentPage from './components/StudentDashboard/PaymentPage';
import RegistrationForm from './components/StudentDashboard/RegistrationForm';

// Import Organizer components
import ManageRegistrations from "./components/OrganizerDashboard/RegistrationManagement";
import OrganizerProfile from "./components/OrganizerDashboard/OrganizerProfile";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const firestore = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDocRef = doc(firestore, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
          } else {
            console.log("User document not found in Firestore");
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignup isSignup={false} />} />
        <Route path="/signup" element={<LoginSignup isSignup={true} />} />

        {/* Protected Routes */}
        <Route
          path="/student-dashboard/*"
          element={
            currentUser && userRole === "student" ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/organizer-dashboard/*"
          element={
            currentUser && userRole === "organizer" ? (
              <OrganizerDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/event-analytics"
          element={
            currentUser && userRole === "organizer" ? (
              <EventAnalytics />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Organizer Routes */}
        <Route
          path="/organizer-profile"
          element={
            currentUser && userRole === "organizer" ? (
              <OrganizerProfile />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/manage-registrations"
          element={
            currentUser && userRole === "organizer" ? (
              <ManageRegistrations />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />


        <Route path="/" element={<RegistrationForm />} />
        <Route path="/payment" element={<PaymentPage />} />
      

        {/* Student Routes */}
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/internships" element={<Internships />} />
      </Routes>
    </Router>
  );
}

export default App;