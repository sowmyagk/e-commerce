import React, { useState } from "react";
import "./CreateAccount.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function CreateAccount() {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: location.state?.input || "",
  });

  const handleRegister = async () => {
    await axios.post("http://localhost:3001/api/register", form);

    await axios.post("http://localhost:3001/api/send-otp", {
      input: form.mobile,
    });

    navigate("/otp", { state: { input: form.mobile } });
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>

      <input
        placeholder="Full Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Mobile"
        value={form.mobile}
        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
      />

      <button onClick={handleRegister}>GET OTP</button>
    </div>
  );
}