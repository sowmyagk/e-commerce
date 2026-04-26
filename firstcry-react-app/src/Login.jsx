import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
        alert("OTP sent");

        navigate("/OtpPage", {
          state: { email }
        });
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleLogin}>
        CONTINUE
      </button>

      <p>
        New user? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;