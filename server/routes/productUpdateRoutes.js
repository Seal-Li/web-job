const express = require('express');
const { pool } = require('../database');

const router = express.Router();

// 管理员更新数据的路由
router.post('/update-product', async (req, res) => {
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

module.exports = router;
