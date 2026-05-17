// components/Sidebar.jsx
// Sidebar navigation with chat history and page links

import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getChatHistory } from "../services/api";
import "../styles/Sidebar.css";

const Sidebar = ({ onNewChat, currentSessionId, isOpen, onClose }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load chat history when sidebar mounts
  useEffect(() => {
    loadHistory();
  }, []);

  // Refresh history when session changes (new message sent)
  useEffect(() => {
    if (currentSessionId) {
      loadHistory();
    }
  }, [currentSessionId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getChatHistory();
      setChatHistory(data.data || []);
    } catch (err) {
      console.error("Failed to load chat history:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    onNewChat();
    navigate("/chat");
    onClose(); // Close sidebar on mobile after selection
  };

  const handleHistoryClick = (chatId) => {
    navigate(`/chat?session=${chatId}`);
    onClose();
  };

  // Format date for display (Today, Yesterday, or date)
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar__overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">✦</div>
          <span className="sidebar__logo-text">
            AI<span>Studio</span>
          </span>
        </div>

        {/* New Chat Button */}
        <button className="sidebar__new-chat" onClick={handleNewChat}>
          <span>＋</span> New Chat
        </button>

        {/* Main Navigation */}
        <nav className="sidebar__nav">
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `sidebar__nav-item ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <span className="nav-icon">💬</span>
            Chat
          </NavLink>

          <NavLink
            to="/generate"
            className={({ isActive }) =>
              `sidebar__nav-item ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <span className="nav-icon">🎨</span>
            Generate Image
          </NavLink>

          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `sidebar__nav-item ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <span className="nav-icon">🖼️</span>
            Gallery
          </NavLink>
        </nav>

        {/* Chat History Section */}
        <div className="sidebar__history">
          <p className="sidebar__history-title">Recent Chats</p>

          {loading && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", padding: "0.5rem" }}>
              Loading...
            </p>
          )}

          {!loading && chatHistory.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", padding: "0.5rem" }}>
              No chats yet
            </p>
          )}

          {chatHistory.map((chat) => (
            <button
              key={chat._id}
              className={`sidebar__history-item ${
                currentSessionId === chat._id ? "active" : ""
              }`}
              onClick={() => handleHistoryClick(chat._id)}
              title={chat.title}
            >
              {chat.title}
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div style={{
          padding: "0.875rem",
          borderTop: "1px solid var(--border-color)",
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          textAlign: "center",
        }}>
          Powered by Gemini + HuggingFace
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
