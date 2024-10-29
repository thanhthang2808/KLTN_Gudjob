// Forum.jsx
import React, { useState, useEffect } from 'react';

function HRForum() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch initial messages if there is a backend API available
    // e.g., axios.get('/api/messages').then(response => setMessages(response.data));
  }, []);

  const handleSend = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: "User123", // Replace with dynamic user name
        content: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, message]);
      setNewMessage(""); // Clear input
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Community Forum</h2>
      <div style={styles.chatContainer}>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.message}>
            <strong>{msg.user}:</strong> <span>{msg.content}</span> <small>{msg.timestamp}</small>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '10px',
  },
  chatContainer: {
    maxHeight: '400px',
    overflowY: 'scroll',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
  },
  message: {
    marginBottom: '8px',
    padding: '5px',
    borderBottom: '1px solid #eee',
  },
  inputContainer: {
    display: 'flex',
    marginTop: '10px',
  },
  input: {
    flex: 1,
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginRight: '5px',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default HRForum;
