import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductoList({ onEditar }) {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  const obtenerProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3002/api/productos");
      setProductos(res.data);
    } catch (err) {
      setError("Error al cargar productos");
      console.error(err);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Productos</h2>
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto shadow border rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-800 bg-white">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Descripción</th>
              <th className="py-2 px-4 border">Precio</th>
              <th className="py-2 px-4 border text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id_producto} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{p.id_producto}</td>
                <td className="py-2 px-4 border">{p.nombre}</td>
                <td className="py-2 px-4 border">{p.descripcion}</td>
                <td className="py-2 px-4 border">${p.precio}</td>
                <td className="py-2 px-4 border text-center">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    onClick={() => onEditar(p)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductoList;
