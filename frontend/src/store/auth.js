import { defineStore } from 'pinia';

// 定义 useUserStore
export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userid: '',
    username: '',
    email: '',
    telphone: '',
    usertype: '',
    money: '',
  }),
  actions: {
    login() {
      // 登录逻辑...
      this.isLoggedIn = true;
    },
    logout() {
      // 注销逻辑...
      this.isLoggedIn = false;
    },
    setUserid(newUserid) {
      this.userid = newUserid;
    },
    setUsername(newUsername) {
      this.username = newUsername;
    },
    setEmail(newEmail) {
      this.email = newEmail;
    },
    setTelphone(newTelphone) {
      this.telphone = newTelphone;
    },
    setUsertype(newUsertype) {
      this.usertype = newUsertype;
    },
    setMoney(newMoney) {
      this.money = newMoney;
    },
  },
  // 在创建 store 时从 localStorage 中获取状态
  onInit() {
    const storedState = localStorage.getItem('userStore');
    if (storedState) {
      this.$patch(JSON.parse(storedState));
    }
  },
  // 在状态发生变化时将状态保存到 localStorage
  onPatchEnd(patch) {
    localStorage.setItem('userStore', JSON.stringify(this.$state));
  },
});

// 将 useUserStore 导出为 authStore
export const useAuthStore = useUserStore;
