import React, { useEffect, useState } from "react";
import axios from "axios";

function ActualizarCantidadForm() {
  const [productos, setProductos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [formData, setFormData] = useState({
    id_producto: "",
    ubicacion_tienda: "",
    cantidad: "",
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const resProd = await axios.get("http://localhost:3002/api/productos");
        setProductos(resProd.data);

        const resInv = await axios.get("http://localhost:3002/api/inventario");
        const tiendasUnicas = [...new Set(resInv.data.map(i => i.ubicacion_tienda))];
        setInventario(tiendasUnicas);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id_producto, ubicacion_tienda, cantidad } = formData;
    setMensaje("");

    if (!id_producto || !ubicacion_tienda || !cantidad) {
      setMensaje("❌ Todos los campos son obligatorios.");
      return;
    }

    try {
      await axios.put("http://localhost:3002/api/inventario/agregar-cantidad", {
        id_producto,
        ubicacion_tienda,
        cantidad: parseInt(cantidad),
      });
      setMensaje("✅ Stock actualizado correctamente.");
      setFormData({ id_producto: "", ubicacion_tienda: "", cantidad: "" });
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
      setMensaje("❌ Error al actualizar stock.");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Agregar Cantidad a Tienda</h2>

      {mensaje && <p className="mb-4 text-sm text-blue-600">{mensaje}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Producto</label>
          <select
            name="id_producto"
            value={formData.id_producto}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-white text-gray-800"
          >
            <option value="">Seleccione un producto</option>
            {productos.map((p) => (
              <option key={p.id_producto} value={p.id_producto}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Tienda</label>
          <select
            name="ubicacion_tienda"
            value={formData.ubicacion_tienda}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-white text-gray-800"
          >
            <option value="">Seleccione una tienda</option>
            {inventario.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Cantidad a Agregar</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            min={1}
            required
            className="w-full border px-3 py-2 rounded bg-white text-gray-800"
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Actualizar Stock
          </button>
        </div>
      </form>
    </div>
  );
}

export default ActualizarCantidadForm;
