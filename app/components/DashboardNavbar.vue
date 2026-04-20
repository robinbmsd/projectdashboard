<script lang="ts">
  const isSidebarOpen = useState('sidebarOpen', () => false)
</script>
<template>
  <UDashboardNavbar>
    class="shrink-0 h-16 bg-white! dark:bg-[#121212]! border-b border-gray-200 dark:border-black"
    :breadcrumb="false"
    :toggle="false"
  >
  <template #title>
    <div class="flex items-center gap-2">
      <UButton>
        icon="i-heroicons-bars-3"
        color="neutral"
        variant="ghost"
        class="lg:hidden"
        @click=isSidebarOpen = !isSidebarOpen"
        />
        <span>
          Temporary Title Page
        </span>
      </UButton>
    </div>
  </template>
  <template #right>
    <UColorModeSwitch />
  </template>
  </UDashboardNavbar>
</template>