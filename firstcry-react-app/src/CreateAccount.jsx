import { useState, useLocation, useNavigate } from "react-router-dom";
import "./CreateAccount.css";

function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [phone, setPhone] = useState("");

  const handleOtp = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/otp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (data.success) {
      navigate("/otp", {
        state: { email, name, phone }
      });
    } else {
      alert("OTP failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email Id"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Mobile Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handleOtp}>GET OTP</button>
    </div>
  );
}

export default CreateAccount;