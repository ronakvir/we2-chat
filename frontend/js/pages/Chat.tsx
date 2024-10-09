import React, { useState, useEffect } from "react";

import iRemindlogo from "../../assets/images/we2logo.png";

const handleLogoKeyPress = (event: { key: string }) => {
  if (event.key === "Enter" || event.key === " ") {
    window.location.href = `http://localhost:8000/`;
  }
};

const Chat = () => {
  const [message, setMessage] = useState(""); // State to store the message
  const [messages, setMessages] = useState<string[]>([]); // Store all sent messages
  const [username, setUsername] = useState("");

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      window.location.href = `http://localhost:8000/`;
    }
  }, []);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]); // Add the message to the list of messages
      setMessage(""); // Clear the input
    }
  };

  // Handle "Enter" key press to send a message
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="text-center logo-top">
        <button
          aria-label="Click to go back to the username input"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
          type="button"
          onClick={() => {
            window.location.href = `http://localhost:8000/`;
          }}
          onKeyDown={handleLogoKeyPress}
        >
          <img
            alt="iRemind Logo"
            className="my-4"
            src={iRemindlogo}
            style={{ width: "120px", height: "auto" }}
          />
        </button>
      </div>
      <p style={{ marginBottom: "20px" }}>Welcome: {username}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "400px", // Slim width
          maxHeight: "70vh",
          borderRadius: "15px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Display messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: "10px",
                backgroundColor: "#fff",
                padding: "8px",
                borderRadius: "10px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              {msg}
            </div>
          ))}
        </div>

        {/* Message input and send button */}
        <div
          style={{
            display: "flex",
            padding: "10px",
            borderTop: "1px solid #ddd",
            backgroundColor: "#fff",
          }}
        >
          <input
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "14px",
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              marginRight: "10px",
              outline: "none",
            }}
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // Send message on Enter key press
          />
          <button
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              backgroundColor: "transparent",
              border: "1px solid #ccc",
              borderRadius: "10px",
              cursor: "pointer",
              color: "#333",
              transition: "all 0.2s",
            }}
            type="button"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
