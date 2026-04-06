const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);
// Socket setup
const io = new Server(server, {
  cors: { origin: "*" }
});

app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/shifts", require("./routes/shiftRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/restaurantDB")
  .then(async () => {
    console.log("MongoDB Connected");

    const demoUsers = [
      { username: "waiter1", password: "123456", role: "waiter" },
      { username: "kitchen1", password: "123456", role: "kitchen" },
      { username: "manager1", password: "123456", role: "manager" },
      { username: "owner1", password: "123456", role: "owner" }
    ];

    for (const demo of demoUsers) {
      const exists = await User.findOne({ username: demo.username });
      if (!exists) {
        const passwordHash = await bcrypt.hash(demo.password, 10);
        await User.create({
          email: `${demo.username}@restaurant.local`,
          username: demo.username,
          passwordHash,
          role: demo.role
        });
      }
    }
  })
  .catch(err => console.log(err));

// Start server
server.listen(5000, () => {
  console.log("Server running on port 5000");
});