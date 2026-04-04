import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fil from './locales/fil.json';

const savedLanguage = (() => {
  try {
    return localStorage.getItem('AP_language') || 'fil';
  } catch {
    return 'fil';
  }
})();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fil: { translation: fil },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Persist language changes
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('AP_language', lng);
  } catch {
    // ignore
  }
});

export default i18n;
