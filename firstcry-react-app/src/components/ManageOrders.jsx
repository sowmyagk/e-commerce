import { useEffect, useState } from "react";
import "./ManageOrders.css";

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetch("https://e-commerce-3r11.onrender.com/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.log(err));
  };

  console.log(orders);

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(
        `https://e-commerce-3r11.onrender.com/api/orders/update-status/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        }
      );

      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getColor = (status) => {
    if (status === "Processing") return "orange";
    if (status === "Packed") return "#8e44ad";
    if (status === "Shipped") return "#3498db";
    if (status === "Delivered") return "green";
    if (status === "Cancelled") return "red";
    return "gray";
  };

  return (
    <div className="manage-page">

      <h2>All Orders ({orders.length})</h2>

      {orders.map(order => (
        <div className="order-card" key={order._id}>

          {/* <h3>{order.name}</h3>
          <p>{order.address}</p> */}

          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Payment:</strong> {order.paymentStatus}</p>

          
          <div className="product-section">
            {order.items?.map((item, i) => (
              <div className="product-row" key={i}>

                <img
                  src={item.image}
                  alt=""
                />

                <div>
                  <p>{item.productId?.name}</p>
                  <span>Qty: {item.quantity}</span>
                </div>

              </div>
            ))}
          </div>

       
          <select
            value={order.status || "Processing"}
            onChange={(e) =>
              updateStatus(order._id, e.target.value)
            }
            style={{
              backgroundColor: getColor(order.status)
            }}
          >
            <option value="Processing">Processing</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>
      ))}

    </div>
  );
}

export default ManageOrders;