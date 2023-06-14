import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language resources
import translationEN from './locales/en.json';
import translationES from './locales/es.json';

const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
