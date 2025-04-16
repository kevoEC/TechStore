-- ===========================
-- CONSULTAS PARA PRUEBAS DE CASO TECHSTORE
-- Archivo generado para ejecutar consultas de validación
-- ===========================

-- 1. Insertar productos de prueba
INSERT INTO Productos (nombre, descripcion, precio) VALUES
('Laptop Lenovo IdeaPad 3', 'Laptop con Ryzen 5 y 8GB RAM', 599.99),
('Mouse Logitech M170', 'Mouse inalámbrico USB', 15.50),
('Monitor LG 24MK600M', 'Monitor IPS Full HD 24 pulgadas', 139.00),
('Teclado Redragon Kumara', 'Teclado mecánico retroiluminado', 45.75);

-- 2. Insertar inventario por tienda
INSERT INTO Inventario (id_producto, cantidad_disponible, ubicacion_tienda, estado_stock) VALUES
(1, 10, 'Quito - Centro', 'Disponible'),
(2, 50, 'Quito - Centro', 'Disponible'),
(3, 5, 'Quito - Centro', 'Bajo stock'),
(4, 30, 'Guayaquil - Norte', 'Disponible'),
(1, 8, 'Guayaquil - Norte', 'Disponible');

-- 3. Consultar productos
SELECT * FROM Productos;

-- 4. Consultar inventario
SELECT * FROM Inventario;

-- 5. Registrar una venta y verificar disparo del trigger
INSERT INTO Ventas (id_producto, cantidad_vendida, tienda_origen) VALUES
(1, 2, 'Quito - Centro'),
(2, 5, 'Quito - Centro'),
(3, 1, 'Quito - Centro');

-- 6. Consultar ventas realizadas
SELECT * FROM Ventas;

-- 7. Consultar el inventario actualizado tras las ventas
SELECT * FROM Vista_Almacen;

-- 8. Consultar auditoría por actualizaciones e inserciones
SELECT * FROM Auditoria;

-- 9. Modificar producto para probar trigger de auditoría
UPDATE Productos SET precio = 619.99 WHERE id_producto = 1;

-- 10. Consultar auditoría después del cambio
SELECT * FROM Auditoria WHERE tabla_afectada = 'Productos';

-- 11. Consultar vista POS
SELECT * FROM Vista_POS;


