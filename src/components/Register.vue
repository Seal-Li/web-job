<!-- Register.vue -->

<template>
    <div class="register-container">
      <el-form :model="registerForm" :rules="registerRules" label-width="80px" ref="registerForm" class="register-form">
        <el-form-item label="Username" prop="username">
          <el-input v-model="registerForm.username" placeholder="Enter your username" clearable></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="Enter your password" clearable></el-input>
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="Confirm your password" clearable></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="registerForm.email" placeholder="Enter your email" clearable></el-input>
        </el-form-item>
        <el-form-item label="Phone Number" prop="phoneNumber">
          <el-input v-model="registerForm.phoneNumber" placeholder="Enter your phone number" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!isRegisterFormValid" @click="register">Register</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        registerForm: {
          username: 'ZhangSan01',
          password: 'Test1234!',
          confirmPassword: 'Test1234!',
          email: 'example@163.com',
          phoneNumber: '13456789000'
        },
        registerRules: {
          username: [
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
          password: [
            { 
                required: true, 
                message: 'Please enter your password', 
                trigger: 'blur' 
            },
            // Add other password validation rules as needed
          ],
          confirmPassword: [
            { 
                required: true, 
                message: 'Please confirm your password', 
                trigger: 'blur' 
            },
            { 
                validator: this.validateConfirmPassword, 
                trigger: 'blur' 
            }
          ],
          email: [
            { 
                required: true, 
                message: 'Please enter your email', 
                trigger: 'blur' 
            },
            { 
                type: 'email', 
                message: 'Please enter a valid email address', 
                trigger: ['blur', 'change'] 
            }
          ],
          phoneNumber: [
            { 
                required: true, 
                message: 'Please enter your phone number', 
                trigger: 'blur' 
            },
            // /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/
            { 
          pattern: /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/, 
          message: '请输入有效的手机号码', 
          trigger: 'blur' 
        }
          ]
        }
      };
    },
    computed: {
      isRegisterFormValid() {
        return this.registerForm.username.length && this.registerForm.password.length && this.registerForm.confirmPassword.length && this.registerForm.email.length && this.registerForm.phoneNumber.length ;
      }
    },
    methods: {
      validateConfirmPassword(rule, value, callback) {
        if (value !== this.registerForm.password) {
          callback(new Error('两次输入的密码不匹配'));
        } else {
          callback();
        }
      },
      register() {
        if (this.isRegisterFormValid) {
          console.log('Registration successful');
          // Perform registration logic, e.g., send data to server
        } else {
          console.error('Registration failed. Please check your inputs.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .register-form {
    width: 400px;
  }
  
  .register-form .el-form-item {
    margin-bottom: 20px;
  }
  </style>
  