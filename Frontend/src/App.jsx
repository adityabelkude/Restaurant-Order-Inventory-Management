import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import WaiterDashboard from "./pages/WaiterDashboard";
import KitchenDashboard from "./pages/KitchenDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AuthPage from "./pages/AuthPage";
import { getUser } from "./services/auth";

function App() {
  const user = getUser();

  return (
    <BrowserRouter>
      <div className="flex">
        {user && <Sidebar />}

        <div className="flex-1 bg-gray-100 min-h-screen">
          <Routes>
            <Route
              path="/"
              element={
                user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/auth" />
              }
            />
            <Route path="/auth" element={<AuthPage />} />

            <Route
              path="/waiter"
              element={
                <ProtectedRoute allowedRoles={["waiter"]}>
                  <WaiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kitchen"
              element={
                <ProtectedRoute allowedRoles={["kitchen"]}>
                  <KitchenDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;