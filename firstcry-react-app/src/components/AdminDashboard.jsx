import React from "react";
import "./AdminDashboard.css";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

function AdminDashboard() {

  const stats = {
    totalOrders: 32,
    totalRevenue: 12732,
    users: 10,
    payments: 32
  };

  const statusData = [
    { name: "Delivered", value: 16 },
    { name: "Pending", value: 8 },
    { name: "Shipped", value: 7 },
    { name: "Out for delivery", value: 1 },
  ];

  const monthlyOrders = [
    { month: "Apr", orders: 20 },
    { month: "May", orders: 10 },
  ];

  const salesData = [
    { month: "Jan", revenue: 2000 },
    { month: "Feb", revenue: 4000 },
    { month: "Mar", revenue: 6000 },
    { month: "Apr", revenue: 9000 },
    { month: "May", revenue: 12000 },
  ];

  return (
    <div className="admin-layout">

      {/* 🔥 SIDEBAR */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>Dashboard</li>
          <li>Orders</li>
          <li>Products</li>
          <li>Add Product</li>
          <li>Users</li>
        </ul>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="main-content">

        <h2>Welcome, Admin!</h2>
        <p className="subtitle">Here's a quick overview of your store.</p>

        {/* 🔹 CARDS */}
        <div className="card-container">
          <div className="card"><h4>Total Orders</h4><p>{stats.totalOrders}</p></div>
          <div className="card"><h4>Total Revenue</h4><p>₹{stats.totalRevenue}</p></div>
          <div className="card"><h4>Registered Users</h4><p>{stats.users}</p></div>
          <div className="card"><h4>Payments Received</h4><p>{stats.payments}</p></div>
        </div>

        {/* 🔹 CHARTS */}
        <div className="charts-row">

          <div className="chart-box">
            <h3>Orders by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} dataKey="value" outerRadius={100} label>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>Monthly Orders</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="charts-row">
          <div className="chart-box full">
            <h3>Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#2196F3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;