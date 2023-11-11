const express = require('express');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const config = require('./config/config.js'); // 引入配置文件

const app = express();
const PORT = process.env.PORT || 3000;

// 创建一个MySQL连接池
const pool = mysql.createPool({
  ...config.database, // 使用解构语法将数据库配置合并到连接池配置中
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(express.json());

// 注册用户的路由
app.post('/register', async (req, res) => {
    const { username, password, confirmPassword, email, userType, phoneNumber} = req.body;
    console.log(req.body);
  
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();
  
      const userId = uuidv4();
  
      const insertUserQuery = `
        INSERT INTO users (user_id, user_name, password, email, telphone, user_type, create_at, update_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
  
      await connection.execute(insertUserQuery, [userId, username, password, email, phoneNumber, userType]);
  
      await connection.commit();
      connection.release();
  
      res.status(200).json({ message: '注册成功' });
    } catch (error) {
      console.error('注册失败', error);
      res.status(500).json({ message: `注册失败: ${error.message || error}` });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
