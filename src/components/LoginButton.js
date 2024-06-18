import React, { useState } from 'react';
import './LoginButton.css'; // Import CSS file for styling

const LoginButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Simulate login functionality, for demonstration purposes
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Simulate logout functionality, for demonstration purposes
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
      ) : (
        <button className="loginButton" onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default LoginButton;
