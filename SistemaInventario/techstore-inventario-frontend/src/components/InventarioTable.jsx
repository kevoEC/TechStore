import React, { useEffect, useState } from "react";
import axios from "axios";

function InventarioTable({ shouldReload }) {
  const [inventario, setInventario] = useState([]);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState("Todas");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/inventario");
        setInventario(res.data);
      } catch (err) {
        console.error("Error al cargar inventario:", err);
      }
    };

    if (shouldReload) {
      fetchData();
    }
  }, [shouldReload]);

  const iconoEstado = (estado) => {
    if (estado.toLowerCase() === "disponible") return "✅";
    if (estado.toLowerCase() === "bajo stock") return "⚠️";
    return "❌";
  };

  const tiendasDisponibles = [
    "Todas",
    ...Array.from(new Set(inventario.map((i) => i.ubicacion_tienda))),
  ];

  const inventarioFiltrado =
    tiendaSeleccionada === "Todas"
      ? inventario
      : inventario.filter((i) => i.ubicacion_tienda === tiendaSeleccionada);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Inventario General</h2>

      {/* Filtro de tienda */}
      <div className="mb-4 flex justify-start">
        <label className="mr-2 font-medium text-sm text-gray-700">Filtrar por tienda:</label>
        <select
          value={tiendaSeleccionada}
          onChange={(e) => setTiendaSeleccionada(e.target.value)}
          className="border rounded px-3 py-1 text-sm text-gray-800"
        >
          {tiendasDisponibles.map((tienda, idx) => (
            <option key={idx} value={tienda}>
              {tienda}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto shadow border rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-800 bg-white">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="py-2 px-4 border">Producto</th>
              <th className="py-2 px-4 border">Cantidad</th>
              <th className="py-2 px-4 border">Tienda</th>
              <th className="py-2 px-4 border">Estado</th>
            </tr>
          </thead>
          <tbody>
            {inventarioFiltrado.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{item.nombre}</td>
                <td className="py-2 px-4 border">{item.cantidad_disponible}</td>
                <td className="py-2 px-4 border">{item.ubicacion_tienda}</td>
                <td className="py-2 px-4 border">
                  {iconoEstado(item.estado_stock)} {item.estado_stock}
                </td>
              </tr>
            ))}
            {inventarioFiltrado.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                  No hay datos disponibles para esta tienda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventarioTable;
