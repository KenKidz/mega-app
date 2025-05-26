import en from '@/i18n/locales/en.json'
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fr: {
      welcome: 'Bienvenue'
    }
  },
}))