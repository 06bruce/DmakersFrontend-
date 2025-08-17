import React, { useState } from "react";
import axios from "axios";

const AddUser = () => {
  const [formData, setFormData] = useState({
    names: "",
    age: "",
    residence: "",
    guardian: "",
    gender: "",
  });

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_API_URL}/users`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User added successfully!");
      setFormData({
        names: "",
        age: "",
        residence: "",
        guardian: "",
        gender: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div>
      <h3>Add New User</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <input
          name="names"
          placeholder="Names"
          required
          value={formData.names}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          required
          value={formData.age}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          name="residence"
          placeholder="Residence"
          required
          value={formData.residence}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          name="guardian"
          placeholder="Guardian or Parent"
          required
          value={formData.guardian}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <select
          name="gender"
          required
          value={formData.gender}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit" style={{ padding: 10, width: "100%" }}>
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
