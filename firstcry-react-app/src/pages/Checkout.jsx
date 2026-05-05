import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    pincode: "",
    address: ""
  });

  const [payment, setPayment] = useState("cod");

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.email) {
    alert("Please login first");
    navigate("/login");
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleOrder = async () => {
    try {

      // ✅ FIXED (NEW CODE) → FETCH CART
      const cartRes = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${user.email}`);
      const cart = await cartRes.json();

      // ✅ FIXED (NEW CODE) → CALCULATE TOTAL
      const totalAmount = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      // ✅ FIXED (UPDATED BODY)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          items: cart,
          totalAmount
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Order placed successfully");
        navigate("/orders");
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.log(err);
      alert("Order failed");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="pincode" placeholder="Pincode" onChange={handleChange} />
      <textarea name="address" placeholder="Address" onChange={handleChange} />

      <div className="payment">
        <label>
          <input
            type="radio"
            value="cod"
            checked={payment === "cod"}
            onChange={(e) => setPayment(e.target.value)}
          />
          Cash on Delivery
        </label>

        <label>
          <input
            type="radio"
            value="upi"
            onChange={(e) => setPayment(e.target.value)}
          />
          UPI
        </label>
      
       <label>
          <input
            type="radio"
            value="card"
            onChange={(e) => setPayment(e.target.value)}
          />
          Card
        </label>
      </div>

      <button onClick={handleOrder}>
        Confirm Order
      </button>
    </div>
  );
}

export default Checkout;