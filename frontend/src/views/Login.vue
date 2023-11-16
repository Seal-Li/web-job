<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <el-form :model="loginForm" label-width="80px" ref="loginData" class="login-form">
        <el-form-item label="账号" prop="account" :rules="rules.accountRules">
          <el-input v-model="loginForm.account" placeholder="请输入注册手机号或邮箱" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="rules.passwordRules">
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
import axios from 'axios';
import { useRouter } from 'vue-router';
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';

export default defineComponent({
  mounted() {
    // 将 body 的 margin 设置为 0
    document.body.style.margin = '0';
  },
  setup() {
    const router = useRouter();
    const userStore = useAuthStore(); // 获取 user store 实例

    const loginForm = reactive({
      account: '15965825404',
      password: 'Lhb123!',
      remember: false,
    });

    // TODO: 记住密码功能待实现
    // 尝试从 localStorage 中获取保存的用户信息
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      loginForm.account = storedUsername;
      loginForm.remember = true;
    }

    const rules = reactive({
      accountRules: [
        {
          required: true,
          message: '请输入注册邮箱或手机号',
          trigger: 'blur',
        },
        {
          pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{6,16}$/,
          message: '只能使用英文字符和数字',
          trigger: 'blur',
        },
      ],
      passwordRules: [
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        },
        {
          min: 6,
          max: 16,
          message: '密码长度必须是6-16位',
          trigger: 'blur',
        },
        {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])/,
          message: '密码必须同时包含大小写字母',
          trigger: 'blur',
        },
      ],
    });

    const isLoginFormValid = computed(() => {
      return (
        loginForm &&
        loginForm.account &&
        typeof loginForm.account === 'string' &&
        loginForm.account.trim() !== '' &&
        loginForm.password &&
        typeof loginForm.password === 'string' &&
        loginForm.password.trim() !== ''
      );
    });

    const login = async () => {
      try {
        const response = await axios.post('/login', {
          account: loginForm.account,
          password: loginForm.password,
        });

        // 更新用户信息
        userStore.setUserid(response.data.user.user_id);
        userStore.setUsername(response.data.user.user_name);
        userStore.setEmail(response.data.user.email);
        userStore.setTelphone(response.data.user.telphone);
        userStore.setUsertype(response.data.user.user_type);
        userStore.setMoney(response.data.user.money);

        // 更新登录状态
        userStore.login();

        // 如果勾选了记住密码，保存用户名到 localStorage
        if (loginForm.remember) {
          localStorage.setItem('account', loginForm.account);
          localStorage.setItem('password', loginForm.password);
        } else {
          localStorage.removeItem('account');
          localStorage.setItem('password', loginForm.password);
        }

        // 导航到首页或执行其他操作
        router.push('/home');
      } catch (error) {
        console.error('登录失败，账号或密码错误！', error);
      }
    };

    return {
      loginForm,
      rules,
      isLoginFormValid,
      login,
    };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  background: url('../static/bgpic.jpg') center/cover no-repeat; /* 替换为你的背景图片 URL */
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
