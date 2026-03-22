import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import pl from './pl.json';

const resources = {
  en: { translation: en },
  pl: { translation: pl },
};

// Check if the user's preferred language is Polish
const locales = Localization.getLocales();
const isPolish = locales[0]?.languageTag.startsWith('pl');
const defaultLanguage = isPolish ? 'pl' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safe from xss
    },
  });

export default i18n;
