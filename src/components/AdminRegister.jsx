import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",        // changed from 'names'
    phone: "",       // changed from 'number'
    email: "",
    password: "",
    role: "", // Add this field
  });

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // console.log("Submitting form data:", formData); // DEBUG

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/register`, formData);
      alert("Registration successful! Please login.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error.response);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Admin Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          name="phone"
          placeholder="Phone Number"
          required
          value={formData.phone}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <select
          name="role"
          required
          value={formData.role}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <button type="submit" style={{ padding: 10, width: "100%" }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: 15 }}>
        Already registered? <Link to="/">Login here</Link>
      </p>
    </div>
  );
};




export default AdminRegister;
