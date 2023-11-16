<template>
  <div class="register-container">
    <el-form :model="registerForm" :rules="registerRules" label-width="120px" ref="registerForm" class="register-form">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="registerForm.username" placeholder="请输入用户名" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="再次输入密码" prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" type="password" placeholder="再次输入密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="registerForm.email" placeholder="请输入邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户类型" prop="userType" class="user-type-item">
        <el-select v-model="registerForm.userType" placeholder="请选择你的用户类型">
          <el-option label="消费者" value="Customer"></el-option>
          <el-option label="经销商" value="Dealer"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="phoneNumber">
        <el-input v-model="registerForm.phoneNumber" placeholder="请输入手机号" clearable></el-input>
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
  mounted() {
    // 将 body 的 margin 设置为 0
    document.body.style.margin = '0';
  },
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        userType: 'Customer', // 初始值为 "Customer"
        email: '',
        phoneNumber: '',
      },
      registerRules: {
        username: [
          { 
              required: true, 
              message: '请输入用户名', 
              trigger: 'blur' 
          },
          { 
              pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{3,12}$/, 
              message: '只能使用3-12位英文字符和数字', 
              trigger: 'blur' 
          }
        ],
        password: [
          { 
              required: true, 
              message: '请输入你的密码', 
              trigger: 'blur' 
          },
          { 
              validator: this.validatePassword, 
              trigger: 'blur' 
          },
        ],
        confirmPassword: [
          { 
              required: true, 
              message: '再次输入密码', 
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
              message: '输入你的邮箱', 
              trigger: 'blur' 
          },
          { 
              type: 'email', 
              message: '请输入有效的邮箱', 
              trigger: ['blur', 'change'] 
          }
        ],
        phoneNumber: [
          { 
              required: true, 
              message: '请输入你的手机号', 
              trigger: 'blur' 
          },
          { 
              pattern: /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/, 
              message: '请输入有效的手机号码', 
              trigger: 'blur' 
          }
        ]
      },
      registrationError: '',
    };
  },
  computed: {
    isRegisterFormValid() {
      return (
        this.registerForm.username.length &&
        this.registerForm.password.length &&
        this.registerForm.confirmPassword.length &&
        this.registerForm.email.length &&
        this.registerForm.phoneNumber.length
      );
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
    validatePassword(rule, value, callback) {
      // 密码规则验证逻辑
      const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/.test(value);
      isValidPassword ? callback() : callback(new Error('密码必须同时包含大写字母、小写字母、数字和特殊符号，长度在6-16位之间'));
    },
    async register() {
      try {
        // 发送注册数据到后端
        const response = await axios.post('/register', this.registerForm);

        // 处理后端返回的结果
        if (response.data.success) {
          this.$message.success('注册成功!');
          this.$router.push('/');
        } else {
          // 注册失败，保存错误消息
          this.registrationError = response.data.message || '注册失败'; 
          this.$message.error('注册失败: ');
        }
      } catch (error) {
        // 处理注册失败的情况，例如显示错误消息
        this.registrationError = '注册失败: ' + (error.message || error);
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
  position: relative;
  background: url('../static/bgpic.jpg') center/cover no-repeat; 
}

.register-form {
  position: relative; /* 确保表单相对于父容器定位 */
  z-index: 1; /* 将表单的 z-index 设为 1，使其位于背景图片上方 */
  width: 400px;
  padding: 20px;
  border: 1px solid #ebeef5; /* 边框样式，可以调整颜色和宽度 */
  border-radius: 5px; /* 可选，添加圆角效果 */
  background: rgba(255, 255, 255, 0.8); /* 背景颜色，可以调整透明度 */
}

.register-form .el-form-item {
  margin-bottom: 20px;
}

.user-type-item .el-select {
  width: 100%;
}
</style>
