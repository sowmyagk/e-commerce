import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewProduct.css";

function ViewProduct() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    await fetch(`${import.meta.env.VITE_API_URL}/api/products/remove-product/${id}`, {
      method: "DELETE"
    });

    fetchProducts();
  };

  return (
    <div className="container">
      <h2 className="title">Products</h2>

      {products.map((item) => {
        
        // ✅ ADD THIS LINE HERE
        console.log(item.image);

        return (
          <div key={item._id} className="product-row">

            <img
              src={item.image}
              alt="product"
              className="product-img"
            />


            {/* NAME */}
            <span className="product-name">
              {item.name}
            </span>

            {/* PRICE */}
            <span className="product-price">
              ₹{item.price}
            </span>

            {/* ACTIONS */}
            <div className="actions">
              <button
                className="edit-btn"
                onClick={() => navigate(`/edit-product/${item._id}`)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default ViewProduct;