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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false)

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

  const getInputStyle = (fieldName) => ({
    width : 380,
    marginBottom: "10px",
    padding: "12px 16px",
    border: errors[fieldName] ? "2px solid #e74c3c" : "2px solid #e1e8ed",
    borderRadius: "8px",
    fontsize: "14px",
    outline: "none",
    transitioin: "bordero-color 0.3s"
  }); 

  return (
    <div 
    style=
    {{ 
      maxWidth: 400,
      margin: "50px auto",
      padding: "30px",
      backgroundColor: "whitesmoke",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
     }}>
      <h3>Welcome to Dream Makers Organisation Portal</h3>
      <h2 
        style={{
           textAlign: "center",
           marginBottom: "20px",
           color: "#2c3e50",
           fontSize: "25px",
           fontWeight: "800"
        }}  
      > 🔏Admin Registration</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder=" 📃 Full Name"
          required
          value={formData.name}
          onChange={handleChange}
          style={getInputStyle('')}
        />
        <input
          name="phone"
          placeholder=" 📞 Phone Number"
          required
          value={formData.phone}
          onChange={handleChange}
          style={getInputStyle('phone')}
        />
        <input
          type="email"
          name="email"
          placeholder=" 📧 Email"
          required
          value={formData.email}
          onChange={handleChange}
          style={getInputStyle('email')}
        />
        <input
          type="password"
          name="password"
          placeholder=" 🔒 Password"
          required
          value={formData.password}
          onChange={handleChange}
          style={getInputStyle('password')}
        />
        <select
          name="role"
          required
          value={formData.role}
          onChange={handleChange}
          style={getInputStyle('role')}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <button 
         type="submit" 
         style=
         {{ 
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
          }}>
          Register
        </button>
      </form>

      <p style=
       {{ 
         marginTop: 15 ,
         textAlign: "center",
         color: "#7f8c8d",
       }}>
        Already registered? <Link to="/"  
         style={{
          color: "#3498db",
          textDecoration: "none"

         }}
        >Login here</Link>
      </p>
    </div>
  );
};

export default AdminRegister;
