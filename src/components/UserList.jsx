import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = ({ onEdit, onDelete }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        alert("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (users.length === 0) return <p>No users found.</p>;

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>📋 Registered Users</h3>
      {users.map((user) => (
        <div key={user._id} style={styles.card}>
          <div style={styles.details}>
            <p><strong>{user.names}</strong></p>
            <p>Age: {user.age}</p>
            <p>Gender: {user.gender}</p>
            <p>Residence: {user.residence}</p>
            <p>Guardian: {user.guardian}</p>
          </div>
          <div style={styles.actions}>
            <button onClick={() => onEdit(user._id)} style={styles.editBtn}>
              ✏️ Edit
            </button>
            <button onClick={() => onDelete(user._id)} style={styles.deleteBtn}>
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  heading: {
    marginBottom: "15px",
    fontSize: "20px",
    color: "#222",
    fontWeight: "600",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
    transition: "box-shadow 0.2s ease",
  },
  details: {
    flex: 1,
    minWidth: "200px",
    marginBottom: "10px",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  editBtn: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default UserList;
