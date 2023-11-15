const express = require('express');
const { pool } = require('../database');
const md5 = require('md5');

const router = express.Router();

// 用户登录的路由
router.post('/login', async (req, res) => {
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

module.exports = router;