<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import {  breadcrumbMap } from '~~/navigation/breadcrumb'
import { navItems } from '~~/navigation/navItems'

defineProps<{ title?: string }>()

const route = useRoute()

const isSidebarOpen = useState('sidebarOpen', () => false)

const triggerCsv = useState('trigger-download-csv', () => 0)

type BreadcrumbItem = {
  label?: string
  icon?: string
  to?: string
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const path = route.path
  const match = breadcrumbMap.find(b => b.match.test(path))
  if (match) return match.items as BreadcrumbItem[]

  const nav = navItems.find(i => i.to === path)
  return nav ? [{ label: nav.label, icon: nav.icon, to: undefined }] : []
})

const isTransactionHistory = computed(() => route.path === '/transactions')
const isSystemLogs = computed(() => route.path === '/logs')

const currentDateTime = ref('')
let timer: any

onMounted(() => {
  const updateTime = () => {
  const d = new Date()

  currentDateTime.value = d.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(',','')
  }

  updateTime()
  timer = setInterval(updateTime,1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
}) 
</script>
<template>
  <UDashboardNavbar>
    class="shrink-0 h-16 bg-white! dark:bg-[#121212]! border-b border-gray-200 dark:border-black"
    :breadcrumb="false"
    :toggle="false"
  >
  <template #title>
    <div class="flex items-center gap-2">
      <UButton
        icon="i-heroicons-bars-3"
        color="neutral"
        variant="ghost"
        class="lg:hidden"
        @click="isSidebarOpen = !isSidebarOpen"
        />
        <template v-for="(item, index) in breadcrumbs" :key="index">
          <UIcon :name="item.icon" class="text-promary-500 w-5 h-5" />
          <span class="font-bold text-gray-900 dark:text-white text-lg">
          Temporary Title Page
          <span class="text-sm font-normal text-gray-500 ml-2">
            {{ currentDateTime }}
          </span>
        </span>
        <span v-if="index < breadcrumbs.length - 1" class="text-gray-400">
          ›
        </span>
        </template>
    </div>
  </template>

  <template #right>
    <UColorModeSwitch />
  </template>
  </UDashboardNavbar>
</template>