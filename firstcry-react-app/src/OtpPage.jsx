import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OtpPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const [otpInput, setOtpInput] = useState("");

  const handleVerify = async () => {

    const res = await fetch(`${import.meta.env.VITE_API_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: otpInput })
    });

    const data = await res.json();

    if (data.success) {
        localStorage.setItem("user", JSON.stringify({
    value: location.state?.value
  }));

      alert("Login Successful");
      navigate("/");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div>
      <h2>Enter OTP</h2>

      <p>OTP sent to {location.state?.value}</p>
      <p>Demo OTP: {location.state?.otp}</p>

      <input
        type="text"
        maxLength="6"
        value={otpInput}
        onChange={(e) => setOtpInput(e.target.value)}
      />

      <button onClick={handleVerify}>VERIFY OTP</button>
    </div>
  );
}

export default OtpPage;