<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <el-form :model="loginForm" label-width="80px" ref="loginForm" class="login-form">
        <el-form-item label="用户名" prop="username" :rules="usernameRules">
          <el-input v-model="loginForm.username" placeholder="Enter your username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="passwordRules">
          <el-input v-model="loginForm.password" type="password" placeholder="Enter your password" clearable></el-input>
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
        username: 'ZhangSan',
        password: 'Test123456!',
        remember: false,
      },
      usernameRules: [
        { 
          required: true, 
          message: 'Please enter your username', 
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
          message: 'Please enter your password', 
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
  methods: {
    login() {
      // Perform login logic here
      if (this.isLoginFormValid) {
        console.log('Login successful');
        // Redirect to home page or perform other actions
        this.$router.push('/'); // Use $router to navigate to the home page
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
