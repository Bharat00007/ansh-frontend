import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarDay, FaMapMarkerAlt, FaUserCheck, FaDownload, FaEye, FaTrash, FaSearch } from 'react-icons/fa';
import './RegistrationManagement.css';

function RegistrationManagement({ eventId }) {
  const navigate = useNavigate(); // Add this hook for navigation
  
  // Sample event data - this would be fetched based on eventId in a real application
  const eventData = {
    id: 'evt-123',
    name: 'Tech Summit 2024',
    date: '12 Jan 2024',
    location: 'Virtual Event',
    isOnline: true,
    totalCapacity: 500,
    totalRegistrations: 230,
    checkedIn: 145,
    pending: 70,
    cancelled: 15
  };

  // Sample registrants data - would be fetched from backend in real application
  const [registrants, setRegistrants] = useState([
    { id: 'REG001', name: 'John Doe', email: 'john.doe@example.com', status: 'checked-in', registrationDate: '2023-12-20' },
    { id: 'REG002', name: 'Jane Smith', email: 'jane.smith@example.com', status: 'pending', registrationDate: '2023-12-21' },
    { id: 'REG003', name: 'Michael Johnson', email: 'michael.j@example.com', status: 'checked-in', registrationDate: '2023-12-21' },
    { id: 'REG004', name: 'Robert Williams', email: 'robert.w@example.com', status: 'cancelled', registrationDate: '2023-12-22' },
    { id: 'REG005', name: 'Emily Davis', email: 'emily.d@example.com', status: 'pending', registrationDate: '2023-12-23' },
    { id: 'REG006', name: 'Sarah Johnson', email: 'sarah.j@example.com', status: 'checked-in', registrationDate: '2023-12-24' },
    { id: 'REG007', name: 'James Anderson', email: 'james.a@example.com', status: 'checked-in', registrationDate: '2023-12-25' },
    { id: 'REG008', name: 'Patricia Moore', email: 'patricia.m@example.com', status: 'pending', registrationDate: '2023-12-26' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter registrants based on search term and status filter
  const filteredRegistrants = registrants.filter(registrant => {
    const matchesSearch = 
      registrant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registrant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registrant.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      registrant.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Handle check-in toggle (in a real app this would update the backend)
  const handleCheckInToggle = (id) => {
    setRegistrants(prevRegistrants => 
      prevRegistrants.map(reg => 
        reg.id === id 
          ? { ...reg, status: reg.status === 'checked-in' ? 'pending' : 'checked-in' } 
          : reg
      )
    );
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    // In a real application, this would generate and download a CSV file
    console.log('Exporting registrants to CSV...');
    alert('Registration data exported to CSV');
  };

  // Updated navigation function that actually navigates back to dashboard
  const handleBackNavigation = () => {
    navigate('/'); // Navigate to root which should be the dashboard
    // Alternative: navigate(-1); // Go back to previous page in history
  };

  return (
    <div className="page-container registration-management">
      <nav className="registration-nav">
        <div className="logo">EVENTO - MANAGE REGISTRATIONS</div>
        <div className="nav-actions">
          <button 
            className="back-button"
            onClick={handleBackNavigation}
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <img 
            src="https://via.placeholder.com/40" 
            alt="Organizer Profile" 
            className="profile-pic" 
            onClick={() => navigate("/organizer-profile")} 
            style={{ cursor: "pointer" }}
          />
        </div>
      </nav>

      <div className="registration-content">
        {/* Event Header */}
        <section className="event-header">
          <h1>{eventData.name}</h1>
          <div className="event-details">
            <span><FaCalendarDay /> {eventData.date}</span>
            <span><FaMapMarkerAlt /> {eventData.location}</span>
          </div>
        </section>

        {/* Registration Overview */}
        <section className="registration-overview">
          <div className="overview-card">
            <h3>{eventData.totalRegistrations}</h3>
            <p>Total Registrations</p>
          </div>
          
          <div className="overview-card">
            <h3>{eventData.totalRegistrations}/{eventData.totalCapacity}</h3>
            <p>Tickets Sold</p>
          </div>
          
          <div className="overview-card">
            <h3>{eventData.checkedIn}</h3>
            <p>Total Check-ins</p>
          </div>
          
          <div className="overview-card">
            <h3>{eventData.pending}</h3>
            <p>Pending Check-ins</p>
          </div>
          
          <div className="overview-card">
            <h3>{eventData.cancelled}</h3>
            <p>Cancellations</p>
          </div>
        </section>

        {/* Registrants List Section */}
        <section className="registrants-section">
          <h2>
            Registrants
            <button className="export-csv-btn" onClick={handleExportCSV}>
              <FaDownload /> Export CSV
            </button>
          </h2>

          <div className="search-filter-bar">
            <div className="search-wrapper" style={{ flex: 1, position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '10px', top: '12px', color: '#ccc' }} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, email or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '35px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <select 
              className="filter-dropdown"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="checked-in">Checked In</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="registrants-table-container">
            <table className="registrants-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrants.map(registrant => (
                  <tr key={registrant.id}>
                    <td>{registrant.id}</td>
                    <td>{registrant.name}</td>
                    <td>{registrant.email}</td>
                    <td>{registrant.registrationDate}</td>
                    <td>
                      <span className={`check-in-status status-${registrant.status}`}>
                        {registrant.status === 'checked-in' ? 'Checked In' : 
                         registrant.status === 'pending' ? 'Pending' : 'Cancelled'}
                      </span>
                    </td>
                    <td className="registrant-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleCheckInToggle(registrant.id)}
                        title={registrant.status === 'checked-in' ? 'Mark as pending' : 'Check in'}
                      >
                        <FaUserCheck />
                      </button>
                      <button className="action-btn" title="View details">
                        <FaEye />
                      </button>
                      <button className="action-btn" title="Remove registration">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RegistrationManagement;