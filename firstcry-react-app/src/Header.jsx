import { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // ✅ CHECK USER
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ HANDLE ACCOUNT CLICK
  const handleAccount = () => {
    if (user) {
      navigate("/orders"); // change if you want profile page
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(data => {
        // ✅ FIX: ensure array
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.log("API ERROR:", err);
        setProducts([]);
      });
  }, []);

  return (
    <>
      {/* 🔥 TOP BAR */}
      <div className="topbar">
        <span>Select location</span>
        <span>Stores & Preschools</span>
        <span>Support</span>
        <span>Track Order</span>

        {/* ✅ FIXED BUTTON */}
        <span className="login-link" onClick={handleAccount}>
          My Account
        </span>

        <span onClick={() => navigate("/cart")}>Cart</span>
        <span onClick={() => navigate("/wishlist")}>Wishlist</span>
      </div>

      {/* MENU */}
      <nav className="menu">
        <a>ALL CATEGORIES</a>
        <a>BOY FASHION</a>
        <a>GIRL FASHION</a>
        <a>FOOTWEAR</a>
        <a>TOYS</a>
        <a>DIAPERING</a>
        <a>GEAR</a>
        <a>FEEDING</a>
        <a>BATH</a>
        <a>NURSERY</a>
        <a>MOMS</a>
      </nav>

      {/* HEADER */}
      <header className="header">
        <div className="logo">firstcry</div>
        <div className="search">
          <input placeholder="Search for a Category, Brand or Product" />
        </div>
      </header>

      {/* BANNER */}
      <section className="banner-new">
        <img src="https://miniklub.in/cdn/shop/files/SS_26_Desktop-Banner.jpg?v=1768308772&width=1920" />
      </section>

      {/* PREMIUM */}
      <section className="premium">
        <h2>PREMIUM BOUTIQUES</h2>

        <div className="premium-box">
          {[
            "38721.webp","38672.webp","38480.webp",
            "38147.webp","38406.webp","38715.webp",
            "38736.webp","38734.webp","38737.webp"
          ].map((img, i) => (
            <div key={i} className="premium-card">
              <div className="premium-img">
                <img src={`https://cdn.fcglcdn.com/brainbees/images/boutique/670x670/${img}`} />
              </div>
              <p>Collection</p>
            </div>
          ))}
        </div>
      </section>

      {/* BANNER */}
      <section className="banner-new">
        <img src="https://cdn.fcglcdn.com/brainbees/banners/desktop_baby_growth_&_development1774849772013.webp" />
      </section>

      {/* SEASONAL */}
      <section className="seasonal">
        <h2>Seasonal STAPLES</h2>
        <p>Effortless styles endless options</p>

        <div className="seasonal-row">
          <img src="https://cdn.fcglcdn.com/brainbees/images/cattemplate/spring_desktop_page_270126_06.jpg" />
          <img src="https://cdn.fcglcdn.com/brainbees/images/cattemplate/spring_desktop_page_270126_07.jpg" />
          <img src="https://cdn.fcglcdn.com/brainbees/images/cattemplate/spring_desktop_page_270126_10.jpg" />
          <img src="https://cdn.fcglcdn.com/brainbees/images/cattemplate/spring_desktop_page_270126_09.jpg" />
          <img src="https://cdn.fcglcdn.com/brainbees/images/cattemplate/spring_desktop_page_270126_08.jpg" />
          <img src="https://cdn.fcglcdn.com/brainbees/images/cattemplate/moas25_nonapp_desktop_page_081225_17.jpg" />
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="admin-products">
        <h2 className="admin-title">Our Products</h2>

        <div className="admin-product-grid">
          {products.map((item) => (
            <div
              key={item._id}
              className="admin-product-card"
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <img src={item.image} />
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Header;