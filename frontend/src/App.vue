<!-- App.vue -->

<template>
  <div class="App">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Login from './views/Login.vue';

export default {
  components: { 
    Login,
  },
  setup() {
  }
};
</script>

<style scoped>
.App {
  /* background-image: url('./assets/bgpic.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh; 
  margin: 0; */
}
</style>
