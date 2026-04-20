import { fileURLToPath } from 'node:url' 

export default defineNuxtConfig({
  ssr: false,

  experimental: {
    serverAppConfig: false,  
  },
  srcDir: 'app/',
  serverDir: 'server/',
  
    alias: {
    '@': fileURLToPath(new URL('./app', import.meta.url)),
    '~': fileURLToPath(new URL('./app', import.meta.url))
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',              // tanpa { fonts: false } dulu
    '@nuxt/icon'
  ],
  
  devtools: { enabled: true },


  fonts: {
    providers: {
      fontshare: false
    }
  },
  
  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { redirect: '/usrlogin/login' },
    '/home': { redirect: '/home/dashboard' },
    '/login': { redirect: '/usrlogin/login' },
    '/register': { redirect: '/usrregister/register' }
  },

  compatibilityDate: '2025-01-15',
  
  nitro: {
    devProxy: {},
    externals: {
      external: ['mysql2']
    }
  },
  
  runtimeConfig: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    jwtSecret: process.env.JWT_SECRET,
    public: {}
  },
  
  vite: {
    optimizeDeps: {
      exclude: ['mysql2'],
      include: [
        'tailwindcss',
        '@vue/devtools-core',
        '@vue/devtools-kit',]
    }
  },

  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        skipLibCheck: true,
        moduleResolution: 'bundler'
      }
    }
  }
})