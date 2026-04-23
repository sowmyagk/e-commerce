
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.value) {
      console.log("User not logged in");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/cart/${user.value}`)
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
  }, []);

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
    <div style={{ padding: "20px" }}>
      <h2>My Cart</h2>

      {cart.length === 0 ? (
        <h3>Cart is empty</h3>
      ) : (
        <>
          {cart.map(item => (
            <div key={item._id} style={{ marginBottom: "20px" }}>
              <img src={item.image} width="150" alt={item.name} />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              <div>
                <button onClick={() => decreaseQty(item._id)}>-</button>
                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                <button onClick={() => increaseQty(item._id)}>+</button>
              </div>

              <button onClick={() => removeItem(item._id)}>
                Remove
              </button>
            </div>
          ))}

          <h2>Total: ₹{totalPrice}</h2>

          {/* ✅ Navigate to checkout */}
          <button onClick={() => navigate("/checkout")}>
            Place Order
          </button>
        </>
      )}

      {/* ✅ View orders */}
      <button onClick={() => navigate("/orders")}>
        View Orders
      </button>
    </div>
  );
}

export default Cart;

