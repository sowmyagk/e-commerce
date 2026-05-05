import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OtpPage.css";

function OtpPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.value;
  const name = location.state?.name;
  const phone = location.state?.phone;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: finalOtp, name, phone })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify({
        email,
        name: name || "User"
      }));
      alert("Login Successful");
      navigate("/");
    } else {
      alert(data.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    setTimer(30);
  };

  return (
    <div className="otp-overlay">
      <div className="otp-modal">

        <span className="close-btn" onClick={() => navigate("/login")}>
          ✕
        </span>

        <h2>Verify your OTP</h2>

        <p>
          We have sent an OTP to your number <b>{phone}</b> & email-id <b>{email}</b>
        </p>

        <div className="otp-inputs">
          {otp.map((digit, i) => (
            <input
              key={i}
              value={digit}
              maxLength="1"
              ref={el => inputsRef.current[i] = el}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
          ))}
        </div>

        <p className="resend-text">
          Didn’t get the code?{" "}
          {timer > 0 ? (
            <span>Resend in 00:{timer < 10 ? `0${timer}` : timer}</span>
          ) : (
            <span className="resend-btn" onClick={handleResend}>
              Resend
            </span>
          )}
        </p>

        <button className="verify-btn" onClick={handleVerify}>
          SUBMIT
        </button>

      </div>
    </div>
  );
}

export default OtpPage;