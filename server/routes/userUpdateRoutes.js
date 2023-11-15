// userUpdateRoutes.js
const express = require('express');
const { pool } = require('../database');

const router = express.Router();

// 修改用户信息路由
router.post('/update-user-info', async (req, res) => {
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

module.exports = router;
