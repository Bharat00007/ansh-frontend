import React, { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const [latestEvents, setLatestEvents] = useState([]);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events"); // Fetch all events
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLatestEvents(data.slice(0, 2)); // Show only the first 2 events
      } catch (error) {
        console.error("❌ Error fetching events:", error);
        setLatestEvents([]); // Avoid breaking UI if there's an error
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="page-container home-page">
      <div className="home-content">
        
      <section className="calendar-section">
          <h2>Calendar</h2>
          <div className="calendar-container">
            <div className="calendar">
              <div className="calendar-header">
                <button>&lt;</button>
                <h3>October 2023</h3>
                <button>&gt;</button>
              </div>
              <table className="calendar-table">
                <thead>
                  <tr>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                    <th>Sun</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Calendar days go here */}
                  <tr>
                    <td>25</td>
                    <td>26</td>
                    <td>27</td>
                    <td>28</td>
                    <td>29</td>
                    <td>30</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                    <td>14</td>
                    <td>15</td>
                  </tr>
                  <tr>
                    <td>16</td>
                    <td>17</td>
                    <td>18</td>
                    <td>19</td>
                    <td>20</td>
                    <td>21</td>
                    <td>22</td>
                  </tr>
                  <tr>
                    <td>23</td>
                    <td>24</td>
                    <td>25</td>
                    <td>26</td>
                    <td>27</td>
                    <td>28</td>
                    <td>29</td>
                  </tr>
                  <tr>
                    <td>30</td>
                    <td>31</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>


        {/* RECOMMENDED EVENTS SECTION */}
        <section className="recommended-events">
          <h2>Recommended for You</h2>
          <div className="event-card-container">
            {latestEvents.length > 0 ? (
              latestEvents.map(event => (
                <div key={event.id} className="event-card">
                  <img src={event.bannerUrl} alt={event.eventName} className="event-image" />
                  <h3>{event.eventName}</h3>
                  <p>{event.description}</p>
                  <button>Learn More</button>
                </div>
              ))
            ) : (
              <p>Loading events...</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
