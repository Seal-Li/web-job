<!-- Login.vue -->

<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <el-form :model="loginForm" label-width="80px" ref="loginForm" class="login-form">
        <el-form-item label="用户名" prop="username" :rules="usernameRules">
          <el-input v-model="loginForm.username" placeholder="请输入账号" clearable></el-input>
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
          <el-button class="login-btn" type="primary" :disabled="!isLoginFormValid" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
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
          message: '请输入账号', 
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
          trigger: 'blur' 
        },
        { 
          min: 6, 
          max: 16, 
          message: 'Password length must be between 6 and 16 characters', 
          trigger: 'blur' 
        },
        { 
          pattern: /^(?=.*[a-z])(?=.*[A-Z])/, 
          message: '密码必须同时包含大小写字母', 
          trigger: 'blur' 
        }
      ]
    };
  },
  computed: {
    isLoginFormValid() {
      return this.loginForm.username.trim() !== '' && this.loginForm.password.trim() !== '';
    }
  },
  watch: {
    'loginForm.remember': {
      handler(newValue) {
        // 如果勾选了记住密码，则将密码保存到本地存储
        if (newValue) {
          localStorage.setItem('rememberedPassword', this.loginForm.password);
          localStorage.setItem('rememberedUsername', this.loginForm.username);
        } else {
          // 如果取消勾选记住密码，则清除本地存储的密码
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('rememberedUsername');
        }
      },
      immediate: true // 立即触发，以便在组件加载时执行
    }
  },
  created() {
    // 在组件创建时，尝试从本地存储中获取记住的密码
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    const rememberedUsername = localStorage.getItem('rememberedUsername');

    if (rememberedPassword && rememberedUsername) {
      this.loginForm.password = rememberedPassword;
      this.loginForm.username = rememberedUsername;
      this.loginForm.remember = true;
    }
  },
  methods: {
    login() {
      // 执行登录逻辑
      if (this.isLoginFormValid) {
        console.log('Login successful');
        // 导航到首页或执行其他操作
        this.$router.push('/register');
      } else {
        console.error('Login failed. Please check your credentials.');
      }
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
  position: relative;
  background: url('your-background-image-url.jpg') center/cover no-repeat; /* 替换为你的背景图片 URL */
}

.login-card {
  position: relative; /* 确保卡片相对于父容器定位 */
  z-index: 1; /* 将卡片的 z-index 设为 1，使其位于背景图片上方 */
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
