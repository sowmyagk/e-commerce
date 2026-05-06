import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
function AdminDashboard() {

  const navigate = useNavigate();

  return (
  <>
   
    <div className="grid-container">
    < Sidebar />
    
  
    </div>
  
    </>
  );
}

export default Dash;