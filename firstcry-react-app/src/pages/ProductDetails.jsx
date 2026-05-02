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

      navigate("/cart");   // ✅ THIS LINE IS IMPORTANT
    })
    .catch(err => console.log("Error:", err));
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





//import React, { useEffect, useState } from "react";
//import { useParams } from "react-router-dom";

//function ProductDetails() {
 // const { id } = useParams();
 // const [product, setProduct] = useState(null);

 // useEffect(() => {
    //fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      //.then(res => res.json())
      //.then(data => {
        //const found = data.find(p => p._id.toString() === id);
       // setProduct(found);
    //  });
  //}, [id]);

  //const addToCart = () => {
   // let cart = JSON.parse(localStorage.getItem("cart")) || [];

    //const exists = cart.find(item => item._id === product._id);

   /// if (exists) {
      //cart = cart.map(item =>
       // item._id === product._id
         // ? { ...item, quantity: item.quantity + 1 }
          //: item
      //);
    //} else {
      //cart.push({ ...product, quantity: 1 });
    //}

  //  localStorage.setItem("cart", JSON.stringify(cart));
  //  alert("Product added to cart");
 // };

  //if (!product) return <h2>Loading...</h2>;

 // return (
    //<div style={{ padding: "20px" }}>
      //<img src={product.image} width="250" alt={product.name} />
      //<h2>{product.name}</h2>
     // <h3>₹{product.price}</h3>
      //<p>{product.brand}</p>
      //<p>{product.productdescription}</p>

    //  <button onClick={addToCart}>Add to Cart</button>
   // </div>
  //);
//}

//export default ProductDetails;
