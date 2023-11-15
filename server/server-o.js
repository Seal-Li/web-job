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
    console.log(user);
    connection.release();
    return res.status(200).json({ 
      success: true, 
      message: '登录成功',
      user: user 
    });
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


// 添加获取所有产品的路由
app.get('/all-products', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // 从请求参数中获取页码和每页条目数，默认为第一页，每页10条记录
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // 计算偏移量
    const offset = (page - 1) * limit;

    // 执行查询所有产品的SQL语句，并添加 LIMIT 子句来进行分页
    const query = 'SELECT * FROM products LIMIT ?, ?';
    const [products] = await connection.execute(query, [offset, limit]);

    // 获取总记录数，用于前端分页控制
    const countQuery = 'SELECT COUNT(*) as count FROM products';
    const [countResult] = await connection.execute(countQuery);
    const totalProducts = countResult[0].count;

    connection.release();

    res.status(200).json({ success: true, products, totalProducts });
  } catch (error) {
    console.error('Error fetching all products', error);
    res.status(500).json({ success: false, message: `获取所有产品失败: ${error.message || error}` });
  }
});


// 获取相关产品的路由，支持价格范围搜索
app.get('/search-products', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // 从请求参数中获取页码、每页条目数、关键字和价格范围，默认为第一页，每页10条记录
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || '';
    const minPrice = req.query.minPrice; // 注意：这里不需要转换为整数
    const maxPrice = req.query.maxPrice; // 同上

    // 计算偏移量
    const offset = (page - 1) * limit;

    // 构建基础的查询语句
    let query = 'SELECT * FROM products WHERE 1 = 1';

    // 添加关键字搜索条件
    if (keyword) {
      query += ' AND (product_name LIKE ? OR manufacturer LIKE ? OR raw_material LIKE ? OR product_desc LIKE ?) ';
    }

    // 添加价格范围搜索条件
    if (minPrice !== undefined && maxPrice !== undefined) {
      query += ' AND price BETWEEN ? AND ? ';
    }

    // 在这里拦截计算不分页时的查询语句
    query_unlimit = query;
    
    // 添加分页查询条件
    query += ' LIMIT ?, ?';

    // 构建查询参数数组
    const queryParams = [];
    const query_unlimitParams = [];
    if (keyword) {
      const keywordParam = `%${keyword}%`;
      queryParams.push(keywordParam, keywordParam, keywordParam, keywordParam);
      query_unlimitParams.push(keywordParam, keywordParam, keywordParam, keywordParam);
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
      // TODO: minPrice = 0时，条件失效
      queryParams.push(minPrice, maxPrice);
      query_unlimitParams.push(minPrice, maxPrice);
    }
    queryParams.push(offset, limit);

    // 执行查询
    const [products] = await connection.execute(query, queryParams);

    // 计算满足条件的产品总记录数，用于前端分页控制
    const [productsAll] = await connection.execute(query_unlimit, query_unlimitParams);
    const totalProducts = productsAll.length;
    // console.log("结果总数：", totalProducts)

    connection.release();

    res.status(200).json({ success: true, products, totalProducts });
  } catch (error) {
    console.error('Error fetching all products', error);
    res.status(500).json({ success: false, message: `获取所有产品失败: ${error.message || error}` });
  }
});

// 修改用户信息路由
app.post('/update-user-info', async (req, res) => {
  const { userid, username, telphone, email, usertype } = req.body;

  const connection = await pool.getConnection();
  // 在这里进行用户身份验证，确保用户有权限更新信息（例如，检查登录状态、检查用户 ID）

  query = 'UPDATE users SET user_name=?, telphone=?, email=?, user_type=? WHERE user_id=?';

  try {
    // 更新数据库中的用户信息
    const updateResult = await connection.execute(query, [username, telphone, email, usertype, userid]);
    connection.release();

    if (updateResult[0].affectedRows > 0) {
      // 更新成功
      res.status(200).json({ success: true, message: '更新完成'});
    } else {
      // 更新失败
      res.status(500).json({ success: false, message: '更新失败' });
    }
  } catch (error) {
    console.error('数据库更新失败', error);
    res.status(500).json({ success: false });
  }
});

// 管理员更新数据的路由
app.post('/update-product', async (req, res) => {
  try {
    const { product_id, product_name, price, manufacturer, raw_material, product_desc } = req.body;

    // 在此处执行更新数据库的逻辑
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE products SET product_name = ?, price = ?, manufacturer = ?, raw_material = ?, product_desc=? WHERE product_id = ?',
      [product_name, price, manufacturer, raw_material, product_desc, product_id]
    );
    connection.release();

    // 检查更新是否成功
    if (result.affectedRows === 1) {
      res.status(200).json({ success: true, message: '更新成功'});
    } else {
      res.status(500).json({ success: false, message: '更新失败' });
    }
  } catch (error) {
    console.error('更新用户信息时出错：', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除产品的路由
app.post('/delete-product', async (req, res) => {
  try {
    const productIdToDelete = req.body.product_id;
    const connection = await pool.getConnection();

    // 构建 SQL 查询
    const sql = 'DELETE FROM products WHERE product_id = ?';

    // 执行 SQL 查询
    const results = await connection.query(sql, [productIdToDelete]);

    if (results[0].affectedRows === 0) {
      res.status(404).json({ success: false, message: '未找到该产品' });
    } else {
      res.status(200).json({ success: true, message: '已删除该产品' });
    }
  } catch (error) {
    console.error('删除产品时出错:', error);
    res.status(500).json({ error: '删除产品时出错' });
  }
});


// 添加产品的路由
app.post('/add-product', async (req, res) => {
  try {
    const newProduct = req.body;
    params = [newProduct.product_name, newProduct.price, newProduct.manufacturer, newProduct.raw_material, newProduct.product_desc];
    console.log("newProduct:", params);

    const connection = await pool.getConnection();

    const sql = 
      `insert into products (product_name, price, manufacturer, raw_material, product_desc) 
      values (?, ?, ?, ?, ?);`;

    // 在这里执行插入数据库的操作
    const results = await connection.query(sql, params);

    if (results[0].affectedRows === 0) {
      res.status(404).json({ success: false, message: '添加失败' });
    } else {
      res.status(200).json({ success: true, message: '添加成功' });
    }
    // res.json({ success: true, message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});