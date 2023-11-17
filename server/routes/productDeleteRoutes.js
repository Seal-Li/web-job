const express = require('express');
const { pool } = require('../database');

const router = express.Router();

// 删除产品的路由
router.post('/delete-product', async (req, res) => {
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

module.exports = router;
