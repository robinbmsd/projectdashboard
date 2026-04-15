export default defineNuxtConfig({
  srcDir: 'app/',
  serverDir: 'server/',

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  ui: {
    fonts: false
  },

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true },
    '/home': { redirect: '/home/dashboard' },
    '/login': { redirect: '/usrlogin/login' },
    '/register': { redirect: '/usrregister/register' }
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
  },
  
  runtimeConfig: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    public: {}
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        skipLibCheck: true,
        moduleResolution: 'bundler'
      }
    }
  }
  
})