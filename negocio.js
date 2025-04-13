// negocio.js
const express = require('express');
const sql = require('mssql'); // Cambiamos pg por mssql
const app = express();

// Configuración de la conexión a SQL Server
const config = {
  server: '.\\MSSQLLocalDB', // o la dirección de tu servidor SQL
  database: 'personas_db',
  options: {
    trustServerCertificate: true,
    trustedConnection: true
  }
};

// Conexión pool
sql.connect(config).catch(err => console.error('Error de conexión:', err));

app.use(express.json());

// Endpoint GET /api/personas
app.get('/api/personas', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM personas');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// Endpoint POST /api/personas
app.post('/api/personas', async (req, res) => {
  const { nombre, dni, fechaNacimiento, direccion } = req.body;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('dni', sql.VarChar, dni)
      .input('fechaNacimiento', sql.Date, fechaNacimiento)
      .input('direccion', sql.VarChar, direccion)
      .query('INSERT INTO personas (nombre, dni, fecha_nacimiento, direccion) VALUES (@nombre, @dni, @fechaNacimiento, @direccion); SELECT SCOPE_IDENTITY() AS id;');
    
    // Para obtener el registro insertado (opcional)
    const newRecord = await pool.request()
      .query(`SELECT * FROM personas WHERE id = ${result.recordset[0].id}`);
    
    res.json(newRecord.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// Endpoint DELETE /api/personas/:id
app.delete('/api/personas/:id', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('DELETE FROM personas WHERE id = @id');
      res.json({ message: 'Persona eliminada correctamente' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error del servidor');
    }
  });

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));