import { useNavigate } from "react-router-dom";
import "./sidebar.css";
function Sidebar() {
    const navigate=useNavigate();
  return (
    <>
      <aside id="sidebar">
        <div className="sidebar-title">
          <div className="sidebar-brand">
          <i className="fa-solid fa-film"> Admin </i>
        </div>
        </div>
        <ul className="sidebar-list">
            <li className="sidebar-list-item" onClick={()=>navigate ("/addproduct")}><span><i className="fa-solid fa-plus"></i></span>  Add Movies</li>
            <li className="sidebar-list-item" onClick={()=>navigate("/viewproduct")}><span><i className="fa-solid fa-eye"></i></span> View Added Movies</li>
            <li className="sidebar-list-item" onClick={()=>navigate("/removeproduct")}><span><i className="fa-solid fa-user"></i></span> View Subscription</li>
            <br></br>
            <br></br>
            <li className="sidebar-list-item" onClick={()=>navigate("/")}><span><i className="fa fa-sign-out"></i>Log out</span></li>
        </ul>
      </aside>
    </>
  );
}

export default Sidebar;