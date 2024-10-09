import React, { useState, useEffect } from "react";

import iRemindlogo from "../../assets/images/we2logo.png";
import { RestService } from "../api";

const Home = () => {
  const [restCheck, setRestCheck] =
    useState<Awaited<ReturnType<typeof RestService.restRestCheckRetrieve>>>();
  const [username, setUsername] = useState(""); // State for username input
  const [channel, setChannel] = useState(""); // State for channel input
  const [showContent, setShowContent] = useState(false); // State to toggle page display

  useEffect(() => {
    async function onFetchRestCheck() {
      setRestCheck(await RestService.restRestCheckRetrieve());
    }
    onFetchRestCheck();
  }, []);

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
      setShowContent(true); // Show the rest of the page
    }
  };

  // Handle input change for channel
  const handleChannelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChannel(event.target.value);
  };

  const handleLogoKeyPress = (event: { key: string }) => {
    if (event.key === "Enter" || event.key === " ") {
      setShowContent(false);
    }
  };

  // Handle key down for channel input (on "Enter" key press)
  const handleChannelKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const trimmedChannel = channel.trim();
    if (event.key === "Enter" && trimmedChannel !== "") {
      window.location.href = `http://localhost:8000/chat?channel=${trimmedChannel}`;
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
          onKeyDown={handleLogoKeyPress}
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
            onKeyDown={handleUsernameKeyDown} // Trigger on Enter key press
          />
        </div>
      ) : (
        <div className="text-center">
          <div id="django-background">Browse top channels:</div>
          <p>{restCheck?.message}</p>
          {restCheck?.image && (
            <img alt="backend-shit" src={restCheck?.image} />
          )}
          <div id="django-background">Create your own channel:</div>

          {/* Second input for entering a channel */}
          <div>
            <input
              placeholder="Enter channel name"
              style={{ margin: "10px 0", padding: "8px", width: "300px" }}
              type="text"
              value={channel}
              onChange={handleChannelChange} // Handle channel input change
              onKeyDown={handleChannelKeyDown} // Trigger on Enter key press
            />
            <p>You entered: {channel}</p> {/* Display entered channel */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
