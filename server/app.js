// app.js
const express = require('express');
const cors = require('cors');
const app = express();

// 使用 cors 中间件
app.use(cors());
app.use(express.json());

module.exports = app;
