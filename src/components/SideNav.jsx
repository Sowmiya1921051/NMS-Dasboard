import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserShield,
  FaUserCheck,
  FaUserPlus,
  FaStar,
  FaServicestack,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const SideNav = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(!isMobile);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      setIsOpen(!mobileView); // Auto open on desktop, close on mobile
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/AuthPage");
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button className="menu-toggle" onClick={toggleSidebar}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidenav ${isOpen ? "open" : "closed"}`}>
        <ul className="sidenav-list">
          <li>
            <Link to="/" className="sidenav-link mt-10" onClick={() => handleNavigation("/")}>
              <FaTachometerAlt className="sidenav-icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/DealerVerify" className="sidenav-link" onClick={() => handleNavigation("/DealerVerify")}>
              <FaUserShield className="sidenav-icon" /> Dealer Details
            </Link>
          </li>
          <li>
            <Link to="/verifiedProfile" className="sidenav-link" onClick={() => handleNavigation("/verifiedProfile")}>
              <FaUserCheck className="sidenav-icon" /> Users Profile
            </Link>
          </li>
          <li>
            <Link to="/brokerlist" className="sidenav-link" onClick={() => handleNavigation("/brokerlist")}>
              <FaUserPlus className="sidenav-icon" /> Add Dealer
            </Link>
          </li>
          <li>
            <Link to="/Astrologers" className="sidenav-link" onClick={() => handleNavigation("/Astrologers")}>
              <FaStar className="sidenav-icon" /> Astrologers
            </Link>
          </li>
          <li>
            <Link to="/AtoZservices" className="sidenav-link" onClick={() => handleNavigation("/AtoZservices")}>
              <FaServicestack className="sidenav-icon" /> AtoZ Services
            </Link>
          </li>
          <li>
            <button className="sidenav-link logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="sidenav-icon" /> Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SideNav; 
