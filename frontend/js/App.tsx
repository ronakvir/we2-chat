import * as Sentry from "@sentry/react";
import cookie from "cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { OpenAPI } from "./api";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

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
      <Routes>
        {/* Define routes for each page */}
        <Route element={<Home />} path="/" /> {/* Home page */}
        <Route element={<Chat />} path="/chat" /> {/* Chat page */}
        {/* You can add more routes here as needed */}
      </Routes>
    </Router>
  </Sentry.ErrorBoundary>
);

export default App;
