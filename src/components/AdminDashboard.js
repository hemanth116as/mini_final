import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [imapServer, setImapServer] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [facultyEmails, setFacultyEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [showComposeBox, setShowComposeBox] = useState(false);
  const [error, setError] = useState('');

  const handleLoginAndFetchEmails = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5006/admin-fetch-emails', {
        admin_email: adminEmail,
        admin_pass: adminPass,
        imap_server: "imap.gmail.com",
      });
      if (response.status === 200) {
        setIsLoggedIn(true);
        setEmails(response.data);
        setError('');
        fetchFacultyEmails();
      }
    } catch (err) {
      setError('Invalid credentials or failed to fetch emails');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFacultyEmails = async () => {
    try {
      const response = await axios.get('http://localhost:5006/faculty-emails');
      setFacultyEmails(response.data);
    } catch (err) {
      setError('Failed to fetch faculty emails');
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5006/send-email', {
        to: selectedEmail,
        subject: composeSubject,
        body: composeBody,
      });
      if (response.status === 200) {
        setShowComposeBox(false);
        setComposeSubject('');
        setComposeBody('');
        setError('');
      }
    } catch (err) {
      setError('Failed to send email');
    }
  };

  return (
    <div className="admin-dashboard">
      {!isLoggedIn ? (
        <form onSubmit={handleLoginAndFetchEmails} className="form-container">
          <h2>Admin Login and Fetch Inbox messages</h2>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login and Fetch Emails</button>
          {error && <p className="error-message">{error}</p>}
          {isLoading && (
            <div className="loading-message">
              <div className="loader"></div>
              <p>Wait! This may take some time...</p>
            </div>
          )}
        </form>
      ) : (
        <div>
          <h3>Fetched Emails:</h3>
          <ul className="email-list">
            {emails.map((email, index) => (
              <li key={index} className="email-item">
                <strong>Subject:</strong> {email.subject}<br />
                <strong>From:</strong> {email.from}<br />
                <strong>Body:</strong> {email.body}
              </li>
            ))}
          </ul>

          <div className="form-container">
            <h3>Compose Email</h3>
            <div className="form-group">
              <label>Select Faculty Email:</label>
              <select
                value={selectedEmail}
                onChange={(e) => {
                  setSelectedEmail(e.target.value);
                  setShowComposeBox(true);
                }}
              >
                <option value="">Select an email</option>
                {facultyEmails.map((email, index) => (
                  <option key={index} value={email}>
                    {email}
                  </option>
                ))}
              </select>
            </div>

            {showComposeBox && (
              <form onSubmit={handleSendEmail} className="compose-form">
                <div className="form-group">
                  <label>Subject:</label>
                  <input
                    type="text"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Body:</label>
                  <textarea
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit">Send Email</button>
              </form>
            )}

            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
