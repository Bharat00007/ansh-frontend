import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore, storage } from '../../firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updatePassword } from 'firebase/auth';
import { FaUser, FaCog, FaBell, FaShieldAlt, FaCamera, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaPencilAlt, FaUniversity, FaEnvelope, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import './OrganizerProfile.css';

function OrganizerProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State for user details
  const [userId, setUserId] = useState(null);
  const [organizer, setOrganizer] = useState({});
  const [formData, setFormData] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch user details from Firestore
  useEffect(() => {
    const fetchUserData = async (uid) => {
      const userDocRef = doc(firestore, "users", uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setOrganizer(userSnap.data());
        setFormData(userSnap.data()); // Pre-fill form data
      }
    };

    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
      }
    });
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle profile image upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profile-images/${userId}`);
    await uploadBytes(storageRef, file);

    // Get download URL
    const imageUrl = await getDownloadURL(storageRef);

    // Update Firestore
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, { profileImage: imageUrl });

    setOrganizer((prev) => ({ ...prev, profileImage: imageUrl }));
    alert("Profile picture updated!");
  };

  // Save Profile Updates
  const saveProfileChanges = async () => {
    if (userId) {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        name: formData.name,
        location: formData.location,
        college: formData.college,
        designation: formData.designation,
        department: formData.department
      });
      setOrganizer({ ...organizer, ...formData });
      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    }
  };

  // Update Password
  const updateUserPassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await updatePassword(auth.currentUser, formData.newPassword);
      alert("Password updated successfully!");
      setIsChangingPassword(false);
    } catch (error) {
      alert("Error updating password.");
      console.error(error);
    }
  };

  return (
    <div className="page-container organizer-profile">
      <nav className="organizer-nav">
        <div className="logo">EVENTO - ORGANIZER PROFILE</div>
        <div className="nav-actions">
          <button className="create-event-btn" onClick={() => navigate('/organizer-dashboard')}>Dashboard</button>
          <img src={organizer.profileImage} alt="Organizer Profile" className="profile-pic" />
        </div>
      </nav>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-pic-container">
            <img src={organizer.profileImage} alt="Organizer" className="profile-pic" />
            <button className="edit-pic-btn" onClick={() => fileInputRef.current.click()}>
              <FaCamera />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
          </div>

          <div className="profile-info">
            <h2>{organizer.name}</h2>
            <p><FaEnvelope /> {organizer.email}</p>
            <p><FaMapMarkerAlt /> {organizer.location}</p>
            <p><FaUniversity /> {organizer.college}</p>
            <p><FaIdCard /> {organizer.designation}</p>
          </div>
        </div>

        <div className="profile-content">
          {/* Personal Information Section */}
          <div className="section-card">
            <h3><FaUser className="section-icon" /> Personal Information</h3>
            {isEditingProfile ? (
              <>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="edit-form-control" placeholder="Full Name" />
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="edit-form-control" placeholder="Location" />
                <input type="text" name="college" value={formData.college} onChange={handleInputChange} className="edit-form-control" placeholder="College/University" />
                <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} className="edit-form-control" placeholder="Designation" />
                <input type="text" name="department" value={formData.department} onChange={handleInputChange} className="edit-form-control" placeholder="Department" />
                <button className="profile-action-btn" onClick={saveProfileChanges}>Save Changes</button>
                <button className="profile-action-btn cancel-btn" onClick={() => setIsEditingProfile(false)}>Cancel</button>
              </>
            ) : (
              <button className="profile-action-btn" onClick={() => setIsEditingProfile(true)}><FaPencilAlt /> Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerProfile;
