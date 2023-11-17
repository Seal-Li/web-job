const express = require('express');
const { pool } = require('../database');

const router = express.Router();

// 添加获取所有产品的路由
router.get('/all-products', async (req, res) => {
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

module.exports = router;
