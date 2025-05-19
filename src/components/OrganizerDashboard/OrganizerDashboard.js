import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarPlus, FaUsers, FaChartLine, FaRegBookmark, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CreateEventModal from './CreateEventModal';
import "./OrganizerDashboard.css";

function OrganizerDashboard() {
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const navigate = useNavigate();
  const eventsGridRef = useRef(null);

  const openCreateEventModal = () => {
    setIsCreateEventModalOpen(true);
  };

  const closeCreateEventModal = () => {
    setIsCreateEventModalOpen(false);
  };

  // Scroll events grid horizontally
  const scrollEvents = (direction) => {
    if (eventsGridRef.current) {
      const scrollAmount = 320; // Approximate width of one card + gap
      const currentScroll = eventsGridRef.current.scrollLeft;
      
      if (direction === 'left') {
        eventsGridRef.current.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: 'smooth'
        });
      } else {
        eventsGridRef.current.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="page-container organizer-dashboard">
      <nav className="organizer-nav">
        <div className="logo">EVENTO - ORGANIZER DASHBOARD</div>
        <div className="nav-actions">
          <button 
            className="create-event-btn"
            onClick={openCreateEventModal}
          >
            Create New Event
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

      <div className="dashboard-content">
        <section className="quick-stats">
          <div className="stat-card">
            <FaCalendarPlus className="stat-icon" />
            <div className="stat-details">
              <h3>12</h3>
              <p>Upcoming Events</p>
            </div>
          </div>

          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <div className="stat-details">
              <h3>3,456</h3>
              <p>Total Registrations</p>
            </div>
          </div>

          <div className="stat-card">
            <FaChartLine className="stat-icon" />
            <div className="stat-details">
              <h3>₹54,000</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <FaRegBookmark className="stat-icon" />
            <div className="stat-details">
              <h3>8</h3>
              <p>Saved Templates</p>
            </div>
          </div>
        </section>

        <section className="recent-events">
          <h2>
            Recent Events
            <div className="scroll-controls">
              <button 
                className="scroll-btn" 
                onClick={() => scrollEvents('left')}
                aria-label="Scroll left"
              >
                <FaChevronLeft />
              </button>
              <button 
                className="scroll-btn" 
                onClick={() => scrollEvents('right')}
                aria-label="Scroll right"
              >
                <FaChevronRight />
              </button>
            </div>
          </h2>
          <div className="events-grid" ref={eventsGridRef}>
            <div className="event-card">
              <img 
                src="https://d3r5yd0374231.cloudfront.net/images-tek/uploads/2024/06/Feature-Image-Tech-Summit.jpg" 
                alt="Tech Summit" 
                className="event-image" 
              />
              <div className="event-details">
                <h3>Tech Summit 2024</h3>
                <p>12 Jan 2024 | Online</p>
                <div className="event-stats">
                  <span>📝 450 Registrations</span>
                  <span>💰 ₹12,000</span>
                </div>
              </div>
            </div>

            <div className="event-card">
              <img 
                src="https://thumbs.dreamstime.com/b/dj-disco-music-party-people-22215831.jpg" 
                alt="Music Fest" 
                className="event-image" 
              />
              <div className="event-details">
                <h3>Campus Music Fest</h3>
                <p>05 Feb 2024 | Offline</p>
                <div className="event-stats">
                  <span>📝 750 Registrations</span>
                  <span>💰 ₹25,000</span>
                </div>
              </div>
            </div>

            <div className="event-card">
              <img 
                src="https://exhibitionglobe.com/wp-content/uploads/2021/06/Art-Exhibition-Types.jpg" 
                alt="Art Exhibition" 
                className="event-image" 
              />
              <div className="event-details">
                <h3>Digital Art Exhibition</h3>
                <p>22 Mar 2024 | Hybrid</p>
                <div className="event-stats">
                  <span>📝 250 Registrations</span>
                  <span>💰 ₹8,000</span>
                </div>
              </div>
            </div>
            
            {/* Added extra cards to demonstrate scrolling */}
            <div className="event-card">
              <img 
                src="https://d3r5yd0374231.cloudfront.net/images-tek/uploads/2024/06/Feature-Image-Tech-Summit.jpg" 
                alt="Dev Conference" 
                className="event-image" 
              />
              <div className="event-details">
                <h3>Dev Conference</h3>
                <p>10 Apr 2024 | Online</p>
                <div className="event-stats">
                  <span>📝 320 Registrations</span>
                  <span>💰 ₹15,000</span>
                </div>
              </div>
            </div>

            <div className="event-card">
              <img 
                src="https://thumbs.dreamstime.com/b/dj-disco-music-party-people-22215831.jpg" 
                alt="EDM Night" 
                className="event-image" 
              />
              <div className="event-details">
                <h3>EDM Night</h3>
                <p>18 May 2024 | Offline</p>
                <div className="event-stats">
                  <span>📝 550 Registrations</span>
                  <span>💰 ₹22,000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <div className="action-card">
              <h3>Create Event</h3>
              <p>Start a new event from scratch or use a template</p>
              <button onClick={openCreateEventModal}>Get Started</button>
            </div>
            <div className="action-card">
              <h3>Event Analytics</h3>
              <p>View detailed insights for your past events</p>
              <button onClick={() => navigate("/event-analytics")}>View Reports</button>
            </div>
            <div className="action-card">
              <h3>Manage Registrations</h3>
              <p>Track and manage event participant details</p>
              <button onClick={() => navigate("/manage-registrations")}>Manage</button> 
            </div>
          </div>
        </section>
      </div>

      {isCreateEventModalOpen && (
        <CreateEventModal onClose={closeCreateEventModal} />
      )}
    </div>
  );
}

export default OrganizerDashboard;