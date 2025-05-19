import React, { useState, useEffect } from 'react';
import './Profile.css';
import { FaEdit, FaBuilding, FaGraduationCap, FaShareAlt, FaEye, FaFileAlt } from 'react-icons/fa';
import Navbar from "../../components/StudentDashboard/Navbar";
import { auth, firestore } from '../../firebase-config'; // Import Firestore
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";


function ImprovedProfile() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInstitution, setUserInstitution] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  
    return () => unsubscribe(); // Cleanup function
  }, []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userId = user.uid;
        setUserId(userId);
  
        try {
          const userRef = doc(firestore, "users", userId);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.firstName + " " + userData.lastName);
            setUserEmail(userData.email);
            setUserInstitution(userData.institution || "");
          } else {
            console.warn("No user data found.");
          }
  
          // Fetch registered events
          const q = query(collection(firestore, "registrations"), where("userId", "==", userId));
          const querySnapshot = await getDocs(q);
          setRegisteredEvents(querySnapshot.docs.map((doc) => doc.data()));
  
        } catch (error) {
          console.error("🔥 Firestore Error:", error);
        }
      } else {
        setCurrentUser(null);
        console.warn("User is not authenticated.");
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  

  const handleSaveProfile = async () => {
    if (!userId) return;
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, {
      firstName: userName.split(" ")[0],
      lastName: userName.split(" ").slice(1).join(" "),
      email: userEmail,
      institution: userInstitution,
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="nav">
        <Navbar />
      </div>
      <div className="profile-banner">
        <div className="banner-pattern"></div>
      </div>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="avatar-container">
              <img src="profile-image-url" alt="Profile" className="avatar" />
            </div>
            <div className="user-details">
              {isEditing ? (
                <>
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="edit-input" />
                  <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="edit-input" />
                  <input type="text" value={userInstitution} onChange={(e) => setUserInstitution(e.target.value)} className="edit-input" />
                  <button className="primary-btn small" onClick={handleSaveProfile}>Save</button>
                </>
              ) : (
                <>
                  <h1 className="user-name">{userName}</h1>
                  <div className="user-username">@{userEmail}</div>
                  <div className="user-institution">
                    <FaGraduationCap className="icon" /> <span>{userInstitution}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="profile-actions">
            <button className="action-btn primary-btn" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>
        <div className="profile-content-grid">
          <div className="profile-column">
            <div className="profile-card">
              <div className="card-header">
                <h2>Your Enrollments</h2>
              </div>
              <div className="tabs">
                <button className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>Upcoming</button>
                <button className={`tab ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>Past</button>
              </div>
              <div className="card-body">
                {registeredEvents.length > 0 ? (
                  registeredEvents.map((event, index) => (
                    <div key={index} className="event-card">
                      <h3>{event.eventName}</h3>
                      <p>Date: {event.date}</p>
                      <p>Status: Confirmed</p>
                    </div>
                  ))
                ) : (
                  <p>No enrollments yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImprovedProfile;
