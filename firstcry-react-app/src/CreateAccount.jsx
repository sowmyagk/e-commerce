import React, { useState } from "react";
import "./CreateAccount.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateAccount() {
  const navigate = useNavigate();  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleOtp = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
        name,
        email,
        phone
      });

      console.log(result.data);
      alert("OTP sent successfully");
      navigate("/OtpPage", {
        state: {
         value: phone,
          otp: result.data.otp
  }
});

    } catch (err) {
      console.log(err);
      alert("Error sending OTP");
    }
  };

  return (
    <div className="register-page">

      <div className="register-banner">
        <img
          src="https://cdn.fcglcdn.com/brainbees/images/m/login_revamp_banner_mobile.webp"
          alt="offer"
        />
      </div>

      <div className="register-card">

        <div className="register-header">
          <span className="back-arrow">←</span>
          <h2>Register</h2>
        </div>

        <p style={{
          fontSize:"13px",
          background:"#f6f1e5",
          padding:"8px",
          borderRadius:"6px",
          marginBottom:"15px"
        }}>
          Kindly fill & submit the below information to create your FirstCry account
        </p>

    
        <div className="form-group">
          <label>Full Name <span>*</span></label>
          <input
            type="text"
            placeholder="Full Name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email Id <span>*</span></label>
          <input
            type="email"
            placeholder="Email Id*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

      
        <div className="form-group">
          <label>Your Mobile No. <span>*</span></label>

          <div className="mobile-box">
            <select>
              <option>+91</option>
              <option>+1</option>
            </select>

            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <span className="otp-text">
            OTP will be sent on this mobile number for verification
          </span>
        </div>

        <button className="otp-btn" onClick={handleOtp}>
          GET OTP
        </button>

      </div>
    </div>
  );
}

export default CreateAccount;


