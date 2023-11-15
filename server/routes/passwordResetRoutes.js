const express = require('express');
const { pool } = require('../database');
const md5 = require('md5');

const router = express.Router();

// 处理重置密码的路由
router.post('/reset-password', async (req, res) => {
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

module.exports = router;
