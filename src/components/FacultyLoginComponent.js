// FacultyLoginComponent.js
import React, { useState } from 'react';
import { authenticate } from './api';

const FacultyLoginComponent = ({ setCurrentUser }) => {
    const [facultyId, setFacultyId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const response = await authenticate(facultyId, password);
        if (response.authenticated) {
            setCurrentUser(response.user);
        } else {
            alert('Authentication failed');
        }
    };

    return (
        <div>
            <h2>Faculty Login</h2>
            <input
                type="text"
                placeholder="Faculty ID"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default FacultyLoginComponent;
