<template>
  <div>
    <button @click="navigateTo('/login')">
      Logout
    </button>"
  </div>
  </template>

<script setup>
// Fungsi dasar untuk pindah halaman di Nuxt
const logout = () => navigateTo('/login')
</script>