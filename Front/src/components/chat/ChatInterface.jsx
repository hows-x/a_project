// ChatInterface.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendMessageToAI } from "../../api/chatApi";

export default function ChatInterface() {
  // Estado para la conversación completa
  const [messages, setMessages] = useState([]);

  // Estado del texto que el usuario escribe
  const [input, setInput] = useState("");

  /**f
   * useMutation permite manejar peticiones POST con:
   * - control de errores
   * - estados de carga
   * - callbacks cuando la petición termina
   */
  const mutation = useMutation({
    mutationFn: (msg) => sendMessageToAI(msg), // Llama al backend
    onSuccess: (data) => {
      /**
       * Cuando el backend responde, añadimos
       * el mensaje de la IA al chat
       */
      const aiMessage = {
        role: "assistant",
        message: data.message,
      };

      setMessages((prev) => [...prev, aiMessage]);
    },
    onError: () => {
      /**
       * Si el servidor falla, mostramos un mensaje
       * para que el usuario sepa qué ocurrió.
       */
      setMessages((prev) => [
        ...prev,
        { role: "assistant", message: "Error al conectar con la IA." },
      ]);
    },
  });

  /**
   * Esta función se ejecuta cuando el usuario hace clic en "Enviar".
   * Ahora ya no usamos fetch manual, sino mutation.mutate()
   */
  const handleSend = () => {
    if (!input.trim()) return; // Evita enviar mensajes vacíos

    // Agrega el mensaje del usuario al chat
    const userMessage = { role: "user", message: input };
    setMessages((prev) => [...prev, userMessage]);

    // Lanza la solicitud al backend
    mutation.mutate(input);

    // Limpia la caja de texto
    setInput("");
  };

  return (
    <>
      <div className="max-w-9/1 mx-auto p-4 ">
        {/*
        CONTENEDOR DEL CHAT
        - Scroll vertical
        - Fondo claro
        - Caja redondeada
        */}
        <div className="border-lg p-4 rounded-xl h-96 overflow-y-scroll bg-back-gray shadow-xl/20">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded-lg my-2 p-0.5 ${
                msg.role === "user"
                  ? "bg-linear-65 from-purple-booba to-pink-booba "
                  : "flex rounded-lg bg-gradient-to-r from-purple-booba via-black to-pink-booba"
              }`}
            >
              <div
                className={`rounded-lg ${
                  msg.role != "user"
                    ? "bg-back-gray h-full w-full p-2"
                    : "text-black p-2"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
          {mutation.isPending && (
            <div className="text-gray-400">Escribiendo...</div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl text-black"
            placeholder="Escribe algo..."
          />
          <button
            onClick={handleSend} /**Gradent From: #9900FF To #E21CF4*/
            className="bg-linear-65 from-purple-booba to-pink-booba text-white px-4 py-2 rounded-xl"
          >
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}
