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
        alert("OTP sent to email");

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

        <h2>Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Mobile"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button onClick={handleOtp}>
          GET OTP
        </button>

      </div>
    </div>
  );
}

export default CreateAccount;