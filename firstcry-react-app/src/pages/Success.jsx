import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Success() {

  const location = useLocation();   // ✅ get orderId from navigation
  const orderId = location.state?.orderId;

  useEffect(() => {

    if (orderId) {
      fetch(`${import.meta.env.VITE_API_URL}/api/send-invoice/${orderId}`, {
        method: "POST"
      })
      .then(() => console.log("Invoice sent"))
      .catch(err => console.log(err));
    }

  }, [orderId]);

  return (
    <div>
      <h2>Payment Successful 🎉</h2>
    </div>
  );
}

export default Success;