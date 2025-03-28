const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const { slugify } = require('slugify');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',
  database: 'obituary_platform'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected');
});

// Create Obituary
app.post('/api/obituaries', (req, res) => {
  const { name, date_of_birth, date_of_death, content, author } = req.body;
  const slug = slugify(name, { lower: true });
  const submission_date = new Date();

  const sql = `
    INSERT INTO obituaries 
    (name, date_of_birth, date_of_death, content, author, slug, submission_date) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, date_of_birth, date_of_death, content, author, slug, submission_date], 
    (err, result) => {
      if (err) throw err;
      res.json({ success: true, message: 'Obituary submitted successfully' });
    }
  );
});

// Get All Obituaries
app.get('/api/obituaries', (req, res) => {
  const sql = 'SELECT * FROM obituaries';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));