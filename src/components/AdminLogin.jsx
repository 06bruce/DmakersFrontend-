import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";


const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      console.log("Attempting login with:", formData);
      
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/admin/login`, formData);
      
      console.log("Login response:", res.data);
      
      // Store token
      localStorage.setItem("token", res.data.token);
      
      // alert("Login successful! Welcome back!");
      
      console.log("About to navigate to dashboard...");
      
      navigate("/Dashboard");
      
      console.log("Navigation should have happened");
      
    } catch (err) {
      console.error("Login error:", err);
      const message = err.response?.data?.message || "Login failed. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (fieldName) => ({
    width: "100%",
    marginBottom: "10px",
    padding: "12px 16px",
    border: errors[fieldName] ? "2px solid #e74c3c" : "2px solid #e1e8ed",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.3s",
  });

  return (
    <div style={{
      maxWidth: 400,
      margin: "50px auto",
      padding: "30px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: "30px",
        color: "#2c3e50",
        fontSize: "24px",
        fontWeight: "600",
      }}>
        🔐 Admin Login
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="email"
            name="email"
            placeholder="📧 Email Address"
            value={formData.email}
            onChange={handleChange}
            style={getInputStyle('email')}
            disabled={loading}
          />
          {errors.email && (
            <p style={{ color: "#e74c3c", fontSize: "12px", margin: "5px 0 0 0" }}>
              {errors.email}
            </p>
          )}
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <input
            type="password"
            name="password"
            placeholder="🔒 Password"
            value={formData.password}
            onChange={handleChange}
            style={getInputStyle('password')}
            disabled={loading}
          />
          {errors.password && (
            <p style={{ color: "#e74c3c", fontSize: "12px", margin: "5px 0 0 0" }}>
              {errors.password}
            </p>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: loading ? "#95a5a6" : "#3498db",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      <p style={{ 
        marginTop: "20px", 
        textAlign: "center",
        color: "#7f8c8d",
      }}>
        New admin? <Link to="/register" style={{ color: "#3498db", textDecoration: "none" }}>Register here</Link>
      </p>
    </div>
  );
};

export default AdminLogin;
