import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaChartLine, FaUsers, FaTicketAlt, FaMoneyBillWave, FaFilter } from 'react-icons/fa';
import './EventAnalytics.css';

function EventAnalytics() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [dateRange, setDateRange] = useState('last30');
  const [showFilters, setShowFilters] = useState(false);

  // Sample data for the analytics
  const eventOptions = [
    { id: 'all', name: 'All Events' },
    { id: 'tech', name: 'Tech Summit 2024' },
    { id: 'music', name: 'Campus Music Fest' },
    { id: 'art', name: 'Digital Art Exhibition' },
    { id: 'dev', name: 'Dev Conference' },
  ];

  const dateRangeOptions = [
    { id: 'last7', name: 'Last 7 days' },
    { id: 'last30', name: 'Last 30 days' },
    { id: 'last90', name: 'Last 90 days' },
    { id: 'year', name: 'This Year' },
  ];

  // Sample analytics data
  const analyticsData = {
    totalViews: 5624,
    totalRegistrations: 1450,
    conversionRate: 25.8,
    totalRevenue: 54000,
    avgTicketPrice: 372,
  };

  // Sample monthly registration data for chart
  const monthlyRegistrations = [
    { month: 'Jan', registrations: 150 },
    { month: 'Feb', registrations: 320 },
    { month: 'Mar', registrations: 250 },
    { month: 'Apr', registrations: 420 },
    { month: 'May', registrations: 310 },
    { month: 'Jun', registrations: 380 },
  ];

  // Find max value for chart scaling
  const maxRegistrations = Math.max(...monthlyRegistrations.map(data => data.registrations));

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="page-container analytics-dashboard">
      <nav className="analytics-nav">
        <div className="nav-left">
          <button 
            className="back-btn" 
            onClick={() => navigate('/organizer-dashboard')}
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
          <div className="logo">EVENTO - EVENT ANALYTICS</div>
        </div>
        <div className="nav-actions">
          <button 
            className="filter-btn"
            onClick={toggleFilters}
          >
            <FaFilter /> Filters
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

      <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
        <div className="filter-group">
          <label htmlFor="event-select">Event:</label>
          <select 
            id="event-select" 
            value={selectedEvent} 
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            {eventOptions.map(event => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="date-range">Date Range:</label>
          <select 
            id="date-range" 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
          >
            {dateRangeOptions.map(range => (
              <option key={range.id} value={range.id}>{range.name}</option>
            ))}
          </select>
        </div>
        <button className="apply-filters-btn">Apply Filters</button>
      </div>

      <div className="analytics-content">
        {/* Overview Stats */}
        <section className="analytics-overview">
          <h2>Overview</h2>
          <div className="overview-stats">
            <div className="stat-card">
              <FaCalendarAlt className="stat-icon" />
              <div className="stat-details">
                <h3>{analyticsData.totalViews.toLocaleString()}</h3>
                <p>Total Views</p>
              </div>
            </div>

            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div className="stat-details">
                <h3>{analyticsData.totalRegistrations.toLocaleString()}</h3>
                <p>Registrations</p>
              </div>
            </div>

            <div className="stat-card">
              <FaChartLine className="stat-icon" />
              <div className="stat-details">
                <h3>{analyticsData.conversionRate}%</h3>
                <p>Conversion Rate</p>
              </div>
            </div>

            <div className="stat-card">
              <FaMoneyBillWave className="stat-icon" />
              <div className="stat-details">
                <h3>₹{analyticsData.totalRevenue.toLocaleString()}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Trends */}
        <section className="analytics-section">
          <h2>Registration Trends</h2>
          <div className="analytics-chart-container">
            <div className="bar-chart">
              {monthlyRegistrations.map((data, index) => (
                <div className="chart-column" key={index}>
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${(data.registrations / maxRegistrations) * 250}px`, // Fixed height calculation
                      backgroundColor: '#3498db', // Fixed solid color instead of gradient which might be causing issues
                      minHeight: '4px', // Ensure at least a small bar is visible
                      width: '40px', // Ensure consistent width
                    }}
                  >
                    <span className="bar-value">{data.registrations}</span>
                  </div>
                  <div className="bar-label">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="analytics-grid">
          <section className="analytics-section">
            <h2>Ticket Sales</h2>
            <div className="ticket-stats">
              <div className="ticket-stat">
                <div className="ticket-icon">
                  <FaTicketAlt />
                </div>
                <div className="ticket-details">
                  <h3>Total Tickets Sold</h3>
                  <p>{analyticsData.totalRegistrations}</p>
                </div>
              </div>
              <div className="ticket-stat">
                <div className="ticket-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="ticket-details">
                  <h3>Average Ticket Price</h3>
                  <p>₹{analyticsData.avgTicketPrice}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Top Referral Sources */}
        <section className="analytics-section">
          <h2>Top Referral Sources</h2>
          <div className="referral-sources">
            <div className="referral-source">
              <div className="source-rank">1</div>
              <div className="source-details">
                <h3>Social Media</h3>
                <p>42% of registrations</p>
              </div>
              <div className="source-value">610 visitors</div>
            </div>
            <div className="referral-source">
              <div className="source-rank">2</div>
              <div className="source-details">
                <h3>Direct Links</h3>
                <p>31% of registrations</p>
              </div>
              <div className="source-value">450 visitors</div>
            </div>
            <div className="referral-source">
              <div className="source-rank">3</div>
              <div className="source-details">
                <h3>Email Campaigns</h3>
                <p>18% of registrations</p>
              </div>
              <div className="source-value">260 visitors</div>
            </div>
            <div className="referral-source">
              <div className="source-rank">4</div>
              <div className="source-details">
                <h3>Partner Websites</h3>
                <p>9% of registrations</p>
              </div>
              <div className="source-value">130 visitors</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EventAnalytics;