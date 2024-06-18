import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <h3>Contact Us</h3>
          <p>Email: contact@example.com</p>
          <p>Phone: +1234567890</p>
        </div>
        <div className='footer-content'>
          <h3>Address</h3>
          <p>Cheeryala(V)<br/>Keesara(M), Medchal Dist.<br/>Telangana,INDIA<br/>Pin Code-501301.<br/><br/>info@gcet.edu.in</p>
        </div>
        <div className="footer-content">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com/geethanjaligroupofinstitutions" className="icon">
              {/* <img src="facebook-logo.png" alt="Facebook" className="social-logo" /> */}
            </a>
            <a href="/" className="icon">
              {/* <img src="twitter-logo.png" alt="Twitter" className="social-logo" /> */}
            </a>
            <a href="/" className="icon">
              {/* <img src="instagram-logo.png" alt="Instagram" className="social-logo" /> */}
            </a>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>© 2024 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
}
