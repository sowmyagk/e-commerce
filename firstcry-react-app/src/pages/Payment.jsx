import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./Payment.css";

// ✅ Icons
import {
  FaCreditCard,
  FaUniversity,
  FaMoneyBillWave,
  FaLock,
  FaUndo,
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";
import { SiGooglepay } from "react-icons/si";

const stripePromise = loadStripe("pk_test_51TJoSzRcOSTL52HSy6AzzMebz2hoVUyTzJ1ndvxNzNeC1jln9TThGF58lZiy10Se6pL7qp8QmZSrbs5GBvIx8mqZ00Cc7BZ1pW");

function Payment() {
  const location = useLocation();

  // ✅ SAFE ADDRESS HANDLING
  const address = location?.state?.address || {};

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;

      // ✅ SAFE USER CHECK
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.email) {
        alert("User not logged in");
        return;
      }

      // ✅ FETCH CART
      const cartRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/${user.email}`
      );

      if (!cartRes.ok) {
        alert("Failed to fetch cart");
        return;
      }

      const cart = await cartRes.json();

      if (!cart || cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      // ✅ CALCULATE TOTAL
      const totalAmount = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      // ✅ CREATE ORDER
      const orderRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: user.email,
            items: cart,
            totalAmount
          })
        }
      );

      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert("Order creation failed");
        return;
      }

      const orderId = orderData.order._id;

      // ✅ CREATE STRIPE SESSION
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ orderId, totalAmount })
        }
      );

      const data = await res.json();

      if (!data.url) {
        alert("Payment failed");
        console.log("Stripe error:", data);
        return;
      }

      // ✅ REDIRECT TO STRIPE
      window.location.href = data.url;

    } catch (err) {
      console.log("❌ Payment error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="payment-page">

      {/* Header */}
      <div className="payment-header">
        ← Payment Method
      </div>

      {/* Address */}
      <div className="address-card">
        <div>
          <p className="deliver-to">Deliver to {address.name || "User"}, {address.pincode || "000000"}</p>
          <p className="address-text">
            {address.address || "No address provided"}
          </p>
        </div>
        <button className="change-btn">CHANGE</button>
      </div>

      {/* Offer */}
      <div className="offer-card">
        <p className="offer-title">Flat ₹1500 Off</p>
        <p className="offer-desc">On Credit Cards | Above ₹15000</p>
      </div>

      <h2 className="payment-title">Payment Options</h2>

      {/* Payment Options */}
      <div className="payment-box" onClick={handlePayment}>
        <span><FaCreditCard className="icon" /> Credit / Debit Card</span>
      </div>

      <div className="payment-box" onClick={handlePayment}>
        <span><SiGooglepay className="icon" /> UPI</span>
      </div>

      <div className="payment-box">
        <span><FaUniversity className="icon" /> Net Banking</span>
      </div>

      <div className="payment-box">
        <span><FaCreditCard className="icon" /> EMI</span>
      </div>

      <div
        className="payment-box"
        onClick={() => alert("Cash on Delivery Selected")}
      >
        <span><FaMoneyBillWave className="icon" /> Cash on Delivery</span>
      </div>

      {/* Footer */}
      <div className="payment-footer">
        <div>
          <FaLock className="footer-icon" />
          <p>Secure Payments</p>
        </div>
        <div>
          <FaUndo className="footer-icon" />
          <p>Easy Returns</p>
        </div>
        <div>
          <FaShieldAlt className="footer-icon" />
          <p>Encrypted</p>
        </div>
        <div>
          <FaCheckCircle className="footer-icon" />
          <p>PCI Certified</p>
        </div>
      </div>

    </div>
  );
}

export default Payment;