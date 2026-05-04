import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

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

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    console.log("Sending OTP:", finalOtp, "Email:", email);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        otp: finalOtp,
        name,
        phone
      })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify({
        email: email,
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    setTimer(30);
    alert("OTP Resent");
  };

  return (
    <div>
      <h2>OTP Verification</h2>
      <p>Sent to {email}</p>

      {otp.map((digit, i) => (
        <input
          key={i}
          value={digit}
          maxLength="1"
          ref={el => inputsRef.current[i] = el}
          onChange={(e) => handleChange(e.target.value, i)}
        />
      ))}

      <button onClick={handleVerify}>Verify</button>

      {timer > 0 ? (
        <p>{timer}s</p>
      ) : (
        <button onClick={handleResend}>Resend</button>
      )}
    </div>
  );
}

export default OtpPage;