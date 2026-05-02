import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OtpPage.css";

function OtpPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef([]);

  // ⏳ Timer countdown
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Handle input change
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // ⬅ Backspace handling
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  //  Verify OTP
  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      alert("Enter complete OTP");
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/otp/verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: location.state?.value,
          otp: finalOtp,
          name: location.state?.name,
          phone: location.state?.phone,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user)); 

      alert("Login Successful");
      navigate("/");
    } else {
      alert("Invalid OTP");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/otp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: location.state?.value,
      }),
    });

    setTimer(30);
    alert("OTP Resent");
  };

  return (
    <div className="otp-container">

      {/* LEFT IMAGE */}
      <div className="otp-banner">
        <img
          src="https://cdn.fcglcdn.com/brainbees/images/m/login_revamp_banner_mobile.webp"
          alt="banner"
        />
      </div>

      {/* RIGHT BOX */}
      <div className="otp-box">
        <h2>OTP Verification</h2>

        <p className="sub-text">
          Enter the OTP sent to <b>{location.state?.value}</b>
        </p>

        {/* OTP INPUT BOXES */}
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {/* VERIFY BUTTON */}
        <button className="verify-btn" onClick={handleVerify}>
          VERIFY OTP
        </button>

        {/* TIMER / RESEND */}
        <div className="resend-section">
          {timer > 0 ? (
            <p>Resend OTP in <span>{timer}s</span></p>
          ) : (
            <button onClick={handleResend} className="resend-btn">
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OtpPage;


