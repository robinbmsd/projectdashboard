import { fileURLToPath } from 'node:url' 

export default defineNuxtConfig({
  srcDir: 'app/',
  serverDir: 'server/',

  alias: {
    '@': fileURLToPath(new URL('./app', import.meta.url)),
    '~': fileURLToPath(new URL('./app', import.meta.url))
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true },
    '/home': { redirect: '/home/dashboard' },
    '/login': { redirect: '/userlogin/login' },
    '/register': { redirect: '/userregister/register' }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    provider: 'iconify',
    serverBundle: 'remote'
  },
  nitro: {
    devProxy: {
      host: 'localhost',
    }
  }
})