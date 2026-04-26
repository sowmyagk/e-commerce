import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OtpPage.css";

function OtpPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const name = location.state?.name;
  const phone = location.state?.phone;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // ✅ Redirect if no email (important)
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // ✅ Auto move to next box
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");

    // ✅ Check full OTP
    if (otpValue.length !== 6) {
      alert("Enter complete OTP");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          otp: otpValue,
          name,
          phone
        })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify({ email }));

        alert("Login Successful ✅");
        navigate("/");
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      console.log(err);
      alert("Error verifying OTP");
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
              id={`otp-${index}`}
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
            />
          ))}
        </div>

        <button onClick={handleVerify}>
          VERIFY
        </button>

      </div>
    </div>
  );
}

export default OtpPage;