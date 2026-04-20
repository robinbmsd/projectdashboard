<script lang="ts">
import dayjs from 'dayjs'

import { ref, onMounted, onUnmounted } from 'vue'

const isSidebarOpen = useState('sidebarOpen', () => false)

const currenctDateTime = ref('')

let timer: any

onMounted(() => {
  const updateTime = () => {
    const d = new Date()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
    const dayName = days[d.getDay()]
    const date = d.getDate()
    const monthName = months[d.getMonth()]
    const year = d.getFullYear()
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
  
    currenctDateTime.value = `${dayName}, ${date} ${monthName} ${year} ${hh}:${mm}:${ss}`
  }
  updateTime
}
)
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