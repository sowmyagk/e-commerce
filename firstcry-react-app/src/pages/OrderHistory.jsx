import React, { useEffect, useState } from "react";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/orders/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.log("Unexpected response:", data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>

      {loading ? (
        <h3>Loading...</h3>
      ) : orders.length === 0 ? (
        <h3>No orders found</h3>
      ) : (
        orders.map(order => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px"
            }}
          >
            <h4>Order ID: {order._id}</h4>

            <p>
              Date:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A"}
            </p>

            <h4>Items:</h4>

            {Array.isArray(order.items) && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <img src={item.image} width="80" alt={item.name} />
                  <p>{item.name}</p>
                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
              ))
            ) : (
              <p>No items</p>
            )}

            <h3>Total: ₹{order.totalAmount}</h3>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;