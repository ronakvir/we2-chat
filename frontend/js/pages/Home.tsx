import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import iRemindlogo from "../../assets/images/we2logo.png";
import { ChatroomsService } from "../api";

type ChatRoom = {
  id: number;
  room_name: string;
  created_at: string;
  user_count?: number;
};

const Home = () => {
  const [topChats, setTopChats] = useState<ChatRoom[]>([]);
  const [username, setUsername] = useState("");
  const [channel, setChannel] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
      setShowContent(true);
    }
  }, []);

  const fetchTopChats = async () => {
    try {
      const topChatsData = await ChatroomsService.chatroomsTop5Retrieve();
      setTopChats(topChatsData.top_chats || []);
    } catch (error) {
      console.error("Error fetching top chats:", error);
    }
  };

  const openModal = async () => {
    await fetchTopChats();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRoomClick = (roomName: string) => {
    navigate(`/chat/?channel=${roomName}`);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleUsernameKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const trimmedUsername = username.trim();
    if (event.key === "Enter" && trimmedUsername !== "") {
      localStorage.setItem("username", trimmedUsername);
      setShowContent(true); // Show the rest of the page
    }
  };

  const deleteUsername = () => {
    localStorage.removeItem("username");
    setUsername("");
    setShowContent(false);
  };

  const handleChannelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChannel(event.target.value);
  };

  const handleChannelKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const trimmedChannel = channel.trim();
    if (event.key === "Enter" && trimmedChannel !== "") {
      navigate(`/chat?channel=${trimmedChannel}`);
    }
  };

  return (
    <div>
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
          onClick={() => setShowContent(false)}
        >
          <img
            alt="iRemind Logo"
            className="my-4"
            src={iRemindlogo}
            style={{ width: "200px", height: "auto" }}
          />
        </button>
      </div>

      {!showContent ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <input
            placeholder="Enter your username"
            style={{ padding: "10px", width: "300px", textAlign: "center" }}
            type="text"
            value={username}
            onChange={handleUsernameChange}
            onKeyDown={handleUsernameKeyDown}
          />
        </div>
      ) : (
        <div className="text-center">
          <div>
            <button
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              type="button"
              onClick={openModal}
            >
              Browse top channels
            </button>
          </div>

          <div id="django-background">Create your own channel:</div>

          <div>
            <input
              placeholder="Enter channel name"
              style={{ margin: "10px 0", padding: "8px", width: "300px" }}
              type="text"
              value={channel}
              onChange={handleChannelChange}
              onKeyDown={handleChannelKeyDown}
            />
            <p>You entered: {channel}</p>
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
              onClick={deleteUsername}
            >
              change current name: {username}
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              aria-label="Close Modal"
              className="close"
              role="button"
              tabIndex={0}
              onClick={closeModal}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  closeModal();
                }
              }}
            >
              &times;
            </span>
            <h2 className="text-center">Top Channels</h2>
            {topChats.length === 0 ? (
              <p>No active chat rooms available.</p>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {topChats.map((chat, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        textDecoration: "none",
                        color: "#4CAF50",
                        fontSize: "18px",
                        cursor: "pointer",
                      }}
                      type="button"
                      onClick={() => handleRoomClick(chat.room_name)}
                    >
                      {chat.room_name}
                    </button>
                    <span style={{ color: "#555", fontSize: "14px" }}>
                      {chat.user_count ?? "N/A"} active users
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
