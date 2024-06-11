const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = 5000;

app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vfitdb',
  port: 3306,
  connectTimeout: 30000
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Endpoint to get filtered T-shirts
app.get('/images', (req, res) => {
  const { price, color, style } = req.query;

  let query = 'SELECT * FROM tshirtstbl WHERE 1=1'; 
  const params = [];

  if (price) {
    query += ' AND price <= ?';
    params.push(parseInt(price));
  }

  if (color) {
    query += ' AND color = ?';
    params.push(color);
  }

  if (style) {
    query += ' AND style = ?';
    params.push(style);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching T-shirts:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(results);
  });
});

// Serve images statically from the 'images' folder
app.use('/images', express.static('images'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
