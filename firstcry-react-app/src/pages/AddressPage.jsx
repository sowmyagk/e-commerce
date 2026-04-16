import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddressPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    house: "",
    area: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/address/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log(data);

    
    navigate("/payment");
  };

  return (
    <div>
      <h2>Enter Address</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="pincode" placeholder="Pincode" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="state" placeholder="State" onChange={handleChange} />
      <input name="house" placeholder="House No" onChange={handleChange} />
      <input name="area" placeholder="Area" onChange={handleChange} />

      <button onClick={saveAddress}>Save & Continue</button>
    </div>
  );
}

export default AddressPage;