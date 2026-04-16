import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const STATIC_EMAIL = "admin@gmail.com";
  const STATIC_PASSWORD = "admin123";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === STATIC_EMAIL && password === STATIC_PASSWORD) {
      alert("Login Successful");
      navigate("/admindashboard");
    } else {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-box">
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default AdminLogin;