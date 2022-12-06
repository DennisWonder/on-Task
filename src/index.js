import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Profile from "./pages/admin/profile/Profile";
import SpecificWorkSpace from "./pages/Workspaces/SpecificWorkSpace";
import WorkSpaces from "./pages/Workspaces/WorkSpaces";
import Tasks from "./pages/Workspaces/Tasks";
import Events from "./pages/events/Events";
import { supabaseClient } from "./config/supabase-client";
import userContext from "./context/UserContext";
import CompletedTasks from "./pages/Workspaces/CompletedTasks";
import ResetPassword from "./components/auth/ResetPassword";
import CreatedWorkSpaces from "./pages/Workspaces/CreatedWorkSpaces";
import CollaboratedTasks from "./pages/Workspaces/CollaboratedTasks";

const root = ReactDOM.createRoot(document.getElementById("root"));
const session = supabaseClient.auth.session();

root.render(
  <userContext.Provider value={session}>
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/" element={<App />} />
          <Route path="admin/profile" element={<Profile />} />
          <Route path="admin/work-spaces" element={<WorkSpaces />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/tasks-completed" element={<CompletedTasks />} />
          <Route path="/admin/tasks-created" element={<CreatedWorkSpaces />} />
          <Route
            path="/admin/tasks-collaborated"
            element={<CollaboratedTasks />}
          />

          <Route
            path="/admin/work-spaces/:id"
            element={<SpecificWorkSpace />}
          />
          <Route path="/admin/work-spaces/tasks/:space" element={<Tasks />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </React.StrictMode>
  </userContext.Provider>
);
