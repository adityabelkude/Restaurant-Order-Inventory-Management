import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { setAuth } from "../services/auth";

const roles = ["waiter", "kitchen", "manager", "owner"];

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "waiter"
  });
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      const payload =
        mode === "login"
          ? { username: form.username, password: form.password }
          : form;

      const res = await API.post(endpoint, payload);
      setAuth(res.data);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-[380px]">
        <h1 className="text-2xl font-bold mb-4">
          {mode === "login" ? "Login" : "Signup"}
        </h1>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          className="border p-2 w-full mb-3 rounded"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {mode === "signup" && (
          <select
            className="border p-2 w-full mb-3 rounded"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        )}

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <button
          onClick={submit}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {mode === "login" ? "Login" : "Signup"}
        </button>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="text-sm text-blue-600 mt-3"
        >
          {mode === "login"
            ? "No account? Signup"
            : "Already have account? Login"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
