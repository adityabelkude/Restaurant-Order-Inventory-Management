import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await API.get("/orders");
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  // Socket real-time updates
  useEffect(() => {
    socket.on("newOrder", (order) => {
      setOrders((prev) => [...prev, order]);
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === updatedOrder._id ? updatedOrder : o
        )
      );
    });

    socket.on("orderDeleted", ({ id }) => {
      setOrders((prev) => prev.filter((o) => o._id !== id));
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
      socket.off("orderDeleted");
    };
  }, []);

  // Update status
  const updateStatus = async (id, status) => {
    await API.put(`/orders/${id}`, { status });
  };

  const deleteOrder = async (id) => {
    await API.delete(`/orders/${id}`);
    setOrders((prev) => prev.filter((o) => o._id !== id));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      
      <h1 className="text-3xl font-bold mb-6">
        👨‍🍳 Kitchen Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-5">

        {orders.length === 0 && (
          <p className="text-gray-500">No orders yet</p>
        )}

        {orders.map((o) => (
          <div
            key={o._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-xl hover:scale-105 transition"
          >
            <h2 className="text-sm text-gray-500 mb-2">
              Order ID: {o._id}
            </h2>

            {/* Items */}
            <div className="mb-3">
              {o.items.map((item, i) => (
                <p key={i} className="text-lg">
                  🍽️ {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            {/* Status with color */}
            <p className="mt-2">
              Status:{" "}
              <span
                className={
                  o.status === "pending"
                    ? "text-red-500 font-bold"
                    : o.status === "preparing"
                    ? "text-yellow-500 font-bold"
                    : "text-green-500 font-bold"
                }
              >
                {o.status}
              </span>
            </p>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => updateStatus(o._id, "preparing")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Preparing
              </button>

              <button
                onClick={() => updateStatus(o._id, "ready")}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Ready
              </button>
              <button
                onClick={() => deleteOrder(o._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default KitchenDashboard;