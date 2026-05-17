// components/Message.jsx
// Renders a single chat message bubble (user or AI)

import ReactMarkdown from "react-markdown";

const Message = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div className={`message message--${isUser ? "user" : "ai"}`}>
      {/* Avatar */}
      <div className="message__avatar">
        {isUser ? "U" : "✦"}
      </div>

      {/* Message bubble */}
      <div className="message__bubble">
        {isUser ? (
          // User messages: plain text
          <p style={{ color: "white", margin: 0 }}>{content}</p>
        ) : (
          // AI messages: render markdown for rich formatting
          <ReactMarkdown
            components={{
              // Override default element rendering for dark theme
              p: ({ children }) => <p style={{ color: "var(--text-primary)" }}>{children}</p>,
              strong: ({ children }) => <strong style={{ color: "var(--text-primary)" }}>{children}</strong>,
              code: ({ inline, children }) =>
                inline ? (
                  <code>{children}</code>
                ) : (
                  <pre><code>{children}</code></pre>
                ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default Message;
