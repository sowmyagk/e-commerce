import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-wrapper">

      
      <div className="admin-header">
        <h2>FirstCry Admin</h2>
      </div>

      
      <div className="admin-content">

        <div className="admin-card">
          <h3>Add Product</h3>
          <p>Create new product</p>
          <Link to="/addproduct" className="admin-btn">
            Add
          </Link>
        </div>

        <div className="admin-card">
          <h3>View Products</h3>
          <p>See all products</p>
          <Link to="/viewproduct" className="admin-btn">
            View
          </Link>
        </div>

        <div className="admin-card">
          <h3>Remove Products</h3>
          <p>See all Products</p>
          <Link to="/removeproduct" className="admin-btn">
          Remove
          </Link>
        </div>


      </div>

    </div>
  );
}

export default AdminDashboard;