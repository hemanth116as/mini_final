import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import './FacultyLogin.css'; // Import CSS file for modal styles

const FacultyLogin = ({ onSuccess, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const modalRef = useRef(null);
    const history = useHistory(); // useHistory hook

    const handleClickOutside = useCallback((event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            closeFacultyLoginModal();
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const closeFacultyLoginModal = () => {
        onClose(); 
    };

    const handleSignIn = async () => {
        try {
            const response = await fetch('http://localhost:5002/api/faculty_login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log(data);
            onSuccess();
            history.push(`/main/facultydisplay?email=${encodeURIComponent(email)}`); // Redirect to facultydisplay with email as a query parameter
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="faculty-login-modal" ref={modalRef}>
                <div className="modal-container">
                    <div className="modal-header">
                        <h2>Faculty Login</h2>
                        <span className="modal-close" onClick={closeFacultyLoginModal}>&times;</span>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="button-group">
                                <button type="button" onClick={handleSignIn}>Sign In</button>
                                <button type="button" onClick={closeFacultyLoginModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyLogin;
