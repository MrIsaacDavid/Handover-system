import { useState, useEffect } from "react";
import TopBar from "./components/Nav/TopBar.jsx";
import SideBar from "./components/Nav/SideBar.jsx";

// Session Expired Banner Component

const SessionExpiredBanner = () => (
  <div style={{
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "1rem",
    textAlign: "center",
    fontWeight: "bold",
    borderRadius: "6px",
    marginBottom: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  }}>
    Your session has expired. Redirecting to login…
  </div>
);

//  Status Label Component
const StatusLabel = ({ status }) => {
  const colorMap = {
    "Completed": "green",
    "In Progress": "orange",
    "Not Started": "red",
  };

  return (
    <span style={{
      color: colorMap[status] || "black",
      fontWeight: "bold",
      padding: "0.25rem 0.5rem",
      borderRadius: "6px",
      backgroundColor: "#f9f9f9"
    }}>
      {status}
    </span>
  );
};

function Home() {
  const [tasks, setTasks] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchTasks();
  }, []);

  //  Auto-redirect after session expires
  useEffect(() => {
    if (sessionExpired) {
      // Wait for banner to render, then redirect
      const timer = setTimeout(() => {
        window.location.href = "/login";
      }, 3000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [sessionExpired]);


  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/tasks`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      // Check for session expiration
      if (response.status === 401) {
        console.warn("Session expired: redirecting to login");
        setSessionExpired(true);
        return;
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
        credentials: "include",
      });

      // Check for session expiration
      if (response.status === 401) {
        setSessionExpired(true);
        return;
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Error searching tasks:", error);
    }
  };

  return (
    <>
      <TopBar />
      <SideBar />

      <div style={{
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        paddingTop: "1px",
        marginLeft: "24px"
      }}>
        <div style={{
          width: "100%",
          margin: "0 auto",
          paddingTop: "2rem",
          paddingRight: "1rem",
          paddingBottom: "2rem",
          paddingLeft: "11rem",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)"
        }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>
            Welcome to Hand Over!
          </h1>

          {/*  Session Expired Banner */}
          {sessionExpired && <SessionExpiredBanner />}

          <form onSubmit={handleSearch} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: "50%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "1rem"
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: "50%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "1rem"
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: "#3498db",
                  color: "#fff",
                  padding: "1rem",
                  border: "none",
                  borderRadius: "15px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Search
              </button>
            </div>
          </form>

          {tasks.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#ecf0f1", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem", borderBottom: "2px solid #ccc" }}>Username</th>
                  <th style={{ padding: "0.75rem", borderBottom: "2px solid #ccc" }}>Date Created</th>
                  <th style={{ padding: "0.75rem", borderBottom: "2px solid #ccc" }}>Description</th>
                  <th style={{ padding: "0.75rem", borderBottom: "2px solid #ccc" }}>Task(s) Handled</th>
                  <th style={{ padding: "0.75rem", borderBottom: "2px solid #ccc" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={index}>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}>{task.username}</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}>
                      {new Date(task.date_created).toLocaleString()}
                    </td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}>{task.description}</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}>{task.task_handled}</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}>
                      <StatusLabel status={task.task_status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontStyle: "italic", marginTop: "2rem", color: "#666" }}>
              No tasks found in the last 24 hours.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
