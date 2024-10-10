import * as Sentry from "@sentry/react";
import cookie from "cookie";
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import love from "../assets/images/mclove.png";

import { OpenAPI } from "./api";
import Chat from "./pages/Chat";
import Home from "./pages/Home";

OpenAPI.interceptors.request.use((request) => {
  const { csrftoken } = cookie.parse(document.cookie);
  if (request.headers && csrftoken) {
    request.headers["X-CSRFTOKEN"] = csrftoken;
  }
  return request;
});

const App = () => (
  <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <Router>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <div style={{ flex: 1 }}>
          <Routes>
            <Route element={<Home />} path="/" /> {/* Home page */}
            <Route element={<Chat />} path="/chat" /> {/* Chat page */}
          </Routes>
        </div>
        <footer
          style={{
            textAlign: "center",
            padding: "10px",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
          }}
        >
          <span>Made with </span>
          <img
            alt="Love"
            src={love}
            style={{ width: "20px", verticalAlign: "middle" }}
          />
          <span> by rv</span>
        </footer>
      </div>
    </Router>
  </Sentry.ErrorBoundary>
);

export default App;
