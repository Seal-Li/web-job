<!-- Register.vue -->

<template>
  <div class="register-container">
    <el-form :model="registerForm" :rules="registerRules" label-width="120px" ref="registerForm" class="register-form">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="registerForm.username" placeholder="Enter your username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="Enter your password" clearable></el-input>
      </el-form-item>
      <el-form-item label="再次输入密码" prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" type="password" placeholder="Confirm your password" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="registerForm.email" placeholder="Enter your email" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户类型" prop="userType" class="user-type-item">
        <el-select v-model="registerForm.userType" placeholder="Select User Type">
          <el-option label="Customer" value="Customer"></el-option>
          <el-option label="Dealer" value="Dealer"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="phoneNumber">
        <el-input v-model="registerForm.phoneNumber" placeholder="Enter your phone number" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!isRegisterFormValid" @click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      registerForm: {
        username: 'ZhangSan01',
        password: 'Test1234!',
        confirmPassword: 'Test1234!',
        userType: 'Customer', // 初始值为 "Customer"
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
    async register() {
      try {
        // console.log('Sending request with data:', this.registerForm); // 输出发送的请求数据
        // 发送注册数据到后端
        const response = await axios.post('http://localhost:3000/register', this.registerForm);

        // 处理后端返回的结果
        // console.log(response.data.message); // 输出后端返回的消息
        
        // 注册成功后的处理，例如跳转到登录页面
        this.$router.push('/');
      } catch (error) {
        console.error('注册失败', error);

        // 处理注册失败的情况，例如显示错误消息
        // this.errorMessage = '注册失败，请检查输入是否正确';
      }
    },
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

.user-type-item .el-select {
  width: 100%; /* 或者设置与其他输入框一致的具体宽度 */
}
</style>
