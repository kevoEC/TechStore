// Archivo: backend/index.js (Node.js + Express)

const express = require("express");
require("dotenv").config();
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configurar conexión directa a SQL Server
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
  },
};

// Ruta: Obtener productos disponibles
app.get("/api/productos", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result =
      await sql.query`SELECT id_producto, nombre, precio FROM Productos`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Error al obtener productos: " + err);
  }
});

// Ruta: Registrar una venta
app.post("/api/ventas", async (req, res) => {
  const { id_producto, cantidad_vendida, tienda_origen } = req.body;

  if (!id_producto || !cantidad_vendida || !tienda_origen) {
    return res.status(400).send("Faltan datos obligatorios");
  }

  try {
    await sql.connect(dbConfig);

    // 👉 Establecer sistema de origen para auditoría
    await sql.query`EXEC sp_set_session_context 'sistema_origen', 'POS'`;

    // 👉 Verificar stock disponible
    const result = await sql.query`
      SELECT cantidad_disponible
      FROM Inventario
      WHERE id_producto = ${id_producto} AND ubicacion_tienda = ${tienda_origen}
    `;

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .send("El producto no está disponible en esta tienda");
    }

    const stockActual = result.recordset[0].cantidad_disponible;

    if (stockActual < cantidad_vendida) {
      return res
        .status(400)
        .send("No hay suficiente stock disponible para esta venta");
    }

    // 👉 Registrar venta
    await sql.query`
      INSERT INTO Ventas (id_producto, cantidad_vendida, tienda_origen)
      VALUES (${id_producto}, ${cantidad_vendida}, ${tienda_origen})
    `;

    res.send("Venta registrada exitosamente");
  } catch (err) {
    res.status(500).send("Error al registrar venta: " + err);
  }
});

// Ruta: Consultar inventario actualizado (Vista)
app.get("/api/inventario/:tienda", async (req, res) => {
  const { tienda } = req.params;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT * FROM Vista_Almacen WHERE ubicacion_tienda = ${tienda}
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Error al consultar inventario: " + err);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor POS corriendo en puerto ${PORT}`);
});
