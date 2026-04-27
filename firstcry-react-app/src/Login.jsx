import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/check-user", {
        input,
      });

      if (res.data.exists) {
        // Existing user → send OTP
        await axios.post("http://localhost:3001/api/send-otp", { input });

        navigate("/otp", { state: { input } });
      } else {
        // New user → go to register
        navigate("/register", { state: { input } });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Log In / Register</h2>
      <input
        type="text"
        placeholder="Enter Email or Mobile"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleContinue}>CONTINUE</button>
    </div>
  );
}