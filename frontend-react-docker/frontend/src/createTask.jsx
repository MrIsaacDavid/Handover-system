import { useState, useEffect } from "react";
import SideBar from "./components/Nav/SideBar.jsx";
import TopBar from "./components/Nav/TopBar.jsx";


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
    Your session has expired. Please log in again.
  </div>
);

function CreateTask() {
  const [tasks, setTasks] = useState([
    { description: "", task_handled: "", task_status: "" },
    { description: "", task_handled: "", task_status: "" },
    { description: "", task_handled: "", task_status: "" },
    { description: "", task_handled: "", task_status: "" },
    { description: "", task_handled: "", task_status: "" },
    { description: "", task_handled: "", task_status: "" }
  ]);

  const [showToast, setShowToast] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  //  Optional: Auto-redirect after session expires
  useEffect(() => {
    if (sessionExpired) {
      // Wait for banner to render, then redirect
      const timer = setTimeout(() => {
        window.location.href = "/login";
      }, 3000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [sessionExpired]);


  const handleAddTask = () => {
    setTasks([...tasks, { description: "", task_handled: "", task_status: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/create_task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tasks })
      });

      // Detect session expiration
      if (response.status === 401) {
        console.warn("Session expired: redirecting to login");
        setSessionExpired(true);
        return;
      }

      const data = await response.json();
      if (data.status === "success") {
        setTasks([
          { description: "", task_handled: "", task_status: "" },
          { description: "", task_handled: "", task_status: "" },
          { description: "", task_handled: "", task_status: "" },
          { description: "", task_handled: "", task_status: "" },
          { description: "", task_handled: "", task_status: "" },
          { description: "", task_handled: "", task_status: "" }
        ]);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        console.error("Submission error:", data.message);
      }
    } catch (error) {
      console.error("Error submitting tasks:", error);
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
        marginLeft: "20px",
        padding: "1rem"
      }}>
        <div style={{
          width: "100%",
          margin: "0 auto",
          paddingTop: "2rem",
          paddingRight: "11rem",
          paddingBottom: "2rem",
          paddingLeft: "11rem",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)"
        }}>
          <h1 style={{
            marginBottom: "2rem",
            fontSize: "1.75rem",
            textAlign: "center",
            outline: "none"
          }}>
            Create New Tasks
          </h1>

          {/* Session Expired Banner */}
          {sessionExpired && <SessionExpiredBanner />}

          {/* Success Toast */}
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
              Tasks successfully added!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
              fontWeight: "bold"
            }}>
              <label style={{ flex: 1, textIndent: "9rem" }}>Description</label>
              <label style={{ flex: 1, textIndent: "19rem" }}>Task Handled</label>
              <label style={{ flex: 1, textIndent: "21rem" }}>Task Status</label>
            </div>

            {tasks.map((task, index) => (
              <div key={index} style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem"
              }}>
                <input
                  type="text"
                  placeholder="Enter Description"
                  value={task.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "1rem"
                  }}
                />
                <input
                  type="text"
                  placeholder="Enter Task"
                  value={task.task_handled}
                  onChange={(e) => handleChange(index, "task_handled", e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "1rem"
                  }}
                />
                <select
                  value={task.task_status}
                  onChange={(e) => handleChange(index, "task_status", e.target.value)}
                  required
                  style={{
                    padding: "0.65rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "1rem"
                  }}
                >
                  <option value="" disabled>Select Status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            ))}

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button
                type="button"
                onClick={handleAddTask}
                style={{
                  backgroundColor: "#3498db",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Add Task
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: "#2ecc71",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateTask;
