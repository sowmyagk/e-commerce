import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OtpPage.css";

function OtpPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, otp: otpValue })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify({ value: email }));
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">

        <h3>Verify your OTP</h3>
        <p>OTP sent to {email}</p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
            />
          ))}
        </div>

        <button onClick={handleVerify}>
          SUBMIT
        </button>

      </div>
    </div>
  );
}

export default OtpPage;