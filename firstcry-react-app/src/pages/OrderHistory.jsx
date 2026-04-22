import React, { useEffect, useState } from "react";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  //useEffect(() => {
  //  fetch(`${import.meta.env.VITE_API_URL}/api/orders`)
     // .then(res => res.json())
    //  .then(data => setOrders(data))
   //   .catch(err => console.log(err));
  //}, []);

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/orders`)
    .then(res => res.json())
    .then(data => {
      console.log("ORDERS:", data); // ✅ DEBUG

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.log("Not an array:", data);
        setOrders([]); // ✅ prevent crash
      }
    })
    .catch(err => console.log(err));
}, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
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
            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

            <h4>Items:</h4>
            {order.items.map((item, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <img src={item.image} width="80" alt={item.name} />
                <p>{item.name}</p>
                <p>₹{item.price} × {item.quantity}</p>
              </div>
            ))}

            <h3>Total: ₹{order.totalAmount}</h3>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;