import { useEffect, useState } from "react";
import axios from "axios";
import "./Charts.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

function Charts() {
  const [salesData, setSalesData] = useState([]);
  const [orders, setOrders] = useState(0);
  const [users, setUsers] = useState(0);
  const [payments, setPayments] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const salesRes = await axios.get("http://localhost:5000/api/admin/sales");
      const ordersRes = await axios.get("http://localhost:5000/api/admin/orders-count");
      const usersRes = await axios.get("http://localhost:5000/api/admin/users-count");
      const paymentsRes = await axios.get("http://localhost:5000/api/admin/payments");

      const formattedSales = salesRes.data.map((item) => ({
        month: `M${item._id}`, // Month number
        sales: item.totalSales,
        orders: item.orders,
      }));

      setSalesData(formattedSales);
      setOrders(ordersRes.data.count);
      setUsers(usersRes.data.count);
      setPayments(paymentsRes.data.total || 0);

    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  const COLORS = ["#0088FE", "#FF8042", "#00C49F"];

  return (
    <div className="charts-container">

      {/* SUMMARY */}
      <div className="summary-cards">
        <div className="summary-card">Orders: {orders}</div>
        <div className="summary-card">Users: {users}</div>
        <div className="summary-card">Payments: ₹{payments}</div>
      </div>

      {/* CHARTS */}
      <div className="charts-grid">

        {/* BAR CHART */}
        <div className="chart-box">
          <h3>Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="chart-box">
          <h3>Orders Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="chart-box">
          <h3>Users vs Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Users", value: users },
                  { name: "Orders", value: orders },
                ]}
                dataKey="value"
                outerRadius={100}
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Charts;