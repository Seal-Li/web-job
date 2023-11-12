<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <el-form :model="loginForm" label-width="80px" ref="loginForm" class="login-form">
        <el-form-item label="账号" prop="username" :rules="usernameRules">
          <el-input v-model="loginForm.username" placeholder="请输入注册的手机号或邮箱" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="passwordRules">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox class="remember-psw" v-model="loginForm.remember">记住密码</el-checkbox>
          <router-link class="forget-link" to="/forget-password">找回密码</router-link>
          <router-link class="register-link" to="/register">注册账号</router-link>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" :disabled="!isLoginFormValid" @click="loginCheck">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false,
      },
      usernameRules: [
        { 
          required: true, 
          message: '请输入注册的手机号或密码', 
          trigger: 'blur' 
        },
        { 
          pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{6,12}$/, 
          message: '只能使用英文字符和数字', 
          trigger: 'blur' 
        }
      ],
      passwordRules: [
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        },
        {
          validator: this.validatePassword,
          trigger: 'blur',
        },
      ],
    };
  },
  computed: {
    isLoginFormValid() {
      return this.loginForm.username.trim() !== '' && this.loginForm.password.trim() !== '';
    }
  },
  methods: {
    validatePassword(rule, value, callback) {
      // 密码规则验证逻辑
      const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/.test(value);
      isValidPassword ? callback() : callback(new Error('密码必须同时包含大写字母、小写字母、数字和特殊符号，长度在6-16位之间'));
    },
    async loginCheck() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          username: this.loginForm.username,
          password: this.loginForm.password,
        });

        console.log(response.data.message);

        if (response.data.success) {
          // 如果勾选了记住密码，保存密码到本地存储
          if (this.loginForm.remember) {
            localStorage.setItem('rememberedPassword', this.loginForm.password);
          }

          this.$message.success('登录成功');
          this.$router.push('/');
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('登录失败', error);
        this.$message.error('登录失败，请稍后再试');
      }
    }
  },
  created() {
    // 在组件创建时检查本地存储中是否有勾选记住密码的状态
    const rememberStatus = localStorage.getItem('rememberStatus');
    if (rememberStatus) {
      this.loginForm.remember = rememberStatus === 'true'; // 将字符串转换为布尔值
    }

    // 如果勾选了记住密码，从本地存储中获取密码并填充到密码输入框
    if (this.loginForm.remember) {
      const rememberedPassword = localStorage.getItem('rememberedPassword');
      if (rememberedPassword) {
        this.loginForm.password = rememberedPassword;
      }
    }
  },
  watch: {
    // 监听勾选状态的变化，更新本地存储中的状态
    'loginForm.remember'(val) {
      localStorage.setItem('rememberStatus', val.toString());
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-form {
  width: 100%;
}

.login-btn {
  width: 100%;
}

.forget-link {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  margin-left: 40px;
}

.register-link {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  margin-left: 40px;
}
</style>
