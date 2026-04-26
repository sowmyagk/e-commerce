import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    if (!email) {
      alert("Enter email");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.success) {
        navigate("/OtpPage", { state: { email } });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Log In/Register</h2>

        <label>Enter your Email</label>

        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleLogin}>
          CONTINUE
        </button>

        <p className="register-link">
          New user? <Link to="/register">Register Here</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;