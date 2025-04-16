import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductoForm({ producto, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || "",
        precio: producto.precio,
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3002/api/productos/${producto.id_producto}`, formData);
      onSave(); // para recargar productos
    } catch (err) {
      console.error("Error al actualizar producto:", err);
    }
  };

  if (!producto) return null;

  return (
    <div className="mb-10 bg-white shadow rounded p-6 border">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Editar Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Nombre</label>
          <input
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white text-gray-800"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Descripción</label>
          <input
            name="descripcion"
            type="text"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white text-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Precio</label>
          <input
            name="precio"
            type="number"
            value={formData.precio}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white text-gray-800"
            required
            min={0}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
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

export default ProductoForm;
