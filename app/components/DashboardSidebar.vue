<script setup lang="ts">
const isSidebarOpen = useState('sidebarOpen', () => false)
const logout = () => navigateTo('/login')
</script>

<template>
  <div
    class="w-60 
    shrink-0 
    border-r 
    border-gray-200 
    dark:border-black 
    p-4 
    h-screen 
    flex flex-col 
    bg-white 
    dark:bg-[#121212]
    transition-transform
    duration-300
    z-50 fixed
    inset-y-0
    left-0
    lg:static
    lg:translate-x-0"
    :class="isSidebarOpen ? 
    'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full'"
    >
  <div class="flex items-center justify-center mb-8 px-2">
    <img src="https://icons.veryicon.com/png/o/miscellaneous/broken-linear-icon/dashboard-81.png" alt="Logo Dashboard" class="h-12" />
  </div>
  </div>
</template>