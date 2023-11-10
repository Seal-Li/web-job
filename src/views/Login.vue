<!-- Login.vue -->
<template>
  <div class="login-container">
    <el-form :model="loginForm" label-width="80px" ref="loginForm" class="login-form">
      <el-form-item label="Username" prop="username" :rules="usernameRules">
        <el-input v-model="loginForm.username" placeholder="Enter your username" clearable></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password" :rules="passwordRules">
        <el-input v-model="loginForm.password" type="password" placeholder="Enter your password" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!isLoginFormValid" @click="login">Login</el-button>
      </el-form-item>
      <div class="login-links">
        <!-- 在这里添加注册按钮，点击后跳转到注册页面 -->
        <router-link to="/register">Register</router-link>
        <!-- <el-button type="text" @click="goToRegister">Register</el-button> -->
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'ZhangSan',
        password: 'Test123456!',
        
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
      return "" != this.loginForm.username && "" != this.loginForm.password;
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
    },
    goToRegister() {
    this.$router.push('/register');
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

.login-form {
  width: 300px;
}

.login-links {
  margin-top: 10px;
  text-align: center;
}

.login-links a {
  margin: 0 10px;
  color: #409eff;
  text-decoration: underline;
}

.divider {
  margin: 0 5px;
  color: #ccc;
}
</style>
