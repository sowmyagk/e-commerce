import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51TJoSzRcOSTL52HSy6AzzMebz2hoVUyTzJ1ndvxNzNeC1jln9TThGF58lZiy10Se6pL7qp8QmZSrbs5GBvIx8mqZ00Cc7BZ1pW");

function Payment() {
  const location = useLocation();
  const { address } = location.state || {};

  const handlePayment = async () => {
    const stripe = await stripePromise;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ address })
    });

    const data = await res.json();

    await stripe.redirectToCheckout({
      sessionId: data.id
    });
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