import React, { useState, useEffect } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useLocation, useNavigate } from "react-router-dom";

import iRemindlogo from "../../assets/images/we2logo.png";
import {
  ChatroomsJoinCreateResponse,
  ChatroomsLeaveCreateResponse,
  ChatroomsService,
} from "../api";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const query = useQuery();
  const roomName = query.get("channel") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      navigate("/");
    }
    const handleJoinOrCreateChatroom = async () => {
      try {
        const joinCreate: ChatroomsJoinCreateResponse =
          await ChatroomsService.chatroomsJoinCreate({
            // eslint-disable-next-line camelcase
            requestBody: { room_name: roomName },
          });
        console.log("Successfully joined or created chatroom:", joinCreate);
      } catch (error) {
        console.error("Error joining or creating chatroom:", error);
        navigate("/");
      }
    };

    const handleLeaveChatroom = async () => {
      try {
        const leaveResponse: ChatroomsLeaveCreateResponse =
          await ChatroomsService.chatroomsLeaveCreate({
            // eslint-disable-next-line camelcase
            requestBody: { room_name: roomName },
          });
        console.log("Successfully left chatroom:", leaveResponse);
      } catch (error) {
        console.error("Error leaving chatroom:", error);
      }
    };

    handleJoinOrCreateChatroom();

    window.addEventListener("beforeunload", handleLeaveChatroom);

    return () => {
      handleLeaveChatroom();
      window.removeEventListener("beforeunload", handleLeaveChatroom);
    };
  }, [roomName]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
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
              {msg}
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
