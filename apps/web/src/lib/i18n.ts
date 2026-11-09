import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { browserStorage } from './browserStorage.js';

type Language = 'es' | 'en';

const APP_TITLE: Record<Language, string> = { es: 'República en Llamas', en: 'Republic in Flames' };

// Each language is its own chunk; only the active one is downloaded.
const loadTranslations: Record<Language, () => Promise<Record<string, string>>> = {
  es: () => import('@republica/game-engine/i18n/es').then((m) => m.es),
  en: () => import('@republica/game-engine/i18n/en').then((m) => m.en),
};

function storedLanguage(): Language {
  return browserStorage.getItem('language') === 'en' ? 'en' : 'es';
}

export async function initI18n() {
  const lng = storedLanguage();
  const [translations, fallback] = await Promise.all([
    loadTranslations[lng](),
    lng === 'en' ? loadTranslations.es() : Promise.resolve(null),
  ]);
  await i18n.use(initReactI18next).init({
    resources: {
      es: { translation: { ...(fallback ?? translations), 'app.title': APP_TITLE.es } },
      ...(lng === 'en' ? { en: { translation: { ...translations, 'app.title': APP_TITLE.en } } } : {}),
    },
    lng,
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
  });
}

export default i18n;
export { i18n };
