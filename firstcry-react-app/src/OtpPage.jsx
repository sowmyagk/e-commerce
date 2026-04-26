import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
      body: JSON.stringify({
        email,
        otp: otpValue,
        name: location.state?.name,
        phone: location.state?.phone
      })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify({ email }));

      navigate("/");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div>
      <h3>Enter OTP</h3>

      {otp.map((d, i) => (
        <input
          key={i}
          maxLength="1"
          value={d}
          onChange={(e) => handleChange(e.target.value, i)}
        />
      ))}

      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}

export default OtpPage;