<!-- App.vue -->

<template>
    <Login></Login>
    <hr>
  <Register></Register>
</template>

<script lang="ts">
import Login from './components/Login.vue';
import Register from './components/Register.vue';

export default {
  components: { 
    Login,
    Register
  },
  setup() {
  }
};
</script>

<style></style>
