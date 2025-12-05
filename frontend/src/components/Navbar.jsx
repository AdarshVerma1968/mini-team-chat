import React from "react";
import { logout } from "../api";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();            // remove token + user
    navigate("/login");  // redirect
    window.location.reload();  // force App to re-render without token
  };
  

  return (
    <div className="navbar">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
