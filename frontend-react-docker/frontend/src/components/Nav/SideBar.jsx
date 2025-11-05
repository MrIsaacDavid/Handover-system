import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/Logo.png";

function SideBar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.username) {
      setUsername(userData.username);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        credentials: "include"
      });
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        backgroundColor: "#34495e",
        color: "white",
        position: "fixed",
        top: 0,
        left: 0,
        padding: "2rem 1rem",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div>
        {/* Logo at the top */}
        <img
        src={logo}
        alt="Hand Over Logo"
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "58px", // fixed height
          objectFit: "cover", // optional: trims overflow while preserving aspect
          marginBottom: "2rem",
          borderRadius: "6px",
          display: "block"
        }}
      />


        {/* Existing heading remains */}
        <h2 style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>Hand Over</h2>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link
            to="/home"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/create-task"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            Create Task
          </Link>
           <Link
            to="/tasks/pending"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            High Priority Task
          </Link>
        </nav>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: "1rem" }}>
        <span style={{ marginBottom: "0.5rem", display: "block" }}>{username}</span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e74c3c",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default SideBar;
