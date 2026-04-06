import { useEffect, useState } from "react";
import API from "../services/api";

const WaiterDashboard = () => {
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState([]);
  const [placedOrders, setPlacedOrders] = useState([]);
  const [waiterName, setWaiterName] = useState("Waiter 1");
  const [activeShift, setActiveShift] = useState(null);
  const [recentShifts, setRecentShifts] = useState([]);

  useEffect(() => {
    fetchMenu();
    fetchOrders();
    fetchShifts();
  }, []);

  const fetchMenu = async () => {
    const res = await API.get("/menu");
    setMenu(res.data);
  };

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setPlacedOrders(res.data);
  };

  const fetchShifts = async () => {
    const res = await API.get("/shifts");
    setRecentShifts(res.data);
    const openShift = res.data.find(
      (shift) => shift.waiterName === waiterName && !shift.clockOutAt
    );
    setActiveShift(openShift || null);
  };

  const addItem = (item) => {
    setOrder((prev) => {
      const existing = prev.find((i) => i.name === item.name);

      if (existing) {
        return prev.map((i) =>
          i.name === item.name
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [...prev, { name: item.name, quantity: 1 }];
      }
    });
  };

  const getOrderTotal = (items) =>
    items.reduce((sum, oi) => {
      const menuItem = menu.find((m) => m.name === oi.name);
      const price = menuItem ? Number(menuItem.price) : 0;
      return sum + price * oi.quantity;
    }, 0);

  const printBill = (items, title = "Restaurant Bill") => {
    const rows = items
      .map((i) => {
        const menuItem = menu.find((m) => m.name === i.name);
        const price = menuItem ? Number(menuItem.price) : 0;
        return `<tr><td>${i.name}</td><td>${i.quantity}</td><td>₹${price}</td><td>₹${
          price * i.quantity
        }</td></tr>`;
      })
      .join("");

    const total = getOrderTotal(items);
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head><title>${title}</title></head>
        <body style="font-family: Arial; padding: 20px;">
          <h2>${title}</h2>
          <table border="1" cellpadding="8" cellspacing="0" width="100%">
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Line Total</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <h3 style="margin-top:16px;">Total: ₹${total}</h3>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const placeOrder = async () => {
    if (order.length === 0) {
      alert("No items selected");
      return;
    }

    const res = await API.post("/orders", { items: order });

    alert("Order Placed!");
    setPlacedOrders((prev) => [res.data, ...prev]);
    setOrder([]);
  };

  const updateItemQty = (name, delta) => {
    setOrder((prev) =>
      prev
        .map((i) =>
          i.name === name ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const modifyPendingOrder = async (orderId, items) => {
    const updatedItems = items
      .map((i) => ({ ...i, quantity: i.quantity + 1 }))
      .filter((i) => i.quantity > 0);
    await API.put(`/orders/${orderId}/items`, { items: updatedItems });
    fetchOrders();
  };

  const cancelPendingOrder = async (orderId) => {
    await API.delete(`/orders/${orderId}`);
    fetchOrders();
  };

  const clockIn = async () => {
    const res = await API.post("/shifts/clock-in", { waiterName });
    setActiveShift(res.data);
    fetchShifts();
  };

  const clockOut = async () => {
    if (!activeShift) return;
    await API.put(`/shifts/${activeShift._id}/clock-out`);
    setActiveShift(null);
    fetchShifts();
  };

  const pendingOrders = placedOrders.filter((o) => o.status === "pending");

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        🧾 Take Order
      </h1>

      {/* Menu */}
      {["appetizer", "main", "dessert"].map((cat) => (
        <div key={cat} className="mb-6">
          <h2 className="text-xl font-bold capitalize mb-3">
            {cat}
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {menu
              .filter((item) => item.category === cat)
              .map((item) => (
                <div
                  key={item._id}
                  onClick={() => addItem(item)}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-xl hover:scale-105 transition cursor-pointer"
                >
                  <h3 className="font-semibold text-lg">
                    {item.name}
                  </h3>
                  <p className="text-gray-600">
                    ₹{item.price}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Order */}
      <div className="mt-6 bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">
          🛒 Current Order
        </h2>

        {order.length === 0 && (
          <p className="text-gray-500">No items added</p>
        )}

        {order.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <p>
              {item.name} × {item.quantity}
            </p>
            <button
              onClick={() => updateItemQty(item.name, -1)}
              className="px-2 py-0.5 bg-gray-200 rounded"
            >
              -
            </button>
            <button
              onClick={() => updateItemQty(item.name, 1)}
              className="px-2 py-0.5 bg-gray-200 rounded"
            >
              +
            </button>
          </div>
        ))}

        <p className="mt-3 font-semibold">
          Total: ₹{getOrderTotal(order)}
        </p>

        <button
          onClick={placeOrder}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Place Order
        </button>

        <button
          onClick={() => printBill(order, "Current Order Bill")}
          className="mt-4 ml-3 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Print Bill
        </button>
      </div>

      {/* Modify before kitchen accepts */}
      <div className="mt-6 bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">Pending Orders (Editable)</h2>
        {pendingOrders.length === 0 && <p className="text-gray-500">No pending orders</p>}
        {pendingOrders.map((po) => (
          <div key={po._id} className="border rounded p-3 mb-3">
            <p className="text-sm text-gray-500">Order: {po._id}</p>
            {po.items.map((it, idx) => (
              <p key={idx}>{it.name} x {it.quantity}</p>
            ))}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => modifyPendingOrder(po._id, po.items)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Add +1 to all items
              </button>
              <button
                onClick={() => cancelPendingOrder(po._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Cancel Order
              </button>
              <button
                onClick={() => printBill(po.items, "Pending Order Bill")}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Print Bill
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shift management */}
      <div className="mt-6 bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">Shift Management</h2>
        <div className="flex items-center gap-2 mb-3">
          <input
            value={waiterName}
            onChange={(e) => setWaiterName(e.target.value)}
            className="border p-2 rounded"
            placeholder="Waiter name"
          />
          {!activeShift ? (
            <button onClick={clockIn} className="bg-green-600 text-white px-4 py-2 rounded">
              Clock In
            </button>
          ) : (
            <button onClick={clockOut} className="bg-gray-800 text-white px-4 py-2 rounded">
              Clock Out
            </button>
          )}
        </div>
        {activeShift && (
          <p className="text-sm text-green-700 mb-3">
            Active shift started at {new Date(activeShift.clockInAt).toLocaleString()}
          </p>
        )}
        <h3 className="font-semibold mb-2">Recent Shift Reports</h3>
        {recentShifts.map((s) => (
          <p key={s._id} className="text-sm">
            {s.waiterName}: {new Date(s.clockInAt).toLocaleString()} -{" "}
            {s.clockOutAt ? new Date(s.clockOutAt).toLocaleString() : "Active"} (
            {s.durationMinutes || 0} mins)
          </p>
        ))}
      </div>
    </div>
  );
};

export default WaiterDashboard;