import { Link } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  // 1. Estado para controlar la apertura/cierre
  const [isOpen, setIsOpen] = useState(false);

  // 2. Función para cambiar el estado
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleDropdown}
        className="w-1 text-black p-2 hover:bg-gray-200"
      >
        {isOpen ? "|" : "|"}
      </button>

      {isOpen && (
        <aside className="bg-black-50 w-60 border-r p-4 hidden md:block text-black">
          <nav className="flex flex-col gap-2">
            <Link to="/chat" className="hover:underline">
              <h2 className="text-xl">Chat</h2>
            </Link>
            <Link to="/settings" className="hover:underline">
              <h2 className="text-xl" >Ajustes</h2>
            </Link>
            <Link to="/login" className="hover:underline">
              <h2 className="text-xl">Salir</h2>
            </Link>
          </nav>
        </aside>
      )}
    </>
  );
}
