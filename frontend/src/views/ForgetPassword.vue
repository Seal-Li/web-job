<template>
  <div class="forget-password-container">
    <div class="form-container">
      <el-form :model="formData" :rules="formRules" ref="forgetForm" label-width="120px">
        <el-form-item label="手机号或邮箱" prop="account">
          <el-input v-model="formData.account" clearable></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verificationCode">
          <div class="verification-code-container">
            <el-input v-model="formData.verificationCode" clearable></el-input>
            <el-button class="verification-code-btn" @click="generateVerificationCode">
              {{ verificationCode }}
            </el-button>
          </div>
          <p class="refresh-hint" @click="generateVerificationCode">点击刷新验证码</p>
        </el-form-item>
        <el-form-item label="输入新密码" prop="newPassword">
          <el-input v-model="formData.newPassword" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{ width: '100%' }" :disabled="!isFormValid" @click="resetPassword">确认重置</el-button>
        </el-form-item>
      </el-form>
    </div>
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
      formData: {
        account: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: '',
      },
      verificationCode: '',
      formRules: {
        account: [
          { required: true, message: '请输入注册的手机号或邮箱', trigger: 'blur' },
          // 添加账号存在性验证
          { validator: this.validateAccountExistence, trigger: 'blur' },
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          // 添加验证码验证规则
          { validator: this.validateVerificationCode, trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          // 添加密码验证规则
          { validator: this.validatePassword, trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.account &&
        this.formData.verificationCode &&
        this.formData.newPassword &&
        this.formData.confirmPassword
      );
    },
  },
  methods: {
    validateAccountExistence(rule, value, callback) {
      axios.post('/check-account-existence', { account: value })
        .then(response => {
          if (response.data.exists) {
            callback();
          } else {
            callback(new Error('账号不存在'));
          }
        })
        .catch(error => {
          console.error('Error checking account existence', error);
        });
    },
    validateVerificationCode(rule, value, callback) {
      const isValid = value === this.verificationCode;
      isValid ? callback() : callback(new Error('验证码错误'));
    },
    validatePassword(rule, value, callback) {
      const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/.test(value);
      isValidPassword ? callback() : callback(new Error('密码必须同时包含大写字母、小写字母、数字和特殊符号，长度在6-16位之间'));
    },
    validateConfirmPassword(rule, value, callback) {
      const isMatch = value === this.formData.newPassword;
      isMatch ? callback() : callback(new Error('两次输入的密码不一致'));
    },
    generateVerificationCode() {
      const randomValue = Math.random();
      this.verificationCode = randomValue.toString(36).substr(-6).toUpperCase();
    },
    async resetPassword() {
      try {
        const response = await axios.post('/reset-password', {
          account: this.formData.account,
          newPassword: this.formData.newPassword,
        });

        console.log(response.data.message);

        if (response.data.success) {
          this.$message.success('密码重置成功');
          this.$router.push('/');
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('密码重置失败', error);
        this.$message.error('密码重置失败，请稍后再试');
      }
    },
  },
};
</script>

<style scoped>
.forget-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  background: url('../static/bgpic.jpg') center/cover no-repeat;
}

.form-container {
  position: relative; /* 确保容器相对于父容器定位 */
  z-index: 1; /* 将容器的 z-index 设为 1，使其位于背景图片上方 */
  width: 400px;
  border: 1px solid #ebeef5; /* 边框样式，可以根据需要调整颜色和宽度 */
  padding: 20px;
  border-radius: 5px; /* 可选，添加圆角效果 */
  background: rgba(255, 255, 255, 0.8); /* 背景颜色，可以根据需要调整透明度 */
}

.el-form-item__label {
  white-space: nowrap;
}

.verification-code-container {
  display: flex;
}

.verification-code-btn {
  margin-left: 10px;
  background-color: #f5f7fa;
  width: 120px; /* 调整宽度，根据需要修改 */
}

.refresh-hint {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
  cursor: pointer;
}
</style>