<!-- Login.vue -->
<template>
    <div class="login-container">
      <el-form :model="loginForm" :rules="loginRules" label-width="80px" ref="loginForm" class="login-form">
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
          <router-link to="/forgot-password">Forgot Password</router-link>
          <span class="divider">|</span>
          <router-link to="/register">Register</router-link>
        </div>
      </el-form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        isLoginFormValid: false,
        usernameRules: [
          { required: true, message: 'Please enter your username', trigger: 'blur' },
          { pattern: /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/, message: 'Username can only contain letters, numbers, and underscores', trigger: 'blur' }
        ],
        passwordRules: [
          { required: true, message: 'Please enter your password', trigger: 'blur' },
          { min: 6, max: 16, message: 'Password length must be between 6 and 16 characters', trigger: 'blur' },
          { pattern: /^(?=.*[a-z])(?=.*[A-Z])/, message: 'Password must contain both lowercase and uppercase letters', trigger: 'blur' }
        ]
      };
    },
    computed: {
      isLoginFormValid() {
        return this.$refs.loginForm && this.$refs.loginForm.validate();
      }
    },
    methods: {
      login() {
        // Perform login logic here
        if (this.isLoginFormValid) {
          console.log('Login successful');
          // Redirect to home page or perform other actions
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
  