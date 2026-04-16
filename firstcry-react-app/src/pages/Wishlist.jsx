import React, { useEffect, useState } from "react";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(data);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Wishlist </h2>

      {wishlist.length === 0 ? (
        <h3>No items in wishlist</h3>
      ) : (
        wishlist.map((item) => (
          <div key={item._id} style={{ marginBottom: "20px" }}>
            <img src={item.image} width="150" />
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
            <p>{item.brand}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;