import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);


  const navigate = useNavigate();


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p._id.toString() === id);
        setProduct(found);
      });
  }, [id]);

const addToCart = () => {
  console.log("Button clicked");

  const user = JSON.parse(localStorage.getItem("user"));
  console.log("User:", user);

  if (!user || !user.email) {
    alert("Please login first");
    return;
  }

  fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: user.email,
      name: product.name,
      price: Number(product.price),
      brand: product.brand,
      image: product.image,
      quantity: 1
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Added:", data);
      alert("Product added to cart");

      navigate("/cart");   
    })
    .catch(err => console.log("Error:", err));
};
  if (!product) return <h2>Loading...</h2>;

  return (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    backgroundColor: "#f5f5f5"
  }}>
    
    <div style={{
      display: "flex",
      gap: "40px",
      background: "#fff",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      maxWidth: "800px",
      width: "100%"
    }}>

      {/* LEFT SIDE - IMAGE */}
      <div>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: "250px", borderRadius: "10px" }} 
        />
      </div>

      {/* RIGHT SIDE - DETAILS */}
      <div>
        <h2>{product.name}</h2>
        <h3 style={{ color: "green" }}>₹{product.price}</h3>
        <p><b>Brand:</b> {product.brand}</p>
        <p>{product.productdescription}</p>

        <button 
          onClick={addToCart}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Add to Cart
        </button>
      </div>

    </div>
  </div>
);
}

export default ProductDetails;




