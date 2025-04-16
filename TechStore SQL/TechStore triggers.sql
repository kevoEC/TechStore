-- ========================
-- 3. Triggers de Auditoría
-- ========================

-- Trigger para cambios en Productos
CREATE OR ALTER TRIGGER trg_auditar_productos
ON Productos
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
	DECLARE @sistema NVARCHAR(50) = CONVERT(NVARCHAR(50), SESSION_CONTEXT(N'sistema_origen'));


  -- INSERT
  INSERT INTO Auditoria (tabla_afectada, operacion, datos_previos, datos_nuevos, origen_sistema)
  SELECT
    'Productos', 'INSERT', NULL,
    'Nombre: ' + nombre + ', Precio: ' + CAST(precio AS NVARCHAR),
    @sistema
  FROM inserted
  WHERE id_producto NOT IN (SELECT id_producto FROM deleted);

  -- UPDATE
  INSERT INTO Auditoria (tabla_afectada, operacion, datos_previos, datos_nuevos, origen_sistema)
  SELECT
    'Productos', 'UPDATE',
    'Nombre: ' + d.nombre + ', Precio: ' + CAST(d.precio AS NVARCHAR),
    'Nombre: ' + i.nombre + ', Precio: ' + CAST(i.precio AS NVARCHAR),
    @sistema
  FROM inserted i
  INNER JOIN deleted d ON i.id_producto = d.id_producto;

  -- DELETE
  INSERT INTO Auditoria (tabla_afectada, operacion, datos_previos, datos_nuevos, origen_sistema)
  SELECT
    'Productos', 'DELETE',
    'Nombre: ' + nombre + ', Precio: ' + CAST(precio AS NVARCHAR),
    NULL,
    @sistema
  FROM deleted
  WHERE id_producto NOT IN (SELECT id_producto FROM inserted);
END;
GO



-- Trigger para registrar ventas (y auditar)
CREATE OR ALTER TRIGGER trg_auditar_insert_ventas
ON Ventas
AFTER INSERT
AS
BEGIN
  DECLARE @sistema NVARCHAR(50) = CONVERT(NVARCHAR(50), SESSION_CONTEXT(N'sistema_origen'));

  -- Auditoría de la venta
  INSERT INTO Auditoria (tabla_afectada, operacion, datos_previos, datos_nuevos, origen_sistema)
  SELECT 
    'Ventas', 'INSERT', NULL,
    'Producto: ' + CAST(id_producto AS NVARCHAR) + ', Cantidad: ' + CAST(cantidad_vendida AS NVARCHAR),
    @sistema
  FROM inserted;

  -- Descuento de inventario
  UPDATE i
  SET i.cantidad_disponible = i.cantidad_disponible - ins.cantidad_vendida
  FROM Inventario i
  INNER JOIN inserted ins ON i.id_producto = ins.id_producto AND i.ubicacion_tienda = ins.tienda_origen;
END;
GO



CREATE OR ALTER TRIGGER trg_auditar_inventario
ON Inventario
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
  DECLARE @sistema NVARCHAR(50) = CONVERT(NVARCHAR(50), SESSION_CONTEXT(N'sistema_origen'));

  -- INSERT
  INSERT INTO Auditoria (tabla_afectada, operacion, datos_previos, datos_nuevos, origen_sistema)
  SELECT 
    'Inventario', 'INSERT', NULL,
    'Producto: ' + CAST(id_producto AS NVARCHAR) + ', Cantidad: ' + CAST(cantidad_disponible AS NVARCHAR) + ', Tienda: ' + ubicacion_tienda,
    @sistema
  FROM inserted
  WHERE id_inventario NOT IN (SELECT id_inventario FROM deleted);

  -- UPDATE
  INSERT INTO Auditoria (tabla_afectada, operacion, datos_previos, datos_nuevos, origen_sistema)
  SELECT 
    'Inventario', 'UPDATE',
    'Cantidad: ' + CAST(d.cantidad_disponible AS NVARCHAR) + ', Tienda: ' + d.ubicacion_tienda,
    'Cantidad: ' + CAST(i.cantidad_disponible AS NVARCHAR) + ', Tienda: ' + i.ubicacion_tienda,
    @sistema
  FROM inserted i
  INNER JOIN deleted d ON i.id_inventario = d.id_inventario;

  -- DELETE
  INSERT INTO Auditoria (tabla_afectada, operacion, datos_previos, datos_nuevos, origen_sistema)
  SELECT 
    'Inventario', 'DELETE',
    'Producto: ' + CAST(id_producto AS NVARCHAR) + ', Cantidad: ' + CAST(cantidad_disponible AS NVARCHAR) + ', Tienda: ' + ubicacion_tienda,
    NULL,
    @sistema
  FROM deleted
  WHERE id_inventario NOT IN (SELECT id_inventario FROM inserted);
END;
GO

