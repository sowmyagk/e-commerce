import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleContinue = async () => {
    if (!email) {
      alert("Enter email");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.exists) {
        // 👉 EXISTING USER → OTP LOGIN
        navigate("/OtpPage", { state: { email } });
      } else {
        // 👉 NEW USER → REGISTER
        navigate("/register", { state: { email } });
      }

    } catch (err) {
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

      <button onClick={handleContinue}>
        CONTINUE
      </button>
    </div>
  );
}

export default Login;