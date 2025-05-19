import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import HeroImage from "./image.jpg";

const LandingPage = () => {
  // State for dropdown menu
  const [showDropdown, setShowDropdown] = useState(false);
  // State for navbar background change on scroll
  const [scrolled, setScrolled] = useState(false);
  // State for testimonials
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Create refs for the sections we want to scroll to
  const featuresRef = useRef(null);
  const aboutUsRef = useRef(null);
  
  const testimonials = [
    {
      id: 1,
      stars: 5,
      quote: "This platform made event management a breeze!",
      name: "Alice Johnson",
      title: "Event Organizer, ABC College",
      logo: "Webflow",
    },
    {
      id: 2,
      stars: 5,
      quote: "Finding events has never been easier!",
      name: "Mark Smith",
      title: "Student, XYZ University",
      logo: "Webflow",
    },
    {
      id: 3,
      stars: 5,
      quote: "The registration process is seamless and quick!",
      name: "Emma Davis",
      title: "Participant, DEF Institute",
      logo: "Webflow",
    },
  ];

  // Dropdown menu toggle
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  // Scroll to section function
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Handle scroll event for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Automatic testimonial carousel
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    // Apply floating animation to elements with floating class
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach((element, index) => {
      // Add staggered delay to each element
      element.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Clean up event listeners
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, [testimonials.length]);

  // Parallax effect for hero section
  useEffect(() => {
    const handleParallax = () => {
      const scrollPosition = window.scrollY;
      const heroImage = document.querySelector('.hero-banner');
      const heroText = document.querySelector('.hero-text');
      
      if (heroImage && heroText) {
        heroImage.style.transform = `perspective(1000px) rotateY(-15deg) rotateX(5deg) translateY(${scrollPosition * 0.05}px)`;
        heroText.style.transform = `translateY(${scrollPosition * 0.03}px)`;
      }
    };

    window.addEventListener("scroll", handleParallax);
    
    return () => {
      window.removeEventListener("scroll", handleParallax);
    };
  }, []);

  // Feature box reveal on scroll
  useEffect(() => {
    const handleReveal = () => {
      const featureBoxes = document.querySelectorAll('.feature-box, .feature');
      
      featureBoxes.forEach((box) => {
        const boxTop = box.getBoundingClientRect().top;
        const triggerBottom = window.innerHeight * 0.8;
        
        if (boxTop < triggerBottom) {
          box.classList.add('revealed');
        }
      });
    };

    window.addEventListener("scroll", handleReveal);
    handleReveal(); // Run once on mount
    
    return () => {
      window.removeEventListener("scroll", handleReveal);
    };
  }, []);

  // Add CSS class for feature box reveal animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .feature-box, .feature {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      .feature-box.revealed, .feature.revealed {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-logo">EVENTO</div>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home Page</Link>
          <a onClick={() => scrollToSection(aboutUsRef)} className="navbar-link cursor-pointer">About Us</a>
          <a onClick={() => scrollToSection(featuresRef)} className="navbar-link cursor-pointer">Features</a>
          <div className="relative">
            
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/events" className="dropdown-item">All Events</Link>
                <Link to="/colleges" className="dropdown-item">Partner Colleges</Link>
                <Link to="/faq" className="dropdown-item">FAQ</Link>
              </div>
            )}
          </div>
        </div>
        <div className="navbar-buttons">
          <Link to="/signup" className="btn-join">Join</Link>
          <Link to="/login" className="btn-login">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>Your Gateway to Unforgettable College Events</h1>
          <p>
            Discover exciting inter-college events tailored just for you. Join us to connect, engage, and make lasting memories!
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn-hero floating">Get Started</Link>
            <Link to="/login" className="btn-outline floating">Login</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={HeroImage} alt="College Event" className="hero-banner"></img>
        </div>
      </div>
      
      <section className="features" ref={featuresRef}>
        <div className="features-container">
          <div className="features-header">
            <h4>Features</h4>
            <h2>Explore Our Key Platform Features</h2>
            <p>
              EVENTO simplifies the process of discovering, registering, and
              managing inter-college events. Our platform connects students and
              organizers, ensuring a seamless experience from start to finish.
              With intuitive dashboards and secure payment options, participating
              in events has never been easier.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-box">
              <div className="icon">📦</div>
              <h3>Effortless Event Discovery</h3>
              <p>Browse a diverse range of events tailored to your interests.</p>
            </div>

            <div className="feature-box">
              <div className="icon">📦</div>
              <h3>Streamlined Registration Process</h3>
              <p>Register for events quickly and easily with just a few clicks.</p>
            </div>

            <div className="feature-box">
              <div className="icon">📦</div>
              <h3>Comprehensive Event Management Tools</h3>
              <p>Organizers can efficiently manage and promote their events.</p>
            </div>
          </div>

          <div className="features-buttons">
            <button className="learn-more">Learn More</button>
            <a href="#" className="get-started">Get Started →</a>
          </div>
        </div>
      </section>

      <section className="features" ref={aboutUsRef}>
        <div className="container">
          <h2>Streamline Your Event Management Experience with EVENTO's Comprehensive Platform</h2>

          <div className="features-grid">
            <div className="feature">
              <div className="icon">⬛</div>
              <h3>Effortless Event Discovery and Registration for Students and Organizers</h3>
              <p>EVENTO connects students and organizers, simplifying the entire event management process.</p>
              <a href="#" className="link">Learn More →</a>
            </div>

            <div className="feature">
              <div className="icon">⬛</div>
              <h3>Organizers Can Easily Create and Manage Events with Our User-Friendly Tools</h3>
              <p>From uploading event details to tracking attendance, we have you covered.</p>
              <a href="#" className="link">Get Started →</a>
            </div>

            <div className="feature">
              <div className="icon">⬛</div>
              <h3>Students Can Discover and Register for Events That Interest Them</h3>
              <p>Browse events by category and register with just a few clicks.</p>
              <a href="#" className="link">Sign Up →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with carousel behavior */}
      <section className="testimonials">
        <h2>User Testimonials</h2>
        <p>EVENTO has transformed how we organize events!</p>
        <div className="testimonial-list">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className={`testimonial-card ${index === activeTestimonial ? 'active' : ''}`}
              onClick={() => setActiveTestimonial(index)}
            >
              <div className="stars">{"★".repeat(testimonial.stars)}</div>
              <p className="quote">"{testimonial.quote}"</p>
              <div className="user-info">
                <div className="avatar-placeholder"></div>
                <div>
                  <p className="name">{testimonial.name}</p>
                  <p className="title">{testimonial.title}</p>
                </div>
              </div>
              <p className="logo">{testimonial.logo}</p>
            </div>
          ))}
        </div>
        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === activeTestimonial ? 'active' : ''}`}
              onClick={() => setActiveTestimonial(index)}
            ></span>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>EVENTO</h2>
            <p>Subscribe to our newsletter for the latest features and updates.</p>
            <div className="newsletter">
              <input type="email" placeholder="Your email here" />
              <button>Join</button>
            </div>
            <p className="consent-text">
              By subscribing, you consent to our Privacy Policy and receive updates.
            </p>
          </div>

          <div className="footer-links">
            <div className="link-section">
              <h3>Quick Links</h3>
              <ul>
                <li>Home Page</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Help Center</li>
                <li>Blog Posts</li>
              </ul>
            </div>
            <div className="link-section">
              <h3>Connect With Us</h3>
              <ul>
                <li>Facebook Page</li>
                <li>Instagram Feed</li>
                <li>Twitter Profile</li>
                <li>LinkedIn Page</li>
                <li>YouTube Channel</li>
              </ul>
            </div>
            <div className="link-section">
              <h3>Follow Us</h3>
              <ul className="social-icons">
                <li>📘 Facebook</li>
                <li>📸 Instagram</li>
                <li>🐦 X</li>
                <li>🔗 LinkedIn</li>
                <li>▶️ YouTube</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 EVENTO. All rights reserved.</p>
          <ul className="footer-bottom-links">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Settings</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;