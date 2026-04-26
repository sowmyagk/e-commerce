import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [productdescription, setProductDescription] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/products`)
        .then((res) => res.json())
        .then((data) => {
          const product = data.find((p) => p._id === id);

          if (product) {
            setName(product.name);
            setPrice(product.price);
            setBrand(product.brand);
            setProductDescription(product.productdescription);
            setExistingImage(product.image); // ✅ already correct
          }
        });
    }
  }, [id]);

  const handleAdd = async () => {
    if (id) {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/update-product/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            price,
            brand,
            productdescription,
          }),
        }
      );

      alert("Product Updated");
      navigate("/viewproduct");
    } else {
      if (!name || !price || !brand || !productdescription || !image) {
        alert("Fill all fields");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("brand", brand);
      formData.append("productdescription", productdescription);
      formData.append("image", image);

      await fetch(`${import.meta.env.VITE_API_URL}/api/products/add-product`, {
        method: "POST",
        body: formData,
      });

      alert("Product Added");

      setName("");
      setPrice("");
      setBrand("");
      setProductDescription("");
      setImage(null);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-box">
        <h2 className="add-product-title">
          {id ? "Update Product" : "Add Product"}
        </h2>

        <div className="add-product-form">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            value={productdescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />

          {/* ✅ SHOW EXISTING IMAGE (EDIT MODE ONLY) */}
          {id && existingImage && (
            <img
              src={`${import.meta.env.VITE_API_URL}/${existingImage}`}
              width="120"
              style={{ marginBottom: "10px" }}
              alt="product"
            />
          )}

          {!id && (
            <input
              type="file"
              className="file-input"
              onChange={(e) => setImage(e.target.files[0])}
            />
          )}

          <button className="add-product-btn" onClick={handleAdd}>
            {id ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;