// src/api/auth.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // e.g. http://localhost:8000/api
  withCredentials: true, // IMPORTANTE si el backend usa httpOnly cookies
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

/**
 * register: espera { name, email, password } y devuelve user o status.
 * login: espera { email, password }.
 * logout: POST para invalidar cookie/session.
 * me: GET user actual (usa la cookie o el token).
 */
export const register = (payload) => api.post("/auth/register/", payload);
export const login = (payload) => api.post("/auth/login/", payload);
export const logout = () => api.post("/auth/logout/");
export const me = () => api.get("/auth/me/");

export default api;
