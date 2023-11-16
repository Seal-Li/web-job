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
}
</style>
