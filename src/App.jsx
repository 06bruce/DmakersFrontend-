import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import AdminRegister from "./components/AdminRegister";
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./components/Dashboard";

function App() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <AdminLogin />} />
          <Route path="/register" element={<AdminRegister />} />
          <Route path="/dashboard/*" element={ <Dashboard /> } />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
