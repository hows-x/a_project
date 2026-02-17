import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true, // importante si usas cookies httpOnly
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// interceptor básico de errores
client.interceptors.response.use(
  (res) => res,
  (err) => {
    // manejo global: 401 -> forzar logout (adaptar según tu app)
    if (err?.response?.status === 401) {
      // ejemplo: redirigir a login
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default client;

/**Este codigo funciona de la siguiente manera , axios es una libreria encargada de las llamadas a la API , client es el metodo axios.create almacenado */