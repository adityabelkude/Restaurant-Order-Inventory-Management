import { useEffect, useState } from "react";
import API from "../services/api";

const ManagerDashboard = () => {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [priceEdit, setPriceEdit] = useState({});
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "main"
  });

  const fetchMenu = async () => {
    const res = await API.get("/menu");
    setMenu(res.data);
  };

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchMenu();
    fetchOrders();
  }, []);

  const addItem = async () => {
    await API.post("/menu", form);
    setForm({ name: "", price: "", category: "main" });
    fetchMenu();
  };

  const deleteItem = async (id) => {
    await API.delete(`/menu/${id}`);
    fetchMenu();
  };

  const updatePrice = async (id) => {
    const nextPrice = Number(priceEdit[id]);
    if (!nextPrice) return;
    await API.put(`/menu/${id}`, { price: nextPrice });
    fetchMenu();
  };

  const totalRevenue = orders.reduce((sum, order) => {
    const orderTotal = order.items.reduce((acc, oi) => {
      const menuItem = menu.find((m) => m.name === oi.name);
      const price = menuItem ? Number(menuItem.price) : 0;
      return acc + oi.quantity * price;
    }, 0);
    return sum + orderTotal;
  }, 0);

  const readyOrders = orders.filter((o) => o.status === "ready").length;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        📊 Manager Panel
      </h1>

      {/* Sales analytics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold text-green-600">₹{totalRevenue}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Ready Orders</p>
          <p className="text-2xl font-bold">{readyOrders}</p>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-xl font-bold mb-3">
          Add Menu Item
        </h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="border p-2 mr-2"
        />

        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          className="border p-2 mr-2"
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          className="border p-2 mr-2"
        >
          <option value="appetizer">Appetizer</option>
          <option value="main">Main</option>
          <option value="dessert">Dessert</option>
        </select>

        <button
          onClick={addItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Menu List */}
      <div className="grid grid-cols-3 gap-4">
        {menu.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-xl hover:scale-105 transition"
          >
            <h3 className="font-bold">{item.name}</h3>
            <p>₹{item.price}</p>
            <p className="text-sm text-gray-500">
              {item.category}
            </p>

            <div className="mt-2 flex gap-2">
              <input
                type="number"
                placeholder="New price"
                value={priceEdit[item._id] ?? ""}
                onChange={(e) =>
                  setPriceEdit((prev) => ({ ...prev, [item._id]: e.target.value }))
                }
                className="border p-1 w-24"
              />
              <button
                onClick={() => updatePrice(item._id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Update Price
              </button>
            </div>

            <button
              onClick={() => deleteItem(item._id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ManagerDashboard;