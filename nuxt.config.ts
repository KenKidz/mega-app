import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  ssr: false,
  devtools: { enabled: true },
  css: ['~/assets/styles/main.css'],
  modules: [
    '@nuxt/icon',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'page', mode: 'out-in' },
  },
  runtimeConfig: {
    public: {
      awsRegion: '',
      awsS3Bucket: '',
      awsCognitoUserPoolId: '',
      awsCognitoClientId: '',
      awsCognitoIdentityPoolId: '',
      awsCloudfrontDomain: '',
      awsAccessKeyId: '',
      awsSecretAccessKey: '',
    }
  },

  i18n: {
    locales: [
      { code: 'en', name: 'English', iso: 'en-US' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix'
  },
})