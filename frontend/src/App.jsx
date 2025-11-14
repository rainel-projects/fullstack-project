import React, { useEffect, useState } from "react";
import { registerUser, getUsers } from "./api";

function App() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      const data = res.data;

      // 🔥 FIX: Ensure users is always an array
      const safeUsers =
        Array.isArray(data) ? data :
        Array.isArray(data?.users) ? data.users :
        [];

      setUsers(safeUsers);

    } catch (err) {
      console.error("Error loading users", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await registerUser(form);
      setMessage(res.data || "Registered");
      setForm({ name: "", email: "", password: "" });

      await loadUsers();
    } catch (err) {
      setMessage("Error registering user");
    } finally {
      setSubmitting(false);
    }
  };

  // Theme color
  const neonPurple = "#b067ff";

  // Styles
  const container = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    fontFamily: "'Poppins', sans-serif",
    color: "white",
    background:
      "radial-gradient(circle at 20% 20%, rgba(180, 97, 255, 0.15), transparent 12%)," +
      "radial-gradient(circle at 80% 75%, rgba(255, 110, 180, 0.12), transparent 18%)," +
      "linear-gradient(135deg, #1a0030 0%, #0c0018 100%)",
    overflow: "auto"
  };

  const card = {
    width: "960px",
    maxWidth: "95%",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 10px 40px rgba(5,0,10,0.8)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
    border: "1px solid rgba(255,255,255,0.05)",
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: "24px",
    alignItems: "start"
  };

  const left = { padding: "6px 12px" };

  const right = {
    padding: "8px 12px",
    borderRadius: "12px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    border: "1px solid rgba(255,255,255,0.025)"
  };

  const headerBox = { marginBottom: "10px" };

  const headerTitle = {
    fontSize: "34px",
    fontWeight: 700,
    background: `linear-gradient(90deg, ${neonPurple}, #ff66cc)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  };

  const headerSubtitle = {
    marginTop: "4px",
    color: "rgba(255,255,255,0.7)",
    fontSize: "14px"
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "18px",
    maxWidth: "420px"
  };

  const inputBase = {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.03)",
    color: "white",
    outline: "none",
    fontSize: "14px",
    boxShadow: "inset 0 -4px 8px rgba(0,0,0,0.4)"
  };

  const inputFocus = {
    border: `1px solid ${neonPurple}`,
    boxShadow: `0 0 12px ${neonPurple}55, inset 0 -4px 8px rgba(0,0,0,0.3)`
  };

  const button = {
    marginTop: "6px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    cursor: submitting ? "default" : "pointer",
    fontWeight: 700,
    background: submitting
      ? "rgba(255,255,255,0.05)"
      : `linear-gradient(90deg, ${neonPurple}, #ff66cc)`,
    color: submitting ? "rgba(255,255,255,0.8)" : "#0b0b0b"
  };

  const messageStyle = {
    marginTop: "10px",
    color: message.toLowerCase().includes("error") ? "#ff9e9e" : "#b8ffcc",
    fontWeight: 600
  };

  const usersList = {
    marginTop: "14px",
    listStyle: "none",
    padding: 0,
    display: "grid",
    gap: "8px"
  };

  const userItem = {
    padding: "10px 12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.03)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  const TextInput = ({ name, placeholder, type = "text", value, onChange }) => {
    const [focus, setFocus] = useState(false);
    return (
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          ...inputBase,
          ...(focus ? inputFocus : {}),
          transition: "0.2s"
        }}
      />
    );
  };

  return (
    <div style={container}>
      <div style={card}>
        <div style={left}>
          <div style={headerBox}>
            <div style={headerTitle}>User Registration</div>
            <div style={headerSubtitle}>
              Create an account quickly — minimal neon theme, fully inline-styled.
            </div>
          </div>

          <form onSubmit={handleSubmit} style={formStyle}>
            <TextInput name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
            <TextInput name="email" placeholder="Email address" type="email" value={form.email} onChange={handleChange} />
            <TextInput name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />

            <button type="submit" style={button} disabled={submitting}>
              {submitting ? "Registering..." : "Register"}
            </button>

            <div style={messageStyle}>{message}</div>
          </form>
        </div>

        <aside style={right}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Registered Users</div>

          <ul style={usersList}>
            {users.length === 0 ? (
              <li style={{ opacity: 0.6 }}>No users yet</li>
            ) : (
              users.map((u, i) => (
                <li key={i} style={userItem}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{u.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{u.email}</div>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>
                    {"•".repeat(Math.min(6, u.password?.length || 0))}
                  </div>
                </li>
              ))
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default App;
