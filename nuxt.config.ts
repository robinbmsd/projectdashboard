export default defineNuxtConfig({
  ssr: false,

  experimental: {
    serverAppConfig: false,  
  },

  srcDir: 'app/',
  serverDir: 'server/',

  modules: [
    ['@nuxt/eslint', {
      config: {
        stylistic: {
          commaDangle: 'never',
          braceStyle: '1tbs'
        }
      }
    }],
    
    ['@nuxt/ui', { fonts: false }],

    ['@nuxt/icon', {
      provider: 'iconify',
      serverBundle: 'remote'
    }]
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