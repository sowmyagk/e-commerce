import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [phone, setPhone] = useState("");

  const handleOtp = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      alert("All fields required");
      return;
    }

    await fetch(`${import.meta.env.VITE_API_URL}/api/otp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    navigate("/OtpPage", {
      state: { email, name, phone }
    });
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleOtp}>
        <input
          type="text"
          placeholder="Name"
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
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button type="submit">GET OTP</button>
      </form>
    </div>
  );
}

export default CreateAccount;