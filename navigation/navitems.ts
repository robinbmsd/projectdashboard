import type { NavigationMenuItem } from '@nuxt/ui'

export const navItems: NavigationMenuItem[] = [
  { 
    label: 'Dashboard',
    to: '/home/dashboard',
    icon: 'i-lucide-house' 
  },
  { 
    label: 'Transaction History',
    to: '/history/transactions',
    icon: 'i-lucide-arrow-right-left'
  },
  {
    label: 'System Log',
    to: '/systemlogs/logs',
    icon: 'i-lucide-server-cog'
  },
]