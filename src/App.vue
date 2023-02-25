<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="container">
    <div id="nav">
      <RouterLink to="/admin">Admin</RouterLink>
      <RouterLink to="/">Home</RouterLink>
    </div>
    <div id="main">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 100%;
}

#nav {
  width: 100%;
  height: 15%;
}

#main {
  width: 100%;
  height: 85%;
}
</style>
