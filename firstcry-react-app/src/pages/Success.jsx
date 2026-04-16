import { useEffect } from "react";

function Success() {

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: "POST"
    });
  }, []);

  return (
    <div>
      <h2>Payment Successful </h2>
    </div>
  );
}

export default Success;