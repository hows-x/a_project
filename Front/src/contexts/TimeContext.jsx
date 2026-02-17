import React, { useState, useEffect } from "react";

function TimeContext() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    // Actualizar la hora cada segundo
    const timerId = setInterval(() => {
      setHora(new Date());
    }, 1000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(timerId);
  }, []);

  return (
    <p>{hora.toLocaleTimeString()}</p>
  );
}

export default TimeContext;
