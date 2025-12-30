import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../utils/auth";

function ProtectedRoute({ children, role }) {

  const token = getToken();
  const userRole = getRole();

  if (!token) return <Navigate to="/login" />;

  if (role && role !== userRole) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
