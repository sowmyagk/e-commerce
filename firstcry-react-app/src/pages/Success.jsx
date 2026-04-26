import { useEffect } from "react";

function Success() {

  useEffect(() => {
    // ❌ REMOVE API CALL (VERY IMPORTANT)
  }, []);

  return (
    <div>
      <h2>Payment Successful </h2>
    </div>
  );
}

export default Success;