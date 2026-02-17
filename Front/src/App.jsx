// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from "./pages/SettingsPage";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

/**
 * ProtectedRoute: componente que protege rutas que necesitan auth.
 * Si no hay usuario -> redirige a /login
 */
function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();

  // mientras inicializa, muestra nada o un loader
  if (initializing) return <div className="p-4">Cargando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default function App() {
  return (
    // AuthProvider provee estado de usuario a toda la app
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                {/* Ruta por defecto */}
                <Route path="/" element={<Navigate to="/chat" replace />} />
                {/* 404 básico */}
                <Route path="*" element={<div>404 - Not Found</div>} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
