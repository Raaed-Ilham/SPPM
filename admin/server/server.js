const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 5001;
const secretKey = crypto.randomBytes(32).toString('hex');

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

// MySQL database setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vfitdb',
  port: 3306,
  connectTimeout: 30000
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database successfully');
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM admintbl WHERE email = ? AND password = ?`;
  connection.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ success: false, message: 'An error occurred' });
    }
    if (result.length > 0) {
      // User found, return success
      const tokenPayload = {
        email: email
      };
      // res.json({ success: true, message: 'Login successful' });
      const token = jwt.sign(tokenPayload, secretKey, { expiresIn: "1h" });
      res.status(200).json({ success: true, token, message: "Login Successful" });

    } else {
      // User not found, return error
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// Route for handling file upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).send('No file uploaded');
    return;
  }

  const imageUrl = req.file.filename;
  res.send({ imageUrl });
});

// Route for adding a product
app.post('/add-product', (req, res) => {
  const { title, description, material, color, image_url, price } = req.body;

  const query = "INSERT INTO tshirtstbl (title, description, material, image_url, color, price) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [title, description, material, image_url, color, price];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error inserting product');
      return;
    }

    res.send('Product added successfully');
  });
});

// API endpoint to fetch T-shirt images
app.get('/images', (req, res) => {
  const query = "SELECT * FROM tshirtstbl";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err); // Log error if any
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Data sent to client:", results); // Log data being sent
    return res.json(results);
  });
});



// Route for deleting a product
app.delete('/delete-product/:tshirt_id', (req, res) => {
  const productId = req.params.tshirt_id;

  console.log("Delete working" + productId);
  // Fetch the image URL associated with the product from the database
  const sql = 'SELECT image_url FROM tshirtstbl WHERE tshirt_id = ?';
  connection.query(sql, [productId], (error, results) => {
    if (error) {
      console.error('Error fetching image URL:', error);
      return res.status(501).send('Error deleting product');
    }

    // Check if results array is empty or not
    if (results.length === 0) {
      console.error('No product found with the given ID');
      return res.status(404).send('Product not found');
    }

    // Delete the image file from the server
    const imageUrl = results[0].image_url;
    console.log("image:" + imageUrl);
    // const imagePath = path.join(__dirname, '../public/images', imageUrl);
    const imagePath = path.join('./public/images', imageUrl)
    fs.unlink(imagePath, (unlinkError) => {
      if (unlinkError) {
        console.error('Error deleting image file:', unlinkError);
        return res.status(500).send('Error deleting product');
      }

      // Delete the record from the database
      connection.query('DELETE FROM tshirtstbl WHERE tshirt_id = ?', [productId], (deleteError, deleteResults) => {
        if (deleteError) {
          console.error('Error deleting product record:', deleteError);
          return res.status(502).send('Error deleting product');
        }

        res.send('Product deleted successfully');
      });
    });
  });
});

app.put('/update-product/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, material, image_url, color, price } = req.body;
  const query = 'UPDATE tshirtstbl SET title=?, description=?, material=?, image_url=?, color=?, price=? WHERE tshirt_id=?';
  connection.query(query, [title, description, material, image_url, color, price, id], (err, results) => {
      if (err) {
          console.error('Error updating product:', err);
          res.status(500).json({ error: 'Error updating product' });
      } else {
          res.json({ message: 'Product updated successfully' });
      }
  });
});

app.get('/single-product/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM tshirtstbl WHERE tshirt_id = ?';

  connection.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching product details:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const product = results[0]; // Assuming there's only one product with the given ID
    res.json(product);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});