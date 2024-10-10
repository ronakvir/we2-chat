import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import iRemindlogo from "../../assets/images/we2logo.png";
import { RestService, ChatroomsService } from "../api";

type ChatRoom = {
  id: number;
  room_name: string;
  created_at: string;
  user_count?: number;
};

const Home = () => {
  const [restCheck, setRestCheck] = useState<
    Awaited<ReturnType<typeof RestService.restRestCheckRetrieve>> | undefined
  >(undefined);
  const [topChats, setTopChats] = useState<ChatRoom[]>([]);
  const [username, setUsername] = useState(""); // State for username input
  const [channel, setChannel] = useState(""); // State for channel input
  const [showContent, setShowContent] = useState(false); // State to toggle page display
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
      setShowContent(true);
    }

    async function onFetchRestCheck() {
      setRestCheck(await RestService.restRestCheckRetrieve());
      const topChatsData = await ChatroomsService.chatroomsTop5Retrieve();
      setTopChats(topChatsData.top_chats || []);
    }
    onFetchRestCheck();
  }, []);

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRoomClick = (roomName: string) => {
    navigate(`/chat/?channel=${roomName}`);
  };

  // Handle input change for username
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  // Handle key down for username input (on "Enter" key press)
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

      {/* Show username input initially, then show rest of the page */}
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
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2 className="text-center">Top Channels</h2>
            {topChats.length === 0 ? (
              <p>No active chat rooms available.</p>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {topChats.map((chat) => (
                  <li
                    key={chat.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <a
                      href="#"
                      style={{
                        textDecoration: "none",
                        color: "#4CAF50",
                        fontSize: "18px",
                      }}
                      onClick={() => handleRoomClick(chat.room_name)}
                    >
                      {chat.room_name}
                    </a>
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
