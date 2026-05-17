// App.jsx
// Root component with React Router setup and global state

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ChatPage from "./pages/ChatPage";
import ImageGenPage from "./pages/ImageGenPage";
import GalleryPage from "./pages/GalleryPage";
import "./styles/global.css";

function App() {
  // Chat session state managed here so sidebar can refresh when session changes
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const handleNewChat = () => {
    setCurrentSessionId(null);
  };

  const handleSessionChange = (id) => {
    setCurrentSessionId(id);
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout onNewChat={handleNewChat} currentSessionId={currentSessionId}>
        <Routes>
          {/* Default redirect to chat */}
          <Route path="/" element={<Navigate to="/chat" replace />} />

          {/* Chat page */}
          <Route
            path="/chat"
            element={
              <ChatPage
                sessionId={currentSessionId}
                onSessionChange={handleSessionChange}
              />
            }
          />

          {/* Image generation page */}
          <Route path="/generate" element={<ImageGenPage />} />

          {/* Gallery page */}
          <Route path="/gallery" element={<GalleryPage />} />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: "1rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ fontSize: "3rem" }}>404</span>
                <p>Page not found</p>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
