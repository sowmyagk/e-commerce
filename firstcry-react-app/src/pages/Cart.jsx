import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  fetch(`${import.meta.env.VITE_API_URL}/api/cart/${user.value}`) // ✅ pass userId
    .then(res => res.json())
    .then(data => setCart(data));
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
    }).then(() => {
      setCart(cart.filter(item => item._id !== id));
    });
  };

  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);


  const placeOrder = () => {
  fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => {
      alert("Order placed successfully");
      setCart([]); 
    })
    .catch(err => console.log(err));
};

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
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item._id)}>+</button>
              </div>

              <button onClick={() => removeItem(item._id)}>
                Remove
              </button>
            </div>
          ))}

          <h2>Total: ₹{totalPrice}</h2>
          <button onClick={() => navigate("/checkout")}>
           Place Order
          </button>
        </>
      )}

      <button onClick={() => window.location.href="/orders"}>
  View Orders
</button>
      
    </div>
  );
}

export default Cart;

