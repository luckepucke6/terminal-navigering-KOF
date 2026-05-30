// i18n stands for "internationalization" (18 letters between i and n).
// This file sets up the translation system so we never hardcode Swedish strings
// directly in components. Every piece of text goes through t('key') instead.
// That makes it easy to add more languages later without touching the components.

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import sv from './locales/sv/translation.json'
import en from './locales/en/translation.json'

i18n
  // initReactI18next connects i18next to React so we can use the
  // useTranslation() hook inside our components.
  .use(initReactI18next)
  .init({
    resources: {
      sv: { translation: sv },
      en: { translation: en },
    },
    // Swedish is the default language.
    lng: 'sv',
    // If a key is missing in the current language, fall back to Swedish.
    fallbackLng: 'sv',
    interpolation: {
      // React already escapes HTML in JSX, so we don't need i18next to do it too.
      escapeValue: false,
    },
  })

export default i18n
