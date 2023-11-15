// productSearchRoutes.js
const express = require('express');
const { pool } = require('../database');

const router = express.Router();

// 获取相关产品的路由，支持价格范围搜索
router.get('/search-products', async (req, res) => {
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

module.exports = router;
