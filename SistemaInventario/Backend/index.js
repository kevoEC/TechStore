const express = require("express");
const sql = require("mssql");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
  },
};

// GET: Inventario completo
app.get("/api/inventario", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM Vista_Almacen`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Error al obtener inventario: " + err);
  }
});

// GET: Productos
app.get("/api/productos", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM Productos`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Error al obtener productos: " + err);
  }
});

// PUT: Editar producto
app.put("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;

  if (!nombre || !precio) {
    return res.status(400).send("Nombre y precio son obligatorios");
  }

  try {
    await sql.connect(dbConfig);

    // Sistema origen
    await sql.query`EXEC sp_set_session_context 'sistema_origen', 'INVENTARIO'`;

    await sql.query`
      UPDATE Productos
      SET nombre = ${nombre},
          descripcion = ${descripcion},
          precio = ${precio}
      WHERE id_producto = ${id}
    `;
    res.send("Producto actualizado correctamente");
  } catch (err) {
    res.status(500).send("Error al actualizar producto: " + err);
  }
});

// GET: Auditoría
app.get("/api/auditoria", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result =
      await sql.query`SELECT TOP 20 * FROM Auditoria ORDER BY fecha_evento DESC`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Error al obtener auditoría: " + err);
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor Inventario corriendo en puerto ${PORT}`);
});

app.put("/api/inventario/agregar-cantidad", async (req, res) => {
  const { id_producto, ubicacion_tienda, cantidad } = req.body;

  if (!id_producto || !ubicacion_tienda || !cantidad) {
    return res.status(400).send("Datos incompletos");
  }

  try {
    await sql.connect(dbConfig);

    // Sistema origen
    await sql.query`EXEC sp_set_session_context 'sistema_origen', 'INVENTARIO'`;

    await sql.query`
      IF EXISTS (
        SELECT 1 FROM Inventario WHERE id_producto = ${id_producto} AND ubicacion_tienda = ${ubicacion_tienda}
      )
      BEGIN
        UPDATE Inventario
        SET cantidad_disponible = cantidad_disponible + ${cantidad}
        WHERE id_producto = ${id_producto} AND ubicacion_tienda = ${ubicacion_tienda}
      END
      ELSE
      BEGIN
        INSERT INTO Inventario (id_producto, cantidad_disponible, ubicacion_tienda, estado_stock)
        VALUES (${id_producto}, ${cantidad}, ${ubicacion_tienda}, 'Disponible')
      END
    `;
    res.send("✅ Stock actualizado correctamente");
  } catch (err) {
    console.error("Error SQL:", err);
    res.status(500).send("❌ Error al actualizar stock: " + err);
  }
});

// POST: Crear nuevo producto
app.post("/api/productos", async (req, res) => {
  const { nombre, descripcion, precio } = req.body;

  if (!nombre || !precio) {
    return res.status(400).send("Nombre y precio son obligatorios");
  }

  try {
    await sql.connect(dbConfig);

    // Sistema origen
    await sql.query`EXEC sp_set_session_context 'sistema_origen', 'INVENTARIO'`;

    await sql.query`
      INSERT INTO Productos (nombre, descripcion, precio)
      VALUES (${nombre}, ${descripcion}, ${precio})
    `;
    res.send("Producto agregado correctamente");
  } catch (err) {
    res.status(500).send("Error al agregar producto: " + err);
  }
});
