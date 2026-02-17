// src/components/auth/Login.jsx
import { useState, useContext } from "react";
import { login } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email y contraseña son obligatorios.");
      return;
    }

    setBusy(true);
    try {
      // login() debe devolver { user: {...} } o al menos status 200
      const res = await login({ email, password });
      // Dependiendo del backend: si devuelve user:
      if (res.data?.user) {
        setUser(res.data.user);
      } else {
        // si el backend usa cookies httpOnly y /auth/me es la fuente de verdad:
        try {
          const meRes = await (await import("../../api/auth")).me();
          setUser(meRes.data.user);
        } catch (_) {
          // no crítico; seguimos
        }
      }
      // redirigir al chat
      nav("/chat");
    } catch (err) {
      console.error("Login error:", err);
      // Mensaje claro para el usuario
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Credenciales inválidas o error del servidor.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="items-center max-w-md mx-auto bg-black p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <label className="block mb-2">
        <span className="text-sm">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm">Contraseña</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </label>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={busy}
        >
          {busy ? "Ingresando..." : "Entrar"}
        </button>
        <a className="text-sm text-blue-600 hover:underline" href="/register">
          Registrarse
        </a>
      </div>
    </form>
  );
}
