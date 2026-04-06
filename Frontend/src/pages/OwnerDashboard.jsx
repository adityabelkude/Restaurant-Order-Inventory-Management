import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

const OwnerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const refresh = () => fetchData();

    socket.on("newOrder", refresh);
    socket.on("orderUpdated", refresh);
    socket.on("inventoryUpdated", refresh);

    return () => {
      socket.off("newOrder", refresh);
      socket.off("orderUpdated", refresh);
      socket.off("inventoryUpdated", refresh);
    };
  }, []);

  const fetchData = async () => {
    const orderRes = await API.get("/orders");
    const invRes = await API.get("/inventory");
    const menuRes = await API.get("/menu");

    setOrders(orderRes.data);
    setInventory(invRes.data);
    setMenu(menuRes.data);
  };

  // Revenue uses real menu prices x quantities
  const priceMap = menu.reduce((acc, item) => {
    acc[item.name.trim().toLowerCase()] = Number(item.price) || 0;
    return acc;
  }, {});

  const totalRevenue = orders.reduce((sum, o) => {
    const orderTotal = (o.items || []).reduce((lineSum, line) => {
      const key = (line.name || "").trim().toLowerCase();
      const price = priceMap[key] || 0;
      return lineSum + price * (line.quantity || 0);
    }, 0);
    return sum + orderTotal;
  }, 0);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        💰 Owner Dashboard
      </h1>

      {/* Owner insights */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-xl font-bold mb-3">Owner Insights</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>
            Owner: Financial reports, employee performance, profit margins
          </li>
          <li>
            Inventory Tracking: Ingredients auto-deduct with each order, low-stock alerts
          </li>
        </ul>
      </div>

      {/* Revenue + order summary (manager-style cards) */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-bold">Total Revenue</h2>
          <p className="text-2xl text-green-600">₹{totalRevenue}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-bold">Total Orders</h2>
          <p className="text-2xl">{orders.length}</p>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">
          📦 Inventory Status
        </h2>

        {inventory.map((item) => (
          <div key={item._id}>
            {item.name} - {item.stock}
            {item.stock < item.lowStockThreshold && (
              <span className="text-red-500 ml-2">
                ⚠ Low Stock
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default OwnerDashboard;