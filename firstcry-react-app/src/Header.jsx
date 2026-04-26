import { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

 



 useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/products`)
    .then(res => {
      if (!res.ok) {
        throw new Error("API failed");
      }
      return res.json();
    })
    .then(data => setProducts(data))
    .catch(err => {
      console.log("API ERROR:", err);
      setProducts([]); // prevent crash
    });
}, []);

  return (
    <>

      <div className="topbar">
        <span>Select location</span>
        <span>Stores & Preschools</span>
        <span>Support</span>
        <span>Track Order</span>
        <Link to="/login" className="login-link">My Account</Link>
        <span onClick={() => navigate("/cart")}>Cart</span>
        <span onClick={() => navigate("/wishlist")}>Wishlist</span>
      </div>

  
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

      <header className="header">
        <div className="logo">firstcry</div>
        <div className="search">
          <input placeholder="Search for a Category, Brand or Product" />
        </div>
      </header>

      
      <section className="banner-new">
        <img src="https://miniklub.in/cdn/shop/files/SS_26_Desktop-Banner.jpg?v=1768308772&width=1920" />
      </section>

      
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

      <section className="banner-new">
        <img src="https://cdn.fcglcdn.com/brainbees/banners/desktop_baby_growth_&_development1774849772013.webp" />
      </section>

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
          <img src="https://cdn.fcglcdn.com/brainbees/images/products/219x265/11794449a.webp" />
          <img src="https://cdn.fcglcdn.com/brainbees/images/products/219x265/8967449a.webp" />
          <img src="https://cdn.fcglcdn.com/brainbees/images/products/219x265/3437929a.webp" />
          <img src="https://cdn.fcglcdn.com/brainbees/images/products/219x265/15547772a.webp" />
          <img src="https://cdn.fcglcdn.com/brainbees/images/products/219x265/15576588a.webp" />
          <img src="https://cdn.fcglcdn.com/brainbees/images/products/219x265/20367936a.webp" />

        </div>

      </section>

      <section className="banner-new">
        <img src="https://cdn.fcglcdn.com/brainbees/banners/hp_mktg_p04_sec2_flat60_desktop1774959024725.webp" />
      </section>

     
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