import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

function AdminDashboard() {

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    delivered: 0,
    pending: 0,
    shipped: 0,
    outForDelivery: 0
  });

  useEffect(() => {

    fetch(`${API_URL}/orders/dashboard/stats`)
      .then((res) => res.json())
      .then((data) => {

        if (data.success) {
          setStats(data);
        }

      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
      });

  }, []);

  const statusData = [
    {
      name: "Delivered",
      value: stats.delivered
    },
    {
      name: "Pending",
      value: stats.pending
    },
    {
      name: "Shipped",
      value: stats.shipped
    },
    {
      name: "Out for delivery",
      value: stats.outForDelivery
    }
  ];

  const monthlyOrders = [
    { month: "Jan", orders: 5 },
    { month: "Feb", orders: 10 },
    { month: "Mar", orders: 15 },
    { month: "Apr", orders: 20 },
    { month: "May", orders: 25 },
  ];

  const salesData = [
    { month: "Jan", revenue: 2000 },
    { month: "Feb", revenue: 5000 },
    { month: "Mar", revenue: 7000 },
    { month: "Apr", revenue: 9000 },
    { month: "May", revenue: 12000 },
  ];

  return (
    <div className="admin-layout">

      <div className="sidebar">

        <h2>Admin Panel</h2>

        <ul>
          <li onClick={() => navigate("/admindashboard")}>
            Dashboard
          </li>

          <li onClick={() => navigate("/adminorders")}>
            Orders
          </li>

          <li onClick={() => navigate("/viewproduct")}>
            Products
          </li>

          <li onClick={() => navigate("/addproduct")}>
            Add Product
          </li>
        </ul>

      </div>

      <div className="main-content">

        <h2>Welcome, Admin</h2>

        <p className="subtitle">
          Here's your store analytics overview
        </p>

        <div className="card-container">

          <div className="card">
            <h4>Total Orders</h4>
            <p>{stats.totalOrders}</p>
          </div>

          <div className="card">
            <h4>Total Revenue</h4>
            <p>₹{stats.totalRevenue}</p>
          </div>

          <div className="card">
            <h4>Delivered Orders</h4>
            <p>{stats.delivered}</p>
          </div>

          <div className="card">
            <h4>Pending Orders</h4>
            <p>{stats.pending}</p>
          </div>

        </div>

        <div className="charts-row">

          <div className="chart-box">

            <h3>Orders by Status</h3>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={statusData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >

                  {statusData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
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

                <Bar
                  dataKey="orders"
                  fill="#4CAF50"
                />

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

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2196F3"
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;