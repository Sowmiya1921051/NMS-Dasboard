import React from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,   // Dashboard
  FaUserShield,      // Dealer Details
  FaUserCheck,       // Users Profile
  FaUserPlus,        // Add Dealer
  FaStar,            // Astrologers
  FaServicestack     // AtoZ Services
} from "react-icons/fa";

const SideNav = () => {

  const handleNavigation = (page) => {
    console.log(`Navigating to: ${page}`);
  };

  return (
    <div className="sidenav">
      <ul className="sidenav-list">
        {/* Dashboard */}
        <li>
          <Link to="/" className="sidenav-link" onClick={() => handleNavigation("Dashboard")}>
            <FaTachometerAlt className="sidenav-icon" /> Dashboard
          </Link>
        </li>

        {/* Dealer Details */}
        <li>
          <Link to="/DealerVerify" className="sidenav-link" onClick={() => handleNavigation("Dealer Details")}>
            <FaUserShield className="sidenav-icon" /> Dealer Details
          </Link>
        </li>

        {/* Users Profile */}
        <li>
          <Link to="/verifiedProfile" className="sidenav-link" onClick={() => handleNavigation("Users Profile")}>
            <FaUserCheck className="sidenav-icon" /> Users Profile
          </Link>
        </li>

        {/* Add Dealer */}
        <li>
          <Link to="/brokerlist" className="sidenav-link" onClick={() => handleNavigation("Add Dealer")}>
            <FaUserPlus className="sidenav-icon" /> Add Dealer
          </Link>
        </li>

        {/* Astrologers */}
        <li>
          <Link to="/Astrologers" className="sidenav-link" onClick={() => handleNavigation("Astrologers")}>
            <FaStar className="sidenav-icon" /> Astrologers
          </Link>
        </li>

        {/* AtoZ Services */}
        <li>
          <Link to="/AtoZservices" className="sidenav-link" onClick={() => handleNavigation("AtoZ Services")}>
            <FaServicestack className="sidenav-icon" /> AtoZ Services
          </Link>
        </li>

      </ul>
    </div>
  );
};

export default SideNav;
