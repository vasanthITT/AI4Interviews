import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome, FaClipboardList, FaUserTie, FaChartBar, FaTimes,
  FaFileAlt, FaCommentDots, FaPhone, FaUsers, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = ({ toggleSidebar, isMobileOpen, setIsMobileOpen }) => {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded for tablet/PC
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsExpanded(false); // Collapse by default on mobile
        setIsMobileOpen(false); // Hide sidebar on mobile by default
      } else {
        setIsExpanded(true); // Expand by default on tablet/PC
        setIsMobileOpen(false); // Ensure mobile state doesn’t interfere
      }
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobileOpen]);

  const handleToggle = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(!isMobileOpen); // Toggle mobile sidebar
    } else {
      setIsExpanded(!isExpanded); // Toggle expand/collapse for tablet/PC
      toggleSidebar(!isExpanded);
    }
  };

  const handleClose = () => {
    setIsMobileOpen(false); // Close sidebar on mobile
  };

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"} ${isMobileOpen ? "mobile-active" : "mobile-hidden"}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">{isExpanded ? "AI4 Interviews" : "ITT"}</h2>
        {window.innerWidth <= 768 && isMobileOpen ? (
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
        ) : (
          <button className="toggle-button" onClick={handleToggle}>
            {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        )}
      </div>

      <ul className="sidebar-menu">
        <li className={`menu-item ${location.pathname === "/" ? "active" : ""}`}>
          <Link to="/" className="menu-link">
            <FaHome className="menu-icon" />
            <span className="menu-text">Home</span>
          </Link>
        </li>
        <p className="menu-category">Interview</p>
        <li className={`menu-item ${location.pathname === "/interview-practice" ? "active" : ""}`}>
          <Link to="/interview-practice" className="menu-link">
            <FaFileAlt className="menu-icon" />
            <span className="menu-text">Interview Practice</span>
          </Link>
        </li>
        <li className={`menu-item ${location.pathname === "/ai-interview-test" ? "active" : ""}`}>
          <Link to="/ai-interview-test" className="menu-link">
            <FaClipboardList className="menu-icon" />
            <span className="menu-text">AI Interview Test</span>
          </Link>
        </li>
        <li className={`menu-item ${location.pathname === "/live-interview" ? "active" : ""}`}>
          <Link to="/live-interview" className="menu-link">
            <FaUserTie className="menu-icon" />
            <span className="menu-text">Live Interview</span>
          </Link>
        </li>
        <li className={`menu-item ${location.pathname === "/results" ? "active" : ""}`}>
          <Link to="/results" className="menu-link">
            <FaChartBar className="menu-icon" />
            <span className="menu-text">Results</span>
          </Link>
        </li>
        <p className="menu-category">Tools</p>
        <li className={`menu-item ${location.pathname === "/resume-builder" ? "active" : ""}`}>
          <Link to="/resume-builder" className="menu-link">
            <FaFileAlt className="menu-icon" />
            <span className="menu-text">Resume Builder</span>
          </Link>
        </li>
        <li className={`menu-item ${location.pathname === "/recruiter-chat" ? "active" : ""}`}>
          <Link to="/recruiter-chat" className="menu-link">
            <FaCommentDots className="menu-icon" />
            <span className="menu-text">Recruiter Chat</span>
          </Link>
        </li>
        <p className="menu-category">Support</p>
        <li className={`menu-item ${location.pathname === "/interview-support" ? "active" : ""}`}>
          <Link to="/interview-support" className="menu-link">
            <FaUsers className="menu-icon" />
            <span className="menu-text">Interview Support</span>
          </Link>
        </li>
        <li className={`menu-item ${location.pathname === "/training-session" ? "active" : ""}`}>
          <Link to="/training-session" className="menu-link">
            <FaClipboardList className="menu-icon" />
            <span className="menu-text">Training Session</span>
          </Link>
        </li>
        <li className={`menu-item ${location.pathname === "/contact" ? "active" : ""}`}>
          <Link to="/contact" className="menu-link">
            <FaPhone className="menu-icon" />
            <span className="menu-text">Contact Us</span>
          </Link>
        </li>
      </ul>

      <div className="sidebar-footer">
        <img
          src="https://i.postimg.cc/7Y0zKjDR/ITT-logo.jpg"
          alt="Intrain Tech Logo"
          className="sidebar-logo"
        />
      </div>
    </div>
  );
};

export default Sidebar;