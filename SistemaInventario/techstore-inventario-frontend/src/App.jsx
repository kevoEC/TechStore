import React, { useState } from "react";
import Tabs from "./components/Tabs";
import ProductoList from "./components/ProductoList";
import ProductoForm from "./components/ProductoForm";
import InventarioTable from "./components/InventarioTable";
import AuditoriaList from "./components/AuditoriaList";
import AgregarProductoForm from "./components/AgregarProductoForm";
import ActualizarCantidadForm from "./components/ActualizarCantidadForm";
import "./App.css";

function App() {
  const [productoEditando, setProductoEditando] = useState(null);
  const [recargarProductos, setRecargarProductos] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleEditar = (producto) => {
    setProductoEditando(producto);
  };

  const handleCancelarEdicion = () => {
    setProductoEditando(null);
  };

  const handleGuardadoExitoso = () => {
    setProductoEditando(null);
    setRecargarProductos(!recargarProductos);
  };

  const tabs = [
    {
      label: "Productos",
      content: (
        <>
          {productoEditando && (
            <ProductoForm
              producto={productoEditando}
              onCancel={handleCancelarEdicion}
              onSave={handleGuardadoExitoso}
            />
          )}
          <ProductoList
            key={recargarProductos}
            onEditar={handleEditar}
          />
        </>
      ),
    },
    {
      label: "Agregar Producto",
      content: <AgregarProductoForm onSuccess={() => setRecargarProductos(!recargarProductos)} />,
    },
    {
      label: "Inventario",
      content: <InventarioTable shouldReload={activeTabIndex === 2} />,
    },
    {
      label: "Actualizar Cantidad",
      content: <ActualizarCantidadForm />,
    },
    {
      label: "Auditoría",
      content: <AuditoriaList shouldReload={activeTabIndex === 4} />,
    },
  ];
  

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-800 tracking-wide drop-shadow">
          Sistema de Inventario - TechStore
        </h1>
        <Tabs
          tabs={tabs}
          activeIndex={activeTabIndex}
          onTabChange={setActiveTabIndex}
        />
      </div>
    </div>

  );
}

export default App;
