import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import './SignInModal.css';

const SignInModal = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const modalRef = useRef(null);
    const history = useHistory(); // Initialize useHistory

    const handleClickOutside = useCallback((event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleSignIn = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                onClose();
                history.push('/main'); // Navigate to the Main page upon successful login
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="sign-in-modal" ref={modalRef}>
                <div className="modal-container">
                    <div className="modal-header">
                        <h2>Sign In</h2>
                        <span className="modal-close" onClick={onClose}>&times;</span>
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
                                <button type="button" onClick={onClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInModal;
