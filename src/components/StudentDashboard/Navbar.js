import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { AiFillHome } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";

function Navbar() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleClickOutside = (event) => {
    if (
      searchDropdownRef.current &&
      !searchDropdownRef.current.contains(event.target)
    ) {
      setIsSearchOpen(false);
    }
    if (
      notificationsDropdownRef.current &&
      !notificationsDropdownRef.current.contains(event.target)
    ) {
      setIsNotificationsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },);

  const notifications = [
    {
      id: 1,
      text: "1 coins added for Daily Visit",
      time: "05 Mar 25, 06:40 PM IST",
    },
    {
      id: 2,
      text: "1 coins added for Daily Visit",
      time: "12 Feb 25, 10:29 AM IST",
    },
    {
      id: 3,
      text: "1 coins added for Daily Visit",
      time: "30 Jan 25, 10:18 PM IST",
    },
    {
      id: 4,
      text: "1 coins added for Daily Visit",
      time: "20 Jan 25, 07:07 PM IST",
    },
    {
      id: 5,
      text: "1 coins added for Daily Visit",
      time: "08 Jan 25, 01:19 PM IST",
    },
    {
      id: 6,
      text: "5 coins added for Daily Visit",
      time: "18 Aug 24, 02:02 PM IST",
    },
    {
      id: 7,
      text: "5 coins added for Daily Visit",
      time: "17 Aug 24, 10:34 AM IST",
    },
    {
      id: 8,
      text: "5 coins added for Daily Visit",
      time: "16 Aug 24, 07:13 PM IST",
    },
    {
      id: 9,
      text: "5 coins added for Opportunity Registration in TATA Crucible Campus Quiz 2024",
      time: "15 Aug 24, 10:52 PM IST",
    },
    {
      id: 10,
      text: "5 coins added for Opportunity Registration in Tata Imagination Challenge 2024: Student Track",
      time: "15 Aug 24, 09:14 PM IST",
    },
    {
      id: 11,
      text: "5 coins added for Daily Visit",
      time: "15 Aug 24, 09:06 PM IST",
    },
  ];

  return (
    <nav className="navbar">
      <div className="logo">EVENTO</div>

      <ul className="nav-links">
        <li>
          <NavLink to="/events" activeClassName="active">
            Events
          </NavLink>
        </li>
        <li>
          <NavLink to="/internships" activeClassName="active">
            Internships
          </NavLink>
        </li>
      </ul>

      <div className="nav-right">
        <button className="search-button" onClick={toggleSearch}>
          <FaSearch />
        </button>
        <button className="notification-button" onClick={toggleNotifications}>
          <IoMdNotifications />
        </button>
        <NavLink to="/student-dashboard" exact activeClassName="active">
          <AiFillHome />
        </NavLink>
        <div className="profile-settings">
          <img
            src="data:image/webp;base64,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"
            alt="Profile"
            className="profile-pic"
            onClick={handleProfileClick}
          />
        </div>
      </div>

      {isSearchOpen && (
        <div className="search-dropdown" ref={searchDropdownRef}>
          <div className="search-dropdown-item">Search Event</div>
          <div className="search-dropdown-item">Open Home</div>
          <div className="search-dropdown-item">Open Calendars</div>
          <div className="search-dropdown-item">Open Discover</div>
          <div className="search-dropdown-item">Open Help</div>
        </div>
      )}

      {isNotificationsOpen && (
        <div className="notifications-dropdown" ref={notificationsDropdownRef}>
          <div className="notifications-header">
            Notifications
            <span className="notifications-close" onClick={toggleNotifications}>
              x
            </span>
          </div>
          <div className="notifications-list">
            <div className="notifications-select">Select</div>
            {notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-icon"><IoMdNotifications /></div>
                <div className="notification-content">
                  <div className="notification-text">{notification.text}</div>
                  <div className="notification-time">{notification.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;