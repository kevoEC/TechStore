import React, { useState } from "react";
import axios from "axios";

function AgregarProductoForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      await axios.post("http://localhost:3002/api/productos", formData);
      setMensaje("✅ Producto agregado correctamente.");
      setFormData({ nombre: "", descripcion: "", precio: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error al agregar producto:", err);
      setMensaje("❌ Error al agregar producto.");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Agregar Nuevo Producto</h2>

      {mensaje && <p className="mb-4 text-blue-600 text-sm">{mensaje}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-white text-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white text-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Precio</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            min={0}
            required
            className="w-full border px-3 py-2 rounded bg-white text-gray-800"
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgregarProductoForm;
