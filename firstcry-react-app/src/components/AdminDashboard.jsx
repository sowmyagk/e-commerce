import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
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

export default AdminDashboard;