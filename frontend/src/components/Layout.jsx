// components/Layout.jsx
// Wraps all pages with the sidebar navigation

import { useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";

const Layout = ({ children, onNewChat, currentSessionId }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile hamburger button */}
      <button
        className="sidebar__toggle"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Sidebar */}
      <Sidebar
        onNewChat={onNewChat}
        currentSessionId={currentSessionId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <main className="app-main">{children}</main>
    </div>
  );
};

export default Layout;
