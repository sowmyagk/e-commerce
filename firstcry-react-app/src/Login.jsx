import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!input) return alert("Enter email or mobile");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/check-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input })
    });

    const data = await res.json();

    if (data.exists) {
      navigate("/otp", { state: { email: input } });
    } else {
      navigate("/register", { state: { email: input } });
    }
  };

  return (
    <div className="login-container">
      <h2>Log In / Register</h2>

      <input
        placeholder="Enter your Email-Id or Mobile No."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleContinue}>CONTINUE</button>

      <p>
        New user?{" "}
        <span onClick={() => navigate("/register")}>
          Register Here
        </span>
      </p>
    </div>
  );
}

export default Login;