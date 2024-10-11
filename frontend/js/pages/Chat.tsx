/* eslint-disable camelcase */
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import iRemindlogo from "../../assets/images/we2logo.png";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { user_name: string; message: string }[]
  >([]);
  const [username, setUsername] = useState("");
  const query = useQuery();
  const roomName = query.get("channel") || "";
  const navigate = useNavigate();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      navigate(`/?next=/chat/&channel=${roomName}`);
    }

    const handleGetMessageRequest = async () => {
      try {
        const urlWithParams = `/api/messages/get/?room_name=${encodeURIComponent(roomName)}`;
        console.log(`Fetching messages from: ${urlWithParams}`);
        const { data } = await axios.get(urlWithParams);
        setMessages(
          data.messages
            .reverse()
            .map((msg: { user_name: string; message: string }) => ({
              user_name: msg.user_name,
              message: msg.message,
            })),
        );
      } catch (error) {
        console.error("Error getting messages:", error);
      }
    };

    const connectWebSocket = async () => {
      try {
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const port = process.env.NODE_ENV === "production" ? "" : ":8000";
        const wsUrl = `${protocol}://${window.location.hostname}${port}/ws/chat/${encodeURIComponent(roomName)}/`;
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.addEventListener("message", (event) => {
          const data = JSON.parse(event.data);
          setMessages((prevMessages) => [
            ...prevMessages,
            { user_name: data.user_name, message: data.message },
          ]);
        });

        ws.addEventListener("error", (error) => {
          console.error("WebSocket error:", error);
        });

        ws.addEventListener("close", () => {
          console.log("WebSocket connection closed");
        });
      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
      }
    };

    const initializeChat = async () => {
      await connectWebSocket();
      await handleGetMessageRequest();
    };

    initializeChat();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomName, navigate]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() && socketRef.current) {
      const messageData = {
        room_name: roomName,
        user_name: username,
        message,
      };
      socketRef.current.send(JSON.stringify(messageData));
      setMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleLogoKeyPress = (event: { key: string }) => {
    if (event.key === "Enter" || event.key === " ") {
      navigate("/");
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
            navigate("/");
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
          width: "400px",
          maxHeight: "70vh",
          borderRadius: "15px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
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
              <strong>{msg.user_name}: </strong> {msg.message}
            </div>
          ))}
        </div>

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
            onKeyDown={handleKeyDown}
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
