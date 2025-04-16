-- ========================
-- 4. Vistas para cada sistema
-- ========================

CREATE OR ALTER VIEW Vista_Almacen AS
SELECT 
    p.id_producto,
    p.nombre,
    i.cantidad_disponible,
    i.ubicacion_tienda,
    CASE
        WHEN i.cantidad_disponible = 0 THEN 'Agotado'
        WHEN i.cantidad_disponible <= 5 THEN 'Bajo stock'
        ELSE 'Disponible'
    END AS estado_stock
FROM Productos p
JOIN Inventario i ON p.id_producto = i.id_producto;
GO


CREATE OR ALTER VIEW Vista_POS AS
SELECT 
    v.id_venta,
    p.nombre AS producto,
    v.cantidad_vendida,
    v.fecha_venta,
    v.tienda_origen,
    p.precio,
    (v.cantidad_vendida * p.precio) AS subtotal
FROM Ventas v
JOIN Productos p ON v.id_producto = p.id_producto;
GO

