import React, { useEffect, useState } from "react";
import axios from "axios";

function AuditoriaList({ shouldReload }) {
  const [auditoria, setAuditoria] = useState([]);

  useEffect(() => {
    const fetchAuditoria = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/auditoria");
        setAuditoria(res.data);
      } catch (err) {
        console.error("Error al cargar auditoría:", err);
      }
    };

    if (shouldReload) {
      fetchAuditoria();
    }
  }, [shouldReload]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Auditoría</h2>
      <div className="overflow-x-auto shadow border rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-800 bg-white">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="py-2 px-4 border">Tabla</th>
              <th className="py-2 px-4 border">Operación</th>
              <th className="py-2 px-4 border">Fecha</th>
              <th className="py-2 px-4 border">Antes</th>
              <th className="py-2 px-4 border">Después</th>
            </tr>
          </thead>
          <tbody>
            {auditoria.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{item.tabla_afectada}</td>
                <td className="py-2 px-4 border">{item.operacion}</td>
                <td className="py-2 px-4 border">{new Date(item.fecha_evento).toLocaleString()}</td>
                <td className="py-2 px-4 border">{item.datos_previos}</td>
                <td className="py-2 px-4 border">{item.datos_nuevos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditoriaList;
