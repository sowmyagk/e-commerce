import { useState } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    addressLine: ""
  });

  const [payment, setPayment] = useState("cod");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handleOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      // ✅ FIX: check _id
      if (!user || !user._id) {
        alert("Please login first");
        return;
      }

      // ✅ GET CART
      const cartRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/${user._id}`
      );
      const cart = await cartRes.json();

      if (!Array.isArray(cart) || cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      // ✅ CALCULATE TOTAL
      const totalPrice = cart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      // ✅ SAVE ADDRESS
      await fetch(`${import.meta.env.VITE_API_URL}/api/address/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(address)
      });

      // ✅ PLACE ORDER (MAIN FIX)
      await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user._id,
          items: cart,
          totalAmount: totalPrice
        })
      });

      alert("Order placed successfully!");
      navigate("/orders");

    } catch (err) {
      console.log(err);
      alert("Error placing order");
    }
  };

  const handleConfirmOrder = async () => {
    if (payment === "cod") {
      handleOrder();
    } else {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ address })
          }
        );

        const data = await res.json();

        if (!data.url) {
          alert("Stripe URL not received");
          return;
        }

        window.location.href = data.url;

      } catch (err) {
        console.log(err);
        alert("Payment failed");
      }
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>

      <div className="section">
        <h3>Delivery Address</h3>

        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />
        <input name="pincode" placeholder="Pincode" onChange={handleChange} />
        <textarea
          name="addressLine"
          placeholder="Full Address"
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="section">
        <h3>Payment Method</h3>

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
            checked={payment === "upi"}
            onChange={(e) => setPayment(e.target.value)}
          />
          UPI
        </label>

        <label>
          <input
            type="radio"
            value="card"
            checked={payment === "card"}
            onChange={(e) => setPayment(e.target.value)}
          />
          Card (Stripe)
        </label>
      </div>

      <button className="order-btn" onClick={handleConfirmOrder}>
        Confirm Order
      </button>
    </div>
  );
}

export default Checkout;