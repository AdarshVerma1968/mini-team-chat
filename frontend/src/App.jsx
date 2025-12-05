import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Channels from './pages/Channels';
import ChannelView from './pages/ChannelView';
import { getAuthToken } from './api';
import { initSocket } from './socket';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [showLogin, setShowLogin] = useState(true); // Toggle Login/Signup UI

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
      initSocket().connect();
    }
  }, []);

  // Not logged in → Show LOGIN/SIGNUP card
  if (!getAuthToken()) {
    return (
      
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow p-4" style={{ width: "360px" }}>
          
          <h3 className="text-center mb-4">Mini Team Chat</h3>

          {/* Toggle between Login & Signup */}
          {showLogin ? (
            <Login onAuth={(u) => setUser(u)} />
          ) : (
            <Signup onAuth={(u) => setUser(u)} />
          )}

          <div className="text-center mt-3">
            {showLogin ? (
              <button className="btn btn-link" onClick={() => setShowLogin(false)}>
                Create a new account
              </button>
            ) : (
              <button className="btn btn-link" onClick={() => setShowLogin(true)}>
                Already have an account? Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 🔥 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  // Logged in UI (Chat)
  return (
    <div className="app d-flex" style={{ height: "100vh" }}>

      {/* Sidebar with Channels + Logout button */}
      <div
        className="sidebar bg-white border-end"
        style={{
          width: "260px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Channels onSelect={(c) => setActiveChannel(c)} />

        {/* Logout at bottom */}
        <div 
          style={{
            marginTop: "auto",
            padding: "16px",
            borderTop: "1px solid #ddd",
          }}
        >
          <button
            className="btn btn-danger w-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="main flex-grow-1 p-3">
        {activeChannel ? (
          <ChannelView channel={activeChannel} user={user} />
        ) : (
          <div className="empty-state">
            Select a channel to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
