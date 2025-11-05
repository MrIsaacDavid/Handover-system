import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./App.css";
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setSuccess("Login Successful!");
        setError("");
        setTimeout(() => {
          navigate("/home");
        }, 500);
      } else {
        setError(data.message || "Login failed. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login.");
      setSuccess("");
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "6rem auto",
        padding: "4rem",
        border: "1px solid #ccc",
        borderRadius: "12px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff"
      }}
    >
      <fieldset style={{ border: "none", padding: 0 }}>
        <legend style={{ fontSize: "2rem", marginBottom: "2rem" ,textAlign: "center"}}>Log In</legend>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Email Address</label>
          <input
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              backgroundColor: "#e6f2ff"
            }}
          />
        </div>
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                paddingRight: "0.9rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                backgroundColor: "#e6f2ff"
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "0.01%",
                top: "70%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#3498db",
                fontSize: "1.2rem",
                lineHeight: "1"
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

          </div>



        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1rem" }}>
            <input type="checkbox" id="remember" />
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            backgroundColor: "#3498db",
            color: "#fff",
            padding: "1rem",
            border: "none",
            borderRadius: "6px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </fieldset>

      {error && (
        <p style={{ color: "red", marginTop: "1.5rem", textAlign: "center", fontSize: "1rem" }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ color: "green", marginTop: "1.5rem", textAlign: "center", fontSize: "1rem" }}>
          {success}
        </p>
      )}
    </form>
  );
}

export default LoginForm;
