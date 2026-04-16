import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {

  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const handleLogin = async () => {

    if (!value) {
      alert("Please enter Email or Mobile");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/OTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ value })
      });

      const data = await res.json();

      if (data.success) {
        navigate("/OtpPage", {
          state: {
            value: value,
            otp: data.otp
          }
        });
      } else {
        alert("Failed to send OTP");
      }

    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="main-box">

      <div className="offer">
        <img
          src="https://cdn.fcglcdn.com/brainbees/images/m/login_revamp_banner_mobile.webp"
          alt="offer"
        />
      </div>
      <div className="login-box">
        <h2>Log In / Register</h2>

        <label>Email-Id or Mobile No*</label>
        <input
          type="text"
          placeholder="Enter your Email-Id or Mobile No*"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button className="btn" onClick={handleLogin}>
          CONTINUE
        </button>

        <p className="register">
          New user? <Link to="/register">Register Here</Link>
        </p>

        <p className="or">Or login with</p>

        <div className="google-btn">
          <img
            src="https://img.icons8.com/color/20/google-logo.png"
            alt="google"
          />
        </div>

        <p className="terms">
          By continuing, you agree to Terms of Use & Privacy Policy
        </p>
      </div>

    </div>
  );
}

export default Login;