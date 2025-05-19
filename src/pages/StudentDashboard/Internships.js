import React, { useState, useEffect } from "react";
import "./Internships.css";
import Navbar from "../../components/StudentDashboard/Navbar";

const userId = "user123"; // Static user ID (Replace with real auth user ID)

function Internships() {
  const [showApplied, setShowApplied] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [internships, setInternships] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all internships
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch("http://localhost:5000/internships");
        const data = await response.json();
        setInternships(data);
      } catch (error) {
        console.error("❌ Error fetching internships:", error);
      }
    };
    fetchInternships();
  }, []);

  // Fetch applied internships
  useEffect(() => {
    const fetchAppliedInternships = async () => {
      try {
        const response = await fetch(`http://localhost:5000/applied-internships/${userId}`);
        const data = await response.json();
        setAppliedInternships(data);
      } catch (error) {
        console.error("❌ Error fetching applied internships:", error);
      }
    };
    fetchAppliedInternships();
  }, []);

  const handleInternshipClick = (internship) => {
    setSelectedInternship(internship);
    setShowApplyForm(false);
  };

  const handleApplyClick = (internship) => {
    setSelectedInternship(internship);
    setShowApplyForm(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault(); // Prevent default form submit behavior

    try {
      const response = await fetch("http://localhost:5000/apply-internship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          internshipId: selectedInternship.id,
          title: selectedInternship.title,
          companyName: selectedInternship.companyName,
          companyLogo: selectedInternship.companyLogo,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to apply for internship");
      }

      const result = await response.json();
      setSuccessMessage(result.message);

      // Add applied internship to state immediately
      setAppliedInternships([...appliedInternships, { ...selectedInternship, status: "Applied" }]);

      // Hide the form after applying
      setShowApplyForm(false);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("❌ Error applying for internship:", error);
    }
  };

  return (
    <div className="page-container internships-page">
      <div className="nav">
        <Navbar />
      </div>

      <section className="internships-list">
        <div className="internship-options">
          <button onClick={() => setShowApplied(false)}>All Internships</button>
          <button onClick={() => setShowApplied(true)}>My Applied Internships</button>
        </div>

        {successMessage && <p className="success-message">{successMessage}</p>}

        {showApplied ? (
          <div>
            <h2>My Applied Internships</h2>
            <div className="internship-cards">
              {appliedInternships.length > 0 ? (
                appliedInternships.map((internship) => (
                  <div key={internship.internshipId} className="internship-card">
                    <img src={internship.companyLogo} alt="Company Logo" className="company-logo" />
                    <h3>{internship.title}</h3>
                    <p className="company-name">{internship.companyName}</p>
                    <p className="internship-status">{internship.status}</p>
                  </div>
                ))
              ) : (
                <p>No applied internships yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h2>Internship Opportunities</h2>
            <div className="internship-cards">
              {internships.map((internship) => (
                <div key={internship.id} className="internship-card" onClick={() => handleInternshipClick(internship)}>
                  <img src={internship.companyLogo} alt="Company Logo" className="company-logo" />
                  <h3>{internship.title}</h3>
                  <p className="company-name">{internship.companyName}</p>
                  <p className="internship-description">{internship.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedInternship && !showApplyForm && (
          <div className="internship-details">
            <div className="details-header">
              <h2>{selectedInternship.title}</h2>
              <button onClick={() => setSelectedInternship(null)}>Close</button>
            </div>
            <div className="details-body">
              <p><b>Company:</b> {selectedInternship.companyName}</p>
              <p><b>Position:</b> {selectedInternship.position}</p>
              <p><b>Description:</b> {selectedInternship.description}</p>
              <p><b>Location:</b> {selectedInternship.location}</p>
              <p><b>Duration:</b> {selectedInternship.duration}</p>
              <p><b>Eligibility:</b> {selectedInternship.eligibility}</p>
              <p><b>Stipend:</b> {selectedInternship.stipend}</p>
              <button onClick={() => handleApplyClick(selectedInternship)}>Apply Now</button>
            </div>
          </div>
        )}

        {showApplyForm && (
          <div className="apply-form">
            <h2>Apply for {selectedInternship.title} at {selectedInternship.companyName}</h2>
            <form onSubmit={handleApplySubmit}>
              <div className="form-field">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" required />
              </div>
              <div className="form-field">
                <label htmlFor="resume">Upload Resume:</label>
                <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required />
              </div>
              <button type="submit">Submit Application</button>
              <button type="button" onClick={() => setShowApplyForm(false)}>Cancel</button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}

export default Internships;
