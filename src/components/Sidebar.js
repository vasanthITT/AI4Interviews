import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaHome, FaClipboardList, FaUserTie, FaChartBar, 
  FaChevronLeft, FaChevronRight, FaFileAlt, FaCommentDots, 
  FaPhone, FaUsers 
} from "react-icons/fa";
import '../styles/Sidebar.css';

const Sidebar = ({ toggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setCollapsed(!collapsed);
    toggleSidebar(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          {collapsed ? "ITT" : "AI4\tInterviews"}
        </h2>
        <button 
          className="toggle-button"
          onClick={handleToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <ul className="sidebar-menu">
        <li className={`menu-item ${location.pathname === "/" ? "active" : ""}`}>
          <Link to="/" className="menu-link">
            <FaHome className={`menu-icon ${collapsed ? "" : ""}`} />
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