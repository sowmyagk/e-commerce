import React, { useState } from "react";
import "./OtpPage.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const verifyOtp = async () => {
    const res = await axios.post("http://localhost:3001/api/verify-otp", {
      input: location.state.input,
      otp,
    });

    if (res.data.success) {
      alert("Login Successful");
      navigate("/");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="otp-container">
      <h3>Enter OTP</h3>

      <input
        type="text"
        maxLength="6"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={verifyOtp}>SUBMIT</button>
    </div>
  );
}