import "./AdminDashboard.css";
import Charts from "./Charts";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">Admin Panel</h2>

        <ul>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/viewproduct">Products</Link></li>
          <li><Link to="/addproduct">Add Product</Link></li>
          <li><Link to="/users">Users</Link></li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="main">

        {/* TOP BAR */}
        <div className="topbar">
          <h2>Welcome, Admin!</h2>
          <button className="logout-btn">Logout</button>
        </div>

        {/* QUICK CARDS */}
        <div className="quick-cards">
          <div className="quick-card">Orders</div>
          <div className="quick-card">Products</div>
          <div className="quick-card">Add Product</div>
          <div className="quick-card">Users</div>
        </div>

        {/* ANALYTICS */}
        <Charts />

      </div>
    </div>
  );
}

export default AdminDashboard;