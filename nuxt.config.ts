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
      awsRegion: import.meta.env.NUXT_PUBLIC_AWS_REGION,
      awsS3Bucket: import.meta.env.NUXT_PUBLIC_AWS_S3_BUCKET,
      awsCognitoUserPoolId: import.meta.env.NUXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
      awsCognitoClientId: import.meta.env.NUXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
      awsCognitoIdentityPoolId: import.meta.env.NUXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
      awsCloudfrontDomain: import.meta.env.NUXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN,
      awsAccessKeyId: import.meta.env.NUXT_PUBLIC_AWS_ACCESS_KEY_ID,
      awsSecretAccessKey: import.meta.env.NUXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
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