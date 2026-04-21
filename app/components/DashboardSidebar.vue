<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { navItems } from '~~/navigation/navItems'

const isSidebarOpen = useState('sidebarOpen', () => false)

const route = useRoute()

const activeNavItems = computed(() => {
    const currentPath = route.path

    return navItems.map(item => {
      const itemPath = typeof item.to === 'string' ? item.to :''

      if (itemPath === '/' || itemPath === '/home' || itemPath === '/dashboard') {
        return{...item, active: currentPath === itemPath }
      }

      const pathParts = itemPath.split('/').filter(Boolean)
      const sectionPrefix = pathParts.length > 0? `/${pathParts[0]}` : itemPath
      const isActive = currentPath === itemPath || (currentPath.startsWith(sectionPrefix) && currentPath !== '/' && sectionPrefix !== '/')

      return { ...item, active: isActive }
    })
  }
)

const logout = () => {
  navigateTo('/usrlogin/login', { replace: true })
}
</script>

<template>
  <div
    class="w-60 shrink-0 border-r border-gray-200 dark:border-black p-4 h-screen flex flex-col bg-white dark:bg-[#121212] transition-transform duration-300 z-50 fixed inset-y-0 left-0 lg:static lg:translate-x-0" 
    :class="isSidebarOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full'"
  >
  <div class="flex items-center justify-center mb-8 px-2">
    <img src="https://icons.veryicon.com/png/o/miscellaneous/broken-linear-icon/dashboard-81.png" 
    alt="Logo Dashboard" 
    class="h-12 dark:invert"/>
  </div>

  <UNavigationMenu :items="activeNavItems" orientation="vertical" class="w-full flex-1" />
    <div class="pt-4 border-t border-gray-200 dark:border-black">
      <UButton
        @click="logout"
        class="w-full justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"  
        variant="ghost"
        icon="i-lucide-log-out"
        label="Logoout"
        />
    </div>
  </div>
</template>