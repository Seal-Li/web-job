const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const config = require('./config/config.js'); // 引入配置文件
const md5 = require('md5');


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

// 用户登录的路由
app.post('/login', async (req, res) => {
  const { account, password } = req.body;
  
  try {
    const connection = await pool.getConnection();
    const hashedPassword = md5(password); // 使用 md5 对密码进行加密
    // 查询用户是否存在
    const userExistsQuery = 'SELECT * FROM users WHERE email = ? OR telphone = ?';
    const [userResults] = await connection.execute(userExistsQuery, [account, account]);

    // 如果用户不存在，返回错误消息
    if (userResults.length === 0) {
      connection.release();
      return res.status(401).json({ success: false, message: '用户不存在' });
    }

    const user = userResults[0];

    // 检查密码是否存在
    if (!user.password) {
      connection.release();
      return res.status(401).json({ success: false, message: '用户密码不存在' });
    }

    // 使用 md5 比对密码
    const isPasswordValid = hashedPassword === user.password;


    if (!isPasswordValid) {
      connection.release();
      return res.status(401).json({ success: false, message: '密码错误' });
    }

    connection.release();
    return res.status(200).json({ success: true, message: '登录成功' });
  } catch (error) {
    console.error('登录失败', error);
    return res.status(500).json({ success: false, message: `登录失败: ${error.message || error}` });
  }
});


// 注册用户的路由
app.post('/register', async (req, res) => {
  const { username, password, confirmPassword, email, userType, phoneNumber } = req.body;
  console.log("userid has genereate")
  console.log(req.body);
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    // 检查邮箱是否已存在
    const emailExistsQuery = 'SELECT * FROM users WHERE email = ?';
    const [emailResults] = await connection.execute(emailExistsQuery, [email]);

    // 检查手机号是否已存在
    const phoneNumberExistsQuery = 'SELECT * FROM users WHERE telphone = ?';
    const [phoneNumberResults] = await connection.execute(phoneNumberExistsQuery, [phoneNumber]);

    // 如果邮箱或手机号已存在，提示用户执行找回密码操作
    if (emailResults.length > 0 || phoneNumberResults.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ success: false, message: '该邮箱或手机号已被注册，请尝试找回密码。' });
    }

    // 生成用户ID
    const userId = uuidv4();

    const hashedPassword = md5(password); // 使用 md5 对密码进行加密

    // 执行插入用户数据的SQL语句
    const insertUserQuery = `
      INSERT INTO users (user_id, user_name, password, email, telphone, user_type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    await connection.execute(insertUserQuery, [userId, username, hashedPassword, email, phoneNumber, userType]);

    // await connection.execute(insertUserQuery, [userId, username, password, email, phoneNumber, userType]);

    await connection.commit();
    connection.release();

    res.status(201).json({ success: true, message: '注册成功' });
  } catch (error) {
    console.error('注册失败', error);
    res.status(500).json({ success: false, message: `注册失败: ${error.message || error}` });
  }
});


// 处理重置密码的路由
app.post('/reset-password', async (req, res) => {
  const { account, newPassword } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    // 查询用户是否存在
    const userExistsQuery = 'SELECT * FROM users WHERE email = ? OR telphone = ?';
    const [userResults] = await connection.execute(userExistsQuery, [account, account]);

    // 如果用户不存在，返回错误消息
    if (userResults.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ success: false, message: '用户不存在，请检查输入的账号' });
    }

    const hashedNewPassword = md5(newPassword); // 使用 md5 对新密码进行加密
    // 执行更新密码的SQL语句
    const updatePasswordQuery = 'UPDATE users SET password = ?, updated_at = NOW() WHERE email = ? OR telphone = ?';
    await connection.execute(updatePasswordQuery, [hashedNewPassword, account, account]);


    await connection.commit();
    connection.release();

    res.status(200).json({ success: true, message: '密码重置成功' });
  } catch (error) {
    console.error('密码重置失败', error);
    res.status(500).json({ success: false, message: `密码重置失败: ${error.message || error}` });
  }
});

// 处理检查账号是否存在的路由
app.post('/check-account-existence', async (req, res) => {
  const { account } = req.body;

  try {
    const connection = await pool.getConnection();

    // 查询用户是否存在
    const userExistsQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ? OR telphone = ?';
    const [result] = await connection.execute(userExistsQuery, [account, account]);

    connection.release();

    // 如果 count 大于 0，说明账号存在，返回成功
    const exists = result[0].count > 0;
    res.status(200).json({ exists });
  } catch (error) {
    console.error('Error checking account existence', error);
    res.status(500).json({ exists: false, message: `检查账号是否存在失败: ${error.message || error}` });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});