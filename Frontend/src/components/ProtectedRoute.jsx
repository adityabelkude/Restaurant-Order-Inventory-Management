import { Navigate } from "react-router-dom";
import { getUser } from "../services/auth";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
