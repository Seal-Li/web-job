
import { defineStore } from 'pinia';
// console.log('useUserStore defined');
export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    email: '',
    telphone: '',
    usertype: '',
    money: ''    
  }),
  actions: {
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
  }
});