const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const config = require('./config/config.js'); // 引入配置文件

const app = express();
const PORT = process.env.PORT || 3000;

// 使用 cors 中间件
app.use(cors());

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
  
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();
  
      // 检查邮箱是否已存在
      const emailExistsQuery = 'SELECT * FROM users WHERE email = ?';
      const [emailResults] = await connection.execute(emailExistsQuery, [email]);
      console.log('emailResults: ', emailResults);

      // 检查手机号是否已存在
      const phoneNumberExistsQuery = 'SELECT * FROM users WHERE telphone = ?';
      const [phoneNumberResults] = await connection.execute(phoneNumberExistsQuery, [phoneNumber]);
      console.log('phoneNumberResults: ', phoneNumberResults);

      // 如果邮箱或手机号已存在，提示用户执行找回密码操作
      if (emailResults.length > 0 || phoneNumberResults.length > 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ message: '该邮箱或手机号已被注册，请尝试找回密码。' });
      }

      // 生成用户ID
      const userId = uuidv4();
  
      // 执行插入用户数据的SQL语句
      const insertUserQuery = `
        INSERT INTO users (user_id, user_name, password, email, telphone, user_type, created_at, updated_at)
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
