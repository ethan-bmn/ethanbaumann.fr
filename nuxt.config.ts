// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  nitro: {
    preset: 'node-server'
  },
  runtimeConfig: {
    smtp: {
      host: 'ssl0.ovh.net',
      port: 465,
      user: '',
      password: ''
    },
    contact: {
      to: 'contact@ethanbaumann.fr',
      origin: 'https://ethanbaumann.fr'
    },
    turnstile: {
      secretKey: ''
    },
    public: {
      turnstileSiteKey: ''
    }
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@vue/devtools-core']
    }
  }
})
