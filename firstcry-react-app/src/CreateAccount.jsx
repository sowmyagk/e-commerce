import React, { useState } from "react";
import "./CreateAccount.css";
import { useNavigate } from "react-router-dom";

function CreateAccount() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleOtp = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      alert("All fields required");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.success) {
        navigate("/OtpPage", {
          state: { email }
        });
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.log(err);
      alert("Error sending OTP");
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* HEADER */}
        <h2 className="title">Register</h2>

        {/* FORM */}
        <form onSubmit={handleOtp}>

          <label>Full Name *</label>
          <input
            type="text"
            placeholder="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email Id *</label>
          <input
            type="email"
            placeholder="Email Id *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Your Mobile No. *</label>
          <div className="phone-box">
            <span className="country">🇮🇳 +91</span>
            <input
              type="text"
              placeholder="Your Mobile No *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <p className="otp-info">
            OTP will be sent on this mobile no for verification
          </p>

          <button type="submit">
            GET OTP
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateAccount;