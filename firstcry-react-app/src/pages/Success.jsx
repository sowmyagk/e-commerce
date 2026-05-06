import { useEffect } from "react";

function Success() {

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");

    if (orderId) {
      fetch(`${import.meta.env.VITE_API_URL}/api/send-invoice/${orderId}`, {
        method: "POST"
      })
      .then(() => console.log("Invoice sent"))
      .catch(err => console.log(err));
    }

  }, []);

  return (
    <div>
      <h2>Payment Successful </h2>
    </div>
  );
}

export default Success;