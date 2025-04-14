// negocio.js
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const app = express();

app.use(cors());
app.use(express.json());
const db = new Database('personas.db'); // Abre la base de datos local

// Crea tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS personas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    dni TEXT NOT NULL,
    fechaNacimiento TEXT NOT NULL,
    direccion TEXT
  );
`);

// GET /api/personas
app.get('/api/personas', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM personas');
    const personas = stmt.all();
    res.json(personas);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// POST /api/personas
app.post('/api/personas', (req, res) => {
  const { nombre, dni, fechaNacimiento, direccion } = req.body;
  try {
    const insert = db.prepare(`
      INSERT INTO personas (nombre, dni, fechaNacimiento, direccion)
      VALUES (?, ?, ?, ?)
    `);
    const result = insert.run(nombre, dni, fechaNacimiento, direccion);

    const select = db.prepare('SELECT * FROM personas WHERE id = ?');
    const newPersona = select.get(result.lastInsertRowid);

    res.json(newPersona);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// DELETE /api/personas/:id
app.delete('/api/personas/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM personas WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Persona eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
