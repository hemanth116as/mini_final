// FacultyInboxComponent.js
import React, { useState, useEffect } from 'react';
import { getMessages, sendMessage } from './api';

const FacultyInboxComponent = ({ currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            const adminId = 1; // Assuming admin has a fixed ID of 1
            const msgs = await getMessages(currentUser.id, adminId);
            setMessages(msgs);
        };
        fetchMessages();
    }, [currentUser.id]);

    const handleSendMessage = async () => {
        const adminId = 1; // Assuming admin has a fixed ID of 1
        await sendMessage(currentUser.id, adminId, newMessage);
        setNewMessage('');
        const msgs = await getMessages(currentUser.id, adminId);
        setMessages(msgs);
    };

    return (
        <div>
            <h2>Inbox</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender_id === currentUser.id ? 'You' : 'Admin'}</strong>: {msg.message}
                    </div>
                ))}
            </div>
            <div>
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                />
                <button onClick={handleSendMessage}>Send Message</button>
            </div>
        </div>
    );
};

export default FacultyInboxComponent;
