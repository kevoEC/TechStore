import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Asegúrate de tener Tailwind CSS configurado

function App() {
  const [productos, setProductos] = useState([]);
  const [idProducto, setIdProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tiendaOrigen, setTiendaOrigen] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [inventario, setInventario] = useState([]);

  const tiendas = ["Quito - Centro", "Guayaquil - Norte", "Cuenca - Sur"];

  const obtenerInventario = async (tienda) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/inventario/${encodeURIComponent(tienda)}`);
      setInventario(res.data);
      setProductos(res.data); // usar los mismos productos de la vista de inventario
      setIdProducto(""); // limpiar selección previa
    } catch (err) {
      console.error("Error al consultar inventario:", err);
    }
  };

  useEffect(() => {
    if (tiendaOrigen) {
      obtenerInventario(tiendaOrigen);
    } else {
      setProductos([]);
      setInventario([]);
    }
  }, [tiendaOrigen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idProducto || !cantidad || !tiendaOrigen) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }
    const stockDisponible = inventario.find(
      (p) => p.id_producto === parseInt(idProducto)
    )?.cantidad_disponible || 0;
    
    if (parseInt(cantidad) > stockDisponible) {
      setMensaje("❌ No puedes vender más de lo que hay en stock");
      return;
    }
    try {
      const nuevaVenta = {
        id_producto: idProducto,
        cantidad_vendida: cantidad,
        tienda_origen: tiendaOrigen,
      };
      await axios.post("http://localhost:3001/api/ventas", nuevaVenta);
      setMensaje("✅ Venta registrada correctamente");
      setCantidad("");
      setIdProducto("");
      await obtenerInventario(tiendaOrigen);
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.includes("No hay suficiente stock")
      ) {
        setMensaje("❌ No hay suficiente stock disponible para esta venta");
      } else {
        setMensaje("❌ Error al registrar venta");
      }
      console.error(err);
    }
    
  };

  const iconoEstado = (estado) => {
    if (estado.toLowerCase() === "disponible") return "✅";
    if (estado.toLowerCase() === "bajo stock") return "⚠️";
    return "❌";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Registrar Venta - TechStore
        </h1>

        {mensaje && (
          <div className="text-sm mb-4 text-center text-blue-600">{mensaje}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Tienda de origen primero */}
          <div>
            <label className="block mb-1 text-gray-700">Tienda de origen:</label>
            <select
              value={tiendaOrigen}
              onChange={(e) => setTiendaOrigen(e.target.value)}
              className="w-full px-3 py-2 border rounded text-gray-800 bg-white"
              required
            >
              <option value="">Seleccione una tienda</option>
              {tiendas.map((t, index) => (
                <option key={index} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Producto filtrado por tienda */}
          <div>
            <label className="block mb-1 text-gray-700">Producto:</label>
            <select
              value={idProducto}
              onChange={(e) => setIdProducto(e.target.value)}
              className="w-full px-3 py-2 border rounded text-gray-800 bg-white"
              required
              disabled={!tiendaOrigen}
            >
              <option value="">Seleccione un producto</option>
              {productos.map((p) => (
                <option key={p.id_producto} value={p.id_producto}>
                  {p.nombre} - ${p.precio}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min={1}
              className="w-full px-3 py-2 border rounded text-gray-800 bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            Registrar Venta
          </button>
        </form>

        {/* Tabla de Inventario */}
        {inventario.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 text-center">
              Inventario en {tiendaOrigen}
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full bg-white border border-gray-300 text-sm text-gray-800">
                <thead className="bg-gray-200 font-semibold text-center">
                  <tr>
                    <th className="py-2 px-4 border">Producto</th>
                    <th className="py-2 px-4 border">Cantidad</th>
                    <th className="py-2 px-4 border">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {inventario.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 text-center">
                      <td className="py-2 px-4 border">{item.nombre}</td>
                      <td className="py-2 px-4 border">{item.cantidad_disponible}</td>
                      <td className="py-2 px-4 border">
                        {iconoEstado(item.estado_stock)} {item.estado_stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
