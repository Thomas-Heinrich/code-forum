// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');


// const app = express();
// app.use(cors());
// app.use(express.json());

// // Connection-Pool (empfohlen gegenüber einzelner Connection)
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'dein_passwort',
//   database: 'mydb',
//   waitForConnections: true,
//   connectionLimit: 10
// });

// // Daten eintragen
// app.post('/api/users', async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     const [result] = await pool.execute(
//       'INSERT INTO users (name, email) VALUES (?, ?)',
//       [name, email]
//     );
//     res.status(201).json({ id: result.insertId, message: 'Erfolgreich gespeichert' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Daten auslesen (optional)
// app.get('/api/users', async (req, res) => {
//   try {
//     const [rows] = await pool.execute('SELECT * FROM users');
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(5000, () => console.log('Server läuft auf Port 5000'));   