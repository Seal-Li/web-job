const express = require('express');
const { pool } = require('../database');

const router = express.Router();

// 处理检查账号是否存在的路由
router.post('/check-account-existence', async (req, res) => {
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

module.exports = router;
