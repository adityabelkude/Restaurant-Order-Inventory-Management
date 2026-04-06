const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "restaurant-secret-key";
const ALLOWED_ROLES = ["waiter", "kitchen", "manager", "owner"];

const signToken = (user) =>
  jwt.sign(
    { userId: user._id.toString(), username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

exports.signup = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "username, password, role required" });
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const existing = await User.findOne({ username: username.trim() });
  if (existing) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const normalizedUsername = username.trim();
  const user = await User.create({
    email: `${normalizedUsername}@restaurant.local`,
    username: normalizedUsername,
    passwordHash,
    role
  });

  const token = signToken(user);
  res.json({
    token,
    user: { id: user._id, username: user.username, role: user.role }
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  const user = await User.findOne({ username: username.trim() });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user);
  res.json({
    token,
    user: { id: user._id, username: user.username, role: user.role }
  });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.userId).select("_id username role");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ user });
};
