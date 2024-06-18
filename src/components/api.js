// api.js
export const sendMessage = async (senderId, receiverId, message) => {
    const response = await fetch('/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender_id: senderId, receiver_id: receiverId, message: message }),
    });
    return response.json();
};

export const getMessages = async (user1Id, user2Id) => {
    const response = await fetch(`/get_messages/${user1Id}/${user2Id}`);
    return response.json();
};

export const authenticate = async (facultyId, password) => {
    const response = await fetch('/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faculty_id: facultyId, password: password }),
    });
    return response.json();
};

export const getUsers = async () => {
    const response = await fetch('/get_users');
    return response.json();
};
