import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    names: "",
    age: "",
    gender: "",
    guardian: "",
    residence: "",
  });

  const token = localStorage.getItem("token");
  const API = `${process.env.REACT_APP_API_URL}/users`;

  // Wrap fetchUsers in useCallback to prevent infinite re-renders
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);

      if (err.response?.status === 401) {
        // Token is invalid, redirect to login
        // localStorage.removeItem("token");
        alert("Session expired. Please login again.");
        // navigate("/");
      } else {
        alert("Failed to fetch users. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [API, token, navigate]);

  // Check if user is authenticated
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [token, navigate, fetchUsers]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed. Please try again.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({
      names: user.names,
      age: user.age,
      gender: user.gender,
      guardian: user.guardian,
      residence: user.residence,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/${editingUser}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User updated successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed. Please try again.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User added successfully!");
      setShowAddForm(false);
      setFormData({ names: "", age: "", gender: "", guardian: "", residence: "" });
      fetchUsers();
    } catch (error) {
      console.error("Add user error:", error);
      alert(error.response?.data?.message || "Failed to add user. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Filter users based on search and gender filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.residence.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.guardian.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === "" || user.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  // Calculate statistics
  const totalUsers = users.length;
  const maleUsers = users.filter(user => user.gender === "Male").length;
  const femaleUsers = users.filter(user => user.gender === "Female").length;
  const averageAge = users.length > 0 ? Math.round(users.reduce((sum, user) => sum + user.age, 0) / users.length) : 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👥 User Management System</h1>
          <p style={styles.subtitle}>Admin Dashboard</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>

      {/* Statistics Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <h3>📊 Total Users</h3>
          <p style={styles.statNumber}>{totalUsers}</p>
        </div>
        <div style={styles.statCard}>
          <h3>👨 Male Users</h3>
          <p style={styles.statNumber}>{maleUsers}</p>
        </div>
        <div style={styles.statCard}>
          <h3>👩 Female Users</h3>
          <p style={styles.statNumber}>{femaleUsers}</p>
        </div>
        <div style={styles.statCard}>
          <h3>📈 Average Age</h3>
          <p style={styles.statNumber}>{averageAge}</p>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchFilter}>
          <input
            type="text"
            placeholder="🔍 Search by name, residence, or guardian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={styles.addBtn}
        >
          {showAddForm ? "❌ Cancel" : "➕ Add New User"}
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div style={styles.addForm}>
          <h3>Add New User</h3>
          <form onSubmit={handleAddUser} style={styles.form}>
            <div style={styles.formRow}>
              <input
                name="names"
                placeholder="Full Names"
                required
                value={formData.names}
                onChange={handleChange}
                style={styles.formInput}
              />
              <input
                name="age"
                type="number"
                placeholder="Age"
                required
                value={formData.age}
                onChange={handleChange}
                style={styles.formInput}
              />
            </div>
            <div style={styles.formRow}>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                style={styles.formInput}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                name="residence"
                placeholder="Residence"
                required
                value={formData.residence}
                onChange={handleChange}
                style={styles.formInput}
              />
            </div>
            <input
              name="guardian"
              placeholder="Guardian/Parent Name"
              required
              value={formData.guardian}
              onChange={handleChange}
              style={styles.formInput}
            />
            <button type="submit" style={styles.submitBtn}>
              ✅ Add User
            </button>
          </form>
        </div>
      )}

      {/* Users List */}
      {loading ? (
        <div style={styles.loading}>
          <p>📜 Loading users...</p>
        </div>
      ) : (
        <div style={styles.usersSection}>
          <h3 style={styles.sectionTitle}>
            📋 Registered Users ({filteredUsers.length})
          </h3>
          {filteredUsers.length === 0 ? (
            <div style={styles.emptyState}>
              <p>📭 No users found matching your criteria.</p>
            </div>
          ) : (
            <div style={styles.usersGrid}>
              {filteredUsers.map((user) => (
                <div key={user._id} style={styles.userCard}>
                  {editingUser === user._id ? (
                    <form onSubmit={handleUpdate} style={styles.editForm}>
                      <input
                        name="names"
                        value={formData.names}
                        onChange={handleChange}
                        required
                        style={styles.editInput}
                      />
                      <input
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        style={styles.editInput}
                      />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        style={styles.editInput}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        name="residence"
                        value={formData.residence}
                        onChange={handleChange}
                        required
                        style={styles.editInput}
                      />
                      <input
                        name="guardian"
                        value={formData.guardian}
                        onChange={handleChange}
                        required
                        style={styles.editInput}
                      />
                      <div style={styles.editActions}>
                        <button type="submit" style={styles.saveBtn}>
                          💾 Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          type="button"
                          style={styles.cancelBtn}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div style={styles.userInfo}>
                        <h4 style={styles.userName}>{user.names}</h4>
                        <div style={styles.userDetails}>
                          <p><span style={styles.label}>Age:</span> {user.age} years</p>
                          <p><span style={styles.label}>Gender:</span> {user.gender}</p>
                          <p><span style={styles.label}>Residence:</span> {user.residence}</p>
                          <p><span style={styles.label}>Guardian:</span> {user.guardian}</p>
                        </div>
                      </div>
                      <div style={styles.cardActions}>
                        <button
                          onClick={() => handleEdit(user)}
                          style={styles.editBtn}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          style={styles.deleteBtn}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    color: "#2c3e50",
    fontSize: "28px",
    fontWeight: "700",
  },
  subtitle: {
    margin: "5px 0 0 0",
    color: "#7f8c8d",
    fontSize: "16px",
  },
  logoutBtn: {
    padding: "12px 24px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background 0.3s",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#3498db",
    margin: "10px 0 0 0",
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "15px",
  },
  searchFilter: {
    display: "flex",
    gap: "15px",
    flex: 1,
    maxWidth: "600px",
  },
  searchInput: {
    flex: 1,
    padding: "12px 16px",
    border: "2px solid #e1e8ed",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  filterSelect: {
    padding: "12px 16px",
    border: "2px solid #e1e8ed",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    minWidth: "150px",
  },
  addBtn: {
    padding: "12px 24px",
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background 0.3s",
  },
  addForm: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  formInput: {
    padding: "12px 16px",
    border: "2px solid #e1e8ed",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  submitBtn: {
    padding: "12px 24px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    alignSelf: "flex-start",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#7f8c8d",
  },
  usersSection: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    margin: "0 0 20px 0",
    color: "#2c3e50",
    fontSize: "20px",
    fontWeight: "600",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#7f8c8d",
    fontSize: "16px",
  },
  usersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px",
  },
  userCard: {
    border: "2px solid #e1e8ed",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "#fafbfc",
    transition: "all 0.3s ease",
  },
  userInfo: {
    marginBottom: "15px",
  },
  userName: {
    margin: "0 0 10px 0",
    color: "#2c3e50",
    fontSize: "18px",
    fontWeight: "600",
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontWeight: "600",
    color: "#7f8c8d",
    marginRight: "5px",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
  },
  editBtn: {
    flex: 1,
    padding: "8px 16px",
    backgroundColor: "#f39c12",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "12px",
    transition: "background 0.3s",
  },
  deleteBtn: {
    flex: 1,
    padding: "8px 16px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "12px",
    transition: "background 0.3s",
  },
  editForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  editInput: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "12px",
  },
  editActions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  saveBtn: {
    flex: 1,
    padding: "8px 16px",
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  cancelBtn: {
    flex: 1,
    padding: "8px 16px",
    backgroundColor: "#95a5a6",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default Dashboard;
