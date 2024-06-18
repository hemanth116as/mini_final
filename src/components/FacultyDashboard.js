import React, { useState } from 'react';
import axios from 'axios';
import './FacultyDashboard.css'; // Import CSS file for component styling

const FacultyDashboard = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [showComposeBox, setShowComposeBox] = useState(false);
  const [sendStatus, setSendStatus] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleFetchEmails = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state
    try {
      const response = await axios.post('http://localhost:5007/fetch-admin-emails', {
        login_email: loginEmail,
        login_password: loginPassword,
      });
      setEmails(response.data);
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      setError('Failed to fetch emails. Check your credentials.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state
    try {
      const response = await axios.post('http://localhost:5007/send-email-to-admin', {
        from: loginEmail,
        subject: composeSubject,
        body: composeBody,
        login_password: loginPassword,
      });
      setSendStatus(response.data.message || 'Email sent successfully!');
      setShowComposeBox(false);
      setComposeSubject('');
      setComposeBody('');
      setError('');
    } catch (err) {
      setError('Failed to send email. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div >
        <br></br>
        <br></br>
      {!isLoggedIn ? (
        <form onSubmit={handleFetchEmails} className="login-form">
          <h2>Faculty Dashboard</h2>
          <div className="form-group">
            <label>Login Email:</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Login Password:</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Fetching...' : 'Fetch Emails'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <div className="dashboard">
          <h2>Welcome, Faculty!</h2>
          {emails.length > 0 && (
            <div className="emails">
              <h3>Fetched Emails:</h3>
              <ul>
                {emails.map((email, index) => (
                  <li key={index}>
                    <strong>Subject:</strong> {email.subject}<br />
                    <strong>From:</strong> {email.from}<br />
                    <strong>Body:</strong> {email.body}
                  </li>
                ))}
              </ul>

              <h3>Compose Email</h3>
              <div className="compose">
                <label>Select Admin Email:</label>
                <select
                  value={selectedEmail}
                  onChange={(e) => {
                    setSelectedEmail(e.target.value);
                    setShowComposeBox(true);
                  }}
                >
                  <option value="">Select an email</option>
                  <option value="itachi116as@gmail.com">itachi116as@gmail.com</option>
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
                  <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Email'}
                  </button>
                </form>
              )}

              {sendStatus && <p className="success">{sendStatus}</p>}
            </div>
          )}

          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
