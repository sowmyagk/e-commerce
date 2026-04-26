import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import OtpPage from "./OtpPage";
import CreateAccount from "./CreateAccount";
import Header from "./Header";

import AdminLogin from "./AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AddProduct from "./components/AddProduct";
import ViewProduct from "./components/ViewProduct";

import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import OrderHistory from "./pages/OrderHistory";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Success from "./pages/Success";

function App() {

  // ✅ CHECK USER LOGIN
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>

      {/* ✅ HOME */}
      <Route path="/" element={<Header />} />

      {/* ✅ LOGIN / REGISTER PROTECTION */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Login />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <CreateAccount />}
      />

      {/* ✅ OTP */}
      <Route path="/OtpPage" element={<OtpPage />} />

      {/* ✅ ADMIN */}
      <Route path="/adminLogin" element={<AdminLogin />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/viewproduct" element={<ViewProduct />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/edit-product/:id" element={<AddProduct />} />

      {/* ✅ USER PAGES (OPTIONAL PROTECTION) */}
      <Route
        path="/cart"
        element={user ? <Cart /> : <Navigate to="/login" />}
      />

      <Route
        path="/wishlist"
        element={user ? <Wishlist /> : <Navigate to="/login" />}
      />

      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/orders"
        element={user ? <OrderHistory /> : <Navigate to="/login" />}
      />

      <Route
        path="/checkout"
        element={user ? <Checkout /> : <Navigate to="/login" />}
      />

      <Route
        path="/payment"
        element={user ? <Payment /> : <Navigate to="/login" />}
      />

      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<h2>Payment Cancelled</h2>} />

    </Routes>
  );
}

export default App;