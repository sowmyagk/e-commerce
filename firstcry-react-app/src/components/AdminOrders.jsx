import React, { useEffect, useState } from "react";
import "./AdminOrders.css";

function AdminOrders() {

  const [orders, setOrders] = useState([]);

  // ============================================
  // ✅ FETCH ALL ORDERS
  // ============================================
  const fetchOrders = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/orders"
      );

      const data = await res.json();

      setOrders(data);

    } catch (err) {

      console.error(
        "Fetch orders error:",
        err
      );
    }
  };

  // ============================================
  // ✅ LOAD ORDERS
  // ============================================
  useEffect(() => {
    fetchOrders();
  }, []);

  // ============================================
  // ✅ UPDATE ORDER STATUS
  // ============================================
  const updateStatus = async (
    id,
    status
  ) => {

    try {

      const res = await fetch(
        `http://localhost:5000/orders/update-status/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            status
          })
        }
      );

      const data = await res.json();

      if (data.success) {

        // ✅ UPDATE UI WITHOUT REFRESH
        setOrders((prevOrders) =>
          prevOrders.map((order) =>

            order._id === id
              ? {
                  ...order,
                  status
                }
              : order
          )
        );

      }

    } catch (err) {

      console.error(
        "Update status error:",
        err
      );
    }
  };

  return (
    <div className="admin-orders">

      <h2>All Orders</h2>

      {/* ============================================
          ✅ NO ORDERS
      ============================================ */}
      {orders.length === 0 ? (

        <p>No orders found</p>

      ) : (

        <div className="orders-container">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order._id}
            >

              {/* ============================================
                  ✅ ORDER HEADER
              ============================================ */}
              <div className="order-header">

                <div>

                  <h3>{order.email}</h3>

                  <p>
                    <strong>Date:</strong>{" "}

                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>

                </div>

                <h2>
                  ₹{order.totalAmount}
                </h2>

              </div>

              {/* ============================================
                  ✅ PRODUCTS
              ============================================ */}
              <div className="products-list">

                {order.items.map(
                  (item, index) => (

                    <div
                      className="product-item"
                      key={index}
                    >

                      {/* PRODUCT IMAGE */}
                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      {/* PRODUCT DETAILS */}
                      <div className="product-details">

                        <h4>
                          {item.name}
                        </h4>

                        <p>
                          Brand:{" "}
                          {item.brand}
                        </p>

                        <p>
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        <p>
                          Price: ₹
                          {item.price}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

              {/* ============================================
                  ✅ STATUS SECTION
              ============================================ */}
              <div className="status-section">

                <label>
                  Order Status:
                </label>

                <select
                  value={order.status}

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

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Out for delivery">
                    Out for delivery
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