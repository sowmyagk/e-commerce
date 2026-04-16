import { Routes, Route } from "react-router-dom";
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
  return (
    <Routes>
      <Route path="/" element={<Header />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<CreateAccount />} />
      <Route path="/adminLogin" element={<AdminLogin />} />
      <Route path="/OtpPage" element={<OtpPage />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/viewproduct" element={<ViewProduct />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/edit-product/:id" element={<AddProduct />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<h2>Payment Cancelled </h2>} />
    </Routes>
  );
}

export default App;