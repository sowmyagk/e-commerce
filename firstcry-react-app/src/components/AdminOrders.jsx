import React, { useEffect, useState } from "react";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);


  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);

      const data = await res.json();

      
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data.orders) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${API_URL}/orders/update-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id
              ? { ...order, status }
              : order
          )
        );
      }
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  return (
    <div className="admin-orders">
      <h2>All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div
              className="order-card"
              key={order._id}
            >
    
              <div className="order-header">
                <div>
                  <h3>{order.email}</h3>

                  <p>
                    <strong>Order ID:</strong>{" "}
                    {order._id}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <h2>
                  ₹{order.totalAmount}
                </h2>
              </div>

              <div className="products-list">
                {order.items &&
                  order.items.map((item, index) => (
                    <div
                      className="product-item"
                      key={index}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="product-details">
                        <h4>{item.name}</h4>

                        <p>
                          Brand: {item.brand}
                        </p>

                        <p>
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        <p>
                          Price: ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

          
              <div className="status-section">
                <label>
                  Order Status:
                </label>

                <select
                  value={order.status || "Pending"}
                  onChange={(e) =>
                    updateStatus(
                      order._id,
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Out for delivery">
                    Out for delivery
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;