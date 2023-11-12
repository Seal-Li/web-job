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
  export default {
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
            { required: true, message: '请输入注册的手机或邮箱', trigger: 'blur' },
            // Add custom validation rule for account existence check
            { validator: this.validateAccountExistence, trigger: 'blur' },
          ],
          verificationCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            // Add custom validation rule for verification code check
            { validator: this.validateVerificationCode, trigger: 'blur' },
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            // Add custom validation rule for password check
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
        // Add additional conditions as needed
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
        // Implement account existence check logic
        // You may need to make a request to the backend to check if the account exists
        // If exists, call callback(); otherwise, call callback(new Error('账号不存在'));
        // Example: Assume there's a function checkAccountExistence in your API
        // const exists = await checkAccountExistence(value);
        // exists ? callback() : callback(new Error('账号不存在'));
      },
      validateVerificationCode(rule, value, callback) {
        // Implement verification code validation logic
        // Example: Check if the entered code matches the generated code
        // const isValid = value === this.verificationCode;
        // isValid ? callback() : callback(new Error('验证码错误'));
      },
      validatePassword(rule, value, callback) {
        // Implement password validation logic
        // Example: Check if the password meets your criteria
        // const isValidPassword = ...; // Implement your password criteria check
        // isValidPassword ? callback() : callback(new Error('密码不符合要求'));
      },
      validateConfirmPassword(rule, value, callback) {
        // Implement confirm password validation logic
        // Example: Check if the confirm password matches the new password
        // const isMatch = value === this.formData.newPassword;
        // isMatch ? callback() : callback(new Error('两次输入的密码不一致'));
      },
      generateVerificationCode() {
        // Generate a random number between 0 and 1
        const randomValue = Math.random();
        // Convert the random number to base 36 and take the last 6 characters
        this.verificationCode = randomValue.toString(36).substr(-6).toUpperCase();
      },
      resetPassword() {
        // Implement the logic to reset the password
        // Call your backend API to update the password in the database
        // Example: Assume there's a function resetPassword in your API
        // await resetPassword(this.formData.account, this.formData.newPassword);
        this.$message.success('密码重置成功');
        this.$router.push('/login');
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
}

.form-container {
  width: 400px;
  border: 1px solid #ebeef5;
  padding: 20px;
  border-radius: 5px;
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
  width: 120px; /* Adjust width as needed */
}

.refresh-hint {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
  cursor: pointer;
}
</style>