
import { defineStore } from 'pinia';
// console.log('useUserStore defined');
export const useUserStore = defineStore('user', {
  state: () => ({
    userid: '',
    username: '',
    email: '',
    telphone: '',
    usertype: '',
    money: ''    
  }),
  actions: {
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
  // onPatchEnd(patch) {
  //   localStorage.setItem('userStore', JSON.stringify(this.$state));
  // },
});