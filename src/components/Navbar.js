import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import CSS file for navbar styles
import logoImage from "C:/Users/91934/OneDrive/Desktop/mini_project/src/images/logo.jpeg";
import FacultyLogin from './FacultyLogin';

const Navbar = () => {
  const [showFacultyLoginModal, setShowFacultyLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const openFacultyLoginModal = () => {
    setShowFacultyLoginModal(true);
    document.body.classList.add('modal-open'); // Apply class to blur background
  };

  const closeFacultyLoginModal = () => {
    setShowFacultyLoginModal(false);
    document.body.classList.remove('modal-open'); // Remove class to unblur background
  };

  const handleSuccessfulFacultyLogin = () => {
    setIsLoggedIn(true);
    setShowFacultyLoginModal(false);
    document.body.classList.remove('modal-open'); // Remove class to unblur background
    // Additional logic for handling successful faculty login, e.g., redirecting to dashboard
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <img src={logoImage} alt="Logo" className="logo" />
          <h1 className="navbar-heading">Faculty Roster Management</h1>
          <ul className="nav-links">
            <li className="nav-item"><Link to="/main" className="nav-link">Home</Link></li>
            <li className="nav-item"><Link to="/main/regular_tt" className="nav-link">Regular Timetables</Link></li>
            <li className="nav-item dropdown">
              <span className="nav-link">Departments</span>
              <ul className="dropdown-content">
                <li><a href="http://www.geethanjaliinstitutions.com/engineering/cse.html" className="nav-link">CSE</a></li>
                <li><a href="http://www.geethanjaliinstitutions.com/engineering/it.html" className="nav-link">IT</a></li>
                <li><a href="http://www.geethanjaliinstitutions.com/engineering/ece.html" className="nav-link">ECE</a></li>
              </ul>
            </li>
            <li className="nav-item faculty-container">
              {isLoggedIn ? (
                <span className="nav-link">Welcome Faculty!</span>
              ) : (
                <button className="nav-link" onClick={openFacultyLoginModal}>Are You a Faculty? Click Here!</button>
              )}
            </li>
          </ul>
        </div>
      </nav>
      {/* Ensure onClose is passed down as a function */}
      {showFacultyLoginModal && <FacultyLogin onSuccess={handleSuccessfulFacultyLogin} onClose={closeFacultyLoginModal} />}
    </>
  );
};

export default Navbar;
