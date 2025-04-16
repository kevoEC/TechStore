-- ========================
-- 1. Tablas principales
-- ========================

CREATE TABLE Productos (
    id_producto INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(255),
    precio DECIMAL(10,2) NOT NULL
);

CREATE TABLE Inventario (
    id_inventario INT PRIMARY KEY IDENTITY(1,1),
    id_producto INT NOT NULL,
    cantidad_disponible INT NOT NULL,
    ubicacion_tienda NVARCHAR(100) NOT NULL,
    estado_stock NVARCHAR(50) NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

CREATE TABLE Ventas (
    id_venta INT PRIMARY KEY IDENTITY(1,1),
    id_producto INT NOT NULL,
    cantidad_vendida INT NOT NULL,
    fecha_venta DATETIME DEFAULT GETDATE(),
    tienda_origen NVARCHAR(100) NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- ========================
-- 2. Tabla de Auditoría
-- ========================

CREATE TABLE Auditoria (
    id_evento INT PRIMARY KEY IDENTITY(1,1),
    tabla_afectada NVARCHAR(100),
    operacion NVARCHAR(20),
    fecha_evento DATETIME DEFAULT GETDATE(),
    datos_previos NVARCHAR(MAX),
    datos_nuevos NVARCHAR(MAX),
	origen_sistema NVARCHAR(50)
);

