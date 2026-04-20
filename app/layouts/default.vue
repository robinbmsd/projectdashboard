<script setup lang="ts">
import DashboardSidebar from '~/components/DashboardSidebar.vue'
import DashboardNavbar from '~/components/DashboardNavbar.vue'

const isSidebarOpen = useState('sidebarOpen', () => false)

</script>

<template>
  <div class="flex h-screen w-full overflow-hidden bg-white dark:bg-[#121212] m-0 p-0">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
      @click="isSidebarOpen = false"
    >
    </div>
    
    <DashboardSidebar class="shrink-0"/>

    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <DashboardNavbar class="shrink-0" />
      
      <main class="flex-1 min-h-0 relative overflow-y-auto">
        <slot />
      </main>
    </div>

</div>
</template>