// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/db');
const config = require('./config/config');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 处理注册请求
app.post('/api/register', (req, res) => {
  const { username, password, email, phoneNumber } = req.body;

  const sql = 'INSERT INTO users (username, password, email, phone_number) VALUES (?, ?, ?, ?)';
  const values = [username, password, email, phoneNumber];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ message: 'Registration failed' });
      return;
    }

    console.log('User registered:', result);
    res.json({ message: 'Registration successful' });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
