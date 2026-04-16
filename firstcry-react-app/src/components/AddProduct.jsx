import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [productdescription, setProductDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id) {
      fetch("http://localhost:3001/api/products")
        .then(res => res.json())
        .then(data => {
          const product = data.find(p => p._id === id);

          if (product) {
            setName(product.name);
            setPrice(product.price);
            setBrand(product.brand);
            setProductDescription(product.productdescription);
          }
        });
    }
  }, [id]);

  const handleAdd = async () => {

    if (id) {
      await fetch(`http://localhost:3001/api/products/update-product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
          brand,
          productdescription
        })
      });

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

      await fetch("http://localhost:3001/api/products/add-product", {
        method: "POST",
        body: formData
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
    <div>
      <h2>{id ? "Update Product" : "Add Product"}</h2>

      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br /><br />
      <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} /><br /><br />
      <input placeholder="Brand" value={brand} onChange={e => setBrand(e.target.value)} /><br /><br />
      <input placeholder="Description" value={productdescription} onChange={e => setProductDescription(e.target.value)} /><br /><br />

      {!id && (
        <>
          <input type="file" onChange={e => setImage(e.target.files[0])} /><br /><br />
        </>
      )}

      <button onClick={handleAdd}>
        {id ? "Update" : "Add"}
      </button>
    </div>
  );
}

export default AddProduct;