import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";

function RegistrationForm({ closeModal, eventName, eventPrice }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    firstName: "",
    lastName: "",
    instituteName: "",
  });

  // ✅ Fetch current user from Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setFormData((prevData) => ({
          ...prevData,
          email: user.email, // Auto-fill email if user is logged in
        }));
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to continue.");
      navigate("/login");
      return;
    }

    // ✅ Navigate to Payment Page with event details
    navigate("/payment", {
      state: {
        eventName: eventName,
        amount: eventPrice,
      },
    });
  };

  return (
    <div className="registration-form">
      <h2>{eventName} - Registration</h2>
      <form onSubmit={handleProceedToPayment}>
        <div className="form-group">
          <label>Email*</label>
          <input type="email" name="email" value={formData.email} readOnly required />
        </div>

        <div className="form-group">
          <label>Mobile*</label>
          <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>First Name*</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Last Name*</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Institute Name*</label>
          <input type="text" name="instituteName" value={formData.instituteName} onChange={handleChange} required />
        </div>

        <button type="submit" className="primary-btn">Buy Ticket</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
