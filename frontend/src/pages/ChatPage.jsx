// pages/ChatPage.jsx
// Main chat interface - similar to ChatGPT UI

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Message from "../components/Message";
import { sendChatMessage, getChatById } from "../services/api";
import "../styles/Chat.css";

// Quick suggestion prompts for new users
const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Write a Python fibonacci function",
  "What are MERN stack best practices?",
  "Help me write a professional email",
];

const ChatPage = ({ sessionId, onSessionChange }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [searchParams] = useSearchParams();

  // Load session from URL param when navigating from sidebar history
  useEffect(() => {
    const urlSession = searchParams.get("session");
    if (urlSession && urlSession !== sessionId) {
      loadSession(urlSession);
    }
  }, [searchParams]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load existing chat session from DB
  const loadSession = async (id) => {
    try {
      const data = await getChatById(id);
      const chat = data.data;
      setMessages(
        chat.messages.map((m) => ({ role: m.role, content: m.content }))
      );
      onSessionChange(id);
    } catch (err) {
      console.error("Failed to load session:", err.message);
    }
  };

  // Auto-resize textarea as user types
  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Reset height then set to scrollHeight for auto-grow
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  // Handle Enter key (Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Add user message to UI immediately
    const userMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setError("");
    setLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      // Send to backend - pass history for context-aware responses
      const data = await sendChatMessage(
        trimmed,
        sessionId,
        messages // Send previous messages as context
      );

      // Update session ID if new chat was created
      if (!sessionId) {
        onSessionChange(data.data.sessionId);
      }

      // Add AI response to messages
      setMessages([
        ...updatedMessages,
        { role: "model", content: data.data.response },
      ]);
    } catch (err) {
      setError(err.message || "Failed to send message");
      // Remove the user message if request failed
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
    textareaRef.current?.focus();
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-page__header">
        <span className="chat-page__title">AI Chat</span>
        <span className="chat-page__subtitle">powered by Gemini 1.5 Flash</span>
      </div>

      {/* Messages or Empty State */}
      <div className="chat-page__messages">
        {messages.length === 0 ? (
          <div className="chat-page__empty">
            <div className="chat-page__empty-icon">✦</div>
            <h2>How can I help you today?</h2>
            <p>
              I'm your AI assistant powered by Google Gemini. Ask me anything!
            </p>
            {/* Quick suggestion chips */}
            <div className="chat-page__suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggestion-chip"
                  onClick={() => handleSuggestion(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <Message key={i} role={msg.role} content={msg.content} />
            ))}

            {/* Typing indicator while AI is responding */}
            {loading && (
              <div className="message message--ai">
                <div className="message__avatar">✦</div>
                <div className="message__bubble">
                  <div className="typing-indicator">
                    <div className="typing-indicator__dot" />
                    <div className="typing-indicator__dot" />
                    <div className="typing-indicator__dot" />
                  </div>
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.75rem 1rem",
                  color: "#fca5a5",
                  fontSize: "0.875rem",
                }}
              >
                ⚠️ {error}
              </div>
            )}
          </>
        )}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-page__input-area">
        <div className="chat-input-form">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Studio... (Enter to send, Shift+Enter for newline)"
            disabled={loading}
            rows={1}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              <span>↑</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
