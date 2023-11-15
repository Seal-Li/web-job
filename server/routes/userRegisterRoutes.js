const express = require('express');
const { pool } = require('../database');
const { v4: uuidv4 } = require('uuid');
const md5 = require('md5');

const router = express.Router();

// 注册用户的路由
router.post('/register', async (req, res) => {
    const { username, password, confirmPassword, email, userType, phoneNumber } = req.body;
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
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;

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

module.exports = router;
