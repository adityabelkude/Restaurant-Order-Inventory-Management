import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../services/auth";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    clearAuth();
    navigate("/auth");
  };

  const linksByRole = {
    waiter: [{ to: "/waiter", label: "Waiter" }],
    kitchen: [{ to: "/kitchen", label: "Kitchen" }],
    manager: [{ to: "/manager", label: "Manager" }],
    owner: [{ to: "/owner", label: "Owner" }]
  };

  const links = user ? linksByRole[user.role] || [] : [];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <h1 className="text-2xl font-bold mb-8 text-red-500">
        🍽 FoodFlow
      </h1>

      <div className="flex flex-col gap-4">
        {links.map((link) => (
          <Link key={link.to} className="hover:text-red-400" to={link.to}>
            {link.label}
          </Link>
        ))}
        <button
          onClick={logout}
          className="text-left hover:text-red-400 mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;