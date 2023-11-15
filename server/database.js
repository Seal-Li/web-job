// database.js
const mysql = require('mysql2/promise');
const config = require('./config/config.js'); // 引入配置文件

// 创建一个MySQL连接池
const pool = mysql.createPool({
  ...config.database, // 使用解构语法将数据库配置合并到连接池配置中
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = { pool };
