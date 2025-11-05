import { useState, useEffect } from "react";
import TopBar from "./components/Nav/TopBar.jsx";
import SideBar from "./components/Nav/SideBar.jsx";

//  Session Expired Banner Component

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

// Status Label Component
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

function TaskAttention() {
  const [tasks, setTasks] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
      const response = await fetch(`${API_BASE}/tasks/pending`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      //  Check for session expiration
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

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      //  Check for session expiration
      if (res.status === 401) {
        setSessionExpired(true);
        return;
      }

      const text = await res.text();

      if (!res.ok) {
        try {
          const error = JSON.parse(text);
          console.error("Update failed:", error);
        } catch {
          console.error("Update failed with non-JSON response:", text);
        }
        return;
      }

      const result = JSON.parse(text);
      console.log("Update response:", result);

      setToastMessage(`Task updated to "${newStatus}"`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      fetchTasks();
    } catch (error) {
      console.error("Network or parsing error:", error);
    }
  };

  return (
    <>
      <TopBar />
      <SideBar />

      <div style={{ backgroundColor: "#fafafa", minHeight: "100vh", paddingTop: "10px" }}>
        <div style={{
          marginLeft: "240px",
          padding: "2rem 11rem",
          maxWidth: "1000px",
          marginRight: "auto",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)"
        }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>Pending Tasks</h1>

          {/*  Session Expired Banner */}
          {sessionExpired && <SessionExpiredBanner />}

          {/*  Success Toast */}
          {showToast && (
            <div style={{
              backgroundColor: "#2ecc71",
              color: "#fff",
              padding: "0.75rem 1rem",
              borderRadius: "4px",
              marginBottom: "1rem",
              textAlign: "center",
              fontWeight: "bold",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}>
              {toastMessage}
            </div>
          )}

          {tasks.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ backgroundColor: "#ecf0f1", textAlign: "left" }}>
                  <th style={{ width: "150px", padding: "0.75rem", borderBottom: "2px solid #ccc" }}>Username</th>
                  <th style={{ width: "180px", padding: "0.75rem", borderBottom: "2px solid #ccc" }}>Date Created</th>
                  <th style={{ width: "180px", padding: "0.75rem", borderBottom: "2px solid #ccc" }}>Description</th>
                  <th style={{ width: "200px", padding: "0.75rem", borderBottom: "2px solid #ccc" }}>Task(s) Handled</th>
                  <th style={{ width: "150px", padding: "0.75rem", borderBottom: "2px solid #ccc" }}>Status</th>
                  <th style={{ width: "180px", padding: "0.75rem", borderBottom: "2px solid #ccc" }}>Update Task</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={index}>
                    <td style={{ width: "150px", padding: "0.75rem", borderBottom: "1px solid #eee" }}>{task.username}</td>
                    <td style={{ width: "180px", padding: "0.75rem", borderBottom: "1px solid #eee" }}>
                      {new Date(task.date_created).toLocaleString()}
                    </td>
                    <td style={{ width: "200px", padding: "0.75rem", borderBottom: "1px solid #eee" }}>{task.task_handled}</td>
                    <td style={{ width: "150px", padding: "0.75rem", borderBottom: "1px solid #eee" }}>
                      <StatusLabel status={task.task_status} />
                    </td>
                    <td style={{ width: "180px", padding: "0.75rem", borderBottom: "1px solid #eee", display: "flex", gap: "0.5rem" }}>
                      <select
                        value={selectedStatuses[task.id] || ""}
                        onChange={(e) =>
                          setSelectedStatuses((prev) => ({
                            ...prev,
                            [task.id]: e.target.value
                          }))
                        }
                        style={{
                          padding: "0.4rem",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          backgroundColor: "#f9f9f9",
                          flex: 1
                        }}
                      >
                        <option value="" disabled>Update</option>
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Not Started">Not Started</option>
                      </select>

                      <button
                        onClick={() =>
                          updateTaskStatus(task.id, selectedStatuses[task.id] || task.task_status)
                        }
                        style={{
                          padding: "0.4rem 0.65rem",
                          borderRadius: "4px",
                          border: "none",
                          backgroundColor: "#007bff",
                          color: "#fff",
                          cursor: "pointer",
                          marginLeft: "5rem"
                        }}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontStyle: "italic", marginTop: "2rem", color: "#666" }}>
              No tasks found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default TaskAttention;
