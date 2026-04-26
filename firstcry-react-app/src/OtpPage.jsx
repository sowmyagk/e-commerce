import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OtpPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [otpInput, setOtpInput] = useState("");

  const email = location.state?.email;

  const handleVerify = async () => {

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        otp: otpInput
      })
    });

    const data = await res.json();

    if (data.success) {

      localStorage.setItem("user", JSON.stringify({
        value: email
      }));

      alert("Login Successful");
      navigate("/");

    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h2>Enter OTP</h2>

      <p>OTP sent to {email}</p>

      <input
        type="text"
        maxLength="6"
        value={otpInput}
        onChange={(e) => setOtpInput(e.target.value)}
      />

      <button onClick={handleVerify}>
        VERIFY OTP
      </button>
    </div>
  );
}

export default OtpPage;