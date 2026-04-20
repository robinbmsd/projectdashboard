<template>
  <div class="w-60 h-screen bg-white border-r border-gray-200 p-4">
    <div class="mb-8">
      LOGO
    </div>
    <div class="mt-auto border-t pt-4">
      <button @click="navigateTo('/login')">
      Logout
    </button>
    </div>
  </div>
  </template>

<script setup>
const logout = () => navigateTo('/login')
</script>