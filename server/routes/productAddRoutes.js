// productAddRoutes.js
const express = require('express');
const { pool } = require('../database');

const router = express.Router();

// 添加产品的路由
router.post('/add-product', async (req, res) => {
    try {
        const newProduct = req.body;
        const params = [
            newProduct.product_name,
            newProduct.price,
            newProduct.manufacturer,
            newProduct.raw_material,
            newProduct.product_desc
        ];

        const connection = await pool.getConnection();

        const sql = `
            INSERT INTO products (product_name, price, manufacturer, raw_material, product_desc)
            VALUES (?, ?, ?, ?, ?);
        `;

        // 在这里执行插入数据库的操作
        const results = await connection.query(sql, params);

        if (results[0].affectedRows === 0) {
            res.status(404).json({ success: false, message: '添加失败' });
        } else {
            res.status(200).json({ success: true, message: '添加成功' });
        }
    } catch (error) {
        console.error('添加产品信息错误:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
