// src/components/auth/Register.jsx
import { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const validatePassword = (pwd) => {
    // simple check; puedes endurecer: min 8, mayúsculas, números, símbolos
    return pwd.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setBusy(true);
    try {
      const res = await register({ name, email, password });
      // Si backend devuelve user o token, manejarlo; lo usual: redirect a login o iniciar sesión directo
      // Aquí asumimos que el backend creó el usuario y devolvió 201
      nav("/login");
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Error creando usuario.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-black p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Crear cuenta</h2>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <label className="block mb-2">
        <span className="text-sm">Nombre</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" required />
      </label>

      <label className="block mb-2">
        <span className="text-sm">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" required />
      </label>

      <label className="block mb-2">
        <span className="text-sm">Contraseña</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" required />
      </label>

      <label className="block mb-4">
        <span className="text-sm">Confirmar contraseña</span>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" required />
      </label>

      <div className="flex items-center justify-between">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={busy}>
          {busy ? "Creando..." : "Crear cuenta"}
        </button>
        <a className="text-sm text-blue-600 hover:underline" href="/login">
          Ya tengo cuenta
        </a>
      </div>
    </form>
  );
}
