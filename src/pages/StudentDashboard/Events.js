import React, { useState, useEffect } from 'react';
import './Events.css';
import Navbar from '../../components/StudentDashboard/Navbar';
import ReactModal from 'react-modal';
import RegistrationForm from '../../components/StudentDashboard/RegistrationForm';

ReactModal.setAppElement('#root');

function Events() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [eventsData, setEventsData] = useState([]);  // Stores fetched events
  const [filteredEvents, setFilteredEvents] = useState([]);  // Stores filtered events
  const [filters, setFilters] = useState({
    category: [],
    price: null,
    date: null
  });

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events");
        const data = await response.json();
        setEventsData(data);
        setFilteredEvents(data); // Set initial state
      } catch (error) {
        console.error("❌ Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Function to apply filters
  useEffect(() => {
    let filtered = [...eventsData];

    // Filter by category
    if (filters.category.length > 0) {
      filtered = filtered.filter(event => filters.category.includes(event.eventType));
    }

    // Filter by price
    if (filters.price !== null) {
      filtered = filtered.filter(event => (filters.price === "free" ? event.price === 0 : event.price > 0));
    }

    // Filter by date
    if (filters.date !== null) {
      const today = new Date();
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        if (filters.date === "today") return eventDate.toDateString() === today.toDateString();
        if (filters.date === "tomorrow") {
          const tomorrow = new Date();
          tomorrow.setDate(today.getDate() + 1);
          return eventDate.toDateString() === tomorrow.toDateString();
        }
        if (filters.date === "next-7-days") {
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);
          return eventDate >= today && eventDate <= nextWeek;
        }
        return true;
      });
    }

    setFilteredEvents(filtered);
  }, [filters, eventsData]);

  const handleFilterChange = (type, value) => {
    setFilters(prevFilters => {
      if (type === "category") {
        return {
          ...prevFilters,
          category: prevFilters.category.includes(value)
            ? prevFilters.category.filter(cat => cat !== value)
            : [...prevFilters.category, value]
        };
      }
      return { ...prevFilters, [type]: value };
    });
  };

  const resetFilters = () => {
    setFilters({ category: [], price: null, date: null });
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
    setShowRegistrationForm(false); // Reset registration form visibility
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setShowRegistrationForm(false);
  };

  const handleRegisterClick = () => {
    // Show the registration form inside the modal
    setShowRegistrationForm(true);
  };

  return (
    <div className="page-container events-page">
      <div className="nav">
        <Navbar />
        <div className="heading"><h2>Explore Events</h2></div>
        <div className="events-content">
          
          {/* FILTERS */}
          <aside className="filters-aside">
            <h2>Filters</h2>
            <button className="clear-button" onClick={resetFilters}>Clear All</button>

            {/* Category Filter */}
            <div className="filter-group">
              <h3>Categories</h3>
              <ul className="filter-list">
                {["Music", "Arts", "Technology", "Sports", "Food", "Business"].map(category => (
                  <li key={category}>
                    <input 
                      type="checkbox" 
                      id={category} 
                      checked={filters.category.includes(category)}
                      onChange={() => handleFilterChange("category", category)}
                    />
                    <label htmlFor={category}>{category}</label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h3>Price</h3>
              <ul className="filter-list">
                <li>
                  <input 
                    type="radio" 
                    id="free" 
                    name="price" 
                    checked={filters.price === "free"}
                    onChange={() => handleFilterChange("price", "free")}
                  />
                  <label htmlFor="free">Free</label>
                </li>
                <li>
                  <input 
                    type="radio" 
                    id="paid" 
                    name="price" 
                    checked={filters.price === "paid"}
                    onChange={() => handleFilterChange("price", "paid")}
                  />
                  <label htmlFor="paid">Paid</label>
                </li>
              </ul>
            </div>

            {/* Date Filter */}
            <div className="filter-group">
              <h3>Date</h3>
              <ul className="filter-list">
                <li>
                  <input 
                    type="radio" 
                    id="today" 
                    name="date" 
                    checked={filters.date === "today"}
                    onChange={() => handleFilterChange("date", "today")}
                  />
                  <label htmlFor="today">Today</label>
                </li>
                <li>
                  <input 
                    type="radio" 
                    id="tomorrow" 
                    name="date" 
                    checked={filters.date === "tomorrow"}
                    onChange={() => handleFilterChange("date", "tomorrow")}
                  />
                  <label htmlFor="tomorrow">Tomorrow</label>
                </li>
                <li>
                  <input 
                    type="radio" 
                    id="next-7-days" 
                    name="date" 
                    checked={filters.date === "next-7-days"}
                    onChange={() => handleFilterChange("date", "next-7-days")}
                  />
                  <label htmlFor="next-7-days">Next 7 days</label>
                </li>
              </ul>
            </div>
          </aside>

          {/* EVENTS LIST */}
          <main className="event-list">
            {filteredEvents.length > 0 ? filteredEvents.map((event) => (
              <div key={event.id} className="event-card" onClick={() => openModal(event)}>
                <img src={event.bannerUrl} alt={event.eventName} className="event-image" />
                <h3>{event.eventName}</h3>
                <p className="event-description">{event.description}</p>
                <button onClick={(e) => {
                  e.stopPropagation(); // Prevent the card click from triggering
                  openModal(event);
                }}>
                  {event.price === 0 ? 'Join Now' : 'Buy Tickets'}
                </button>
              </div>
            )) : <p>No events match the selected filters.</p>}
          </main>
        </div>
      </div>

      {/* EVENT DETAILS MODAL with in-modal registration */}
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Event Details"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedEvent && !showRegistrationForm && (
          <div className="event-details-content">
            <button 
              onClick={closeModal} 
              className="close-modal-button"
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              &times;
            </button>
            <img 
              src={selectedEvent.bannerUrl} 
              alt={selectedEvent.eventName} 
              className="event-details-image"
            />
            <h2>{selectedEvent.eventName}</h2>
            
            {/* Display all event details from database */}
            <div style={{ textAlign: 'left', width: '100%', marginBottom: '20px' }}>
              <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedEvent.time}</p>
              <p><strong>Location:</strong> {selectedEvent.location}</p>
              <p><strong>Type:</strong> {selectedEvent.eventType}</p>
              <p><strong>Price:</strong> {selectedEvent.price === 0 ? 'Free' : `₹${selectedEvent.price}`}</p>
              <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
              <p><strong>Description:</strong> {selectedEvent.description}</p>
            </div>
            
            {/* Registration button */}
            <button 
              onClick={handleRegisterClick}
              className="register-button"
            >
              {selectedEvent.price === 0 ? 'Register Now' : 'Buy Tickets'}
            </button>
          </div>
        )}

        {/* In-modal Registration Form */}
        {showRegistrationForm && selectedEvent && (
          <div className="registration-modal">
            <button 
              onClick={() => setShowRegistrationForm(false)}
              style={{ position: 'absolute', top: '10px', left: '10px' }}
            >
              &larr; Back to Event Details
            </button>
            <RegistrationForm 
              event={selectedEvent} 
              onClose={() => {
                setShowRegistrationForm(false);
                setModalIsOpen(false);
              }} 
            />
          </div>
        )}
      </ReactModal>
    </div>
  );
}

export default Events;