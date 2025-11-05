import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./Login.jsx";
import Home from "./Home.jsx";
import CreateTask from "./createTask.jsx";
import TaskAttention from "./TaskAttention.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/tasks-pending" element={<TaskAttention />} />
      </Routes>
    </Router>
  );
}

export default App;
