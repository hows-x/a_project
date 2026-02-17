// src/contexts/AuthContext.jsx
import React , { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client"; // axios wrapper (opcional)

const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Llamada para obtener usuario actual
    (async () => {
      try {
        const res = await client.get("/auth/me/"); // ajusta endpoint
        setUser(res.data.user);
      } catch (e) {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

/**Ajusta la ruta /auth/me/ a la que tengas en Django. */