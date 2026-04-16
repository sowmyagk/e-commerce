import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p._id.toString() === id);
        setProduct(found);
      });
  }, [id]);

const addToCart = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: user.value,   
      name: product.name,
      price: Number(product.price),
      brand: product.brand,
      image: product.image,
      quantity: 1
    })
  })
    .then(res => res.json())
    .then(() => {
      alert("Product added to cart");
    });
};

  if (!product) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <img src={product.image} width="250" alt={product.name} />
      <h2>{product.name}</h2>
      <h3>₹{product.price}</h3>
      <p>Brand: {product.brand}</p>
      <p>{product.productdescription}</p>

      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductDetails;