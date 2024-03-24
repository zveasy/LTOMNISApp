// i18n.ts
import i18n from 'i18next';
import 'intl-pluralrules';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import arTranslation from './locales/ar.json';
import frTranslation from './locales/fr.json';
import hiTranslation from './locales/hi.json';
import idTranslation from './locales/id.json';
import ruTranslation from './locales/ru.json';
import viTranslation from './locales/vi.json';
import zhTranslation from './locales/zh.json';

const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  ar: { translation: arTranslation },
  fr: { translation: frTranslation },
  hi: { translation: hiTranslation },
  id: { translation: idTranslation },
  ru: { translation: ruTranslation },
  vi: { translation: viTranslation },
  zh: { translation: zhTranslation },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
