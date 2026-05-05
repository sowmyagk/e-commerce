import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51TJoSzRcOSTL52HSy6AzzMebz2hoVUyTzJ1ndvxNzNeC1jln9TThGF58lZiy10Se6pL7qp8QmZSrbs5GBvIx8mqZ00Cc7BZ1pW");

function Payment() {
  const location = useLocation();
  const { address } = location.state || {};

 const handlePayment = async () => {
  const stripe = await stripePromise;

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ 1. Get cart
  const cartRes = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${user.email}`);
  const cart = await cartRes.json();

  const totalAmount = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // ✅ 2. Create order FIRST
  const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
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

  const orderData = await orderRes.json();

  const orderId = orderData.order._id; // 👈 IMPORTANT

  // ✅ 3. Send orderId to backend (Stripe)
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ orderId }) // 👈 PASS ORDER ID
  });

  const data = await res.json();

  window.location.href = data.url;
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payment Options</h2>

      <div className="payment-box" onClick={handlePayment}>
        Credit / Debit Card
      </div>

      <div className="payment-box" onClick={handlePayment}>
        UPI
      </div>

      <div className="payment-box">
        Net Banking (Coming Soon)
      </div>

      <div className="payment-box">
        EMI (Coming Soon)
      </div>

      <div className="payment-box" onClick={() => alert("COD Selected")}>
        Cash on Delivery
      </div>
    </div>
  );
}

export default Payment;