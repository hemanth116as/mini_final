// Login.js
import React, { useState } from 'react';
import { login } from './api';

const Login = ({ setCurrentUser }) => {
    const [facultyId, setFacultyId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const result = await login(facultyId, password);
        if (result.success) {
            setCurrentUser({ id: result.user_id, role: result.role });
        } else {
            alert(result.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
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

export default Login;
