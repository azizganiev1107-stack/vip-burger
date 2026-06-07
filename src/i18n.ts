import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'

import kk from './locales/kk.json'

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      kk: { translation: kk }
    },
    lng: 'kk', // default to kk for testing this specific task
    fallbackLng: 'kk',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
