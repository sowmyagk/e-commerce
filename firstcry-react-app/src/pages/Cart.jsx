import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ FIXED
    if (!user || !user.email) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/cart/${user.email}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCart(data);
        } else {
          console.log("Invalid cart data:", data);
          setCart([]);
        }
      })
      .catch(err => console.log("Cart fetch error:", err));
  }, [navigate]);

  const increaseQty = (id) => {
    const updated = cart.map(item =>
      item._id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart.map(item =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updated);
  };

  const removeItem = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/cart/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setCart(cart.filter(item => item._id !== id));
      })
      .catch(err => console.log("Delete error:", err));
  };

  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <div className="cart-container">
      <h2>My Cart</h2>

      {cart.length === 0 ? (
        <h3 className="empty">Cart is empty</h3>
      ) : (
        <>
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} />

              <div className="details">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>

                <div className="qty">
                  <button onClick={() => decreaseQty(item._id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item._id)}>+</button>
                </div>

                <button
                  className="remove"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h2 className="total">Total: ₹{totalPrice}</h2>

          <button
            className="checkout"
            onClick={() => navigate("/checkout")}
          >
            Place Order
          </button>
        </>
      )}

      <button className="orders" onClick={() => navigate("/orders")}>
        View Orders
      </button>
    </div>
  );
}

export default Cart;