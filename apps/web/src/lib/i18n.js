import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { es } from '@republica/game-engine';
import { en } from '@republica/game-engine';
const resources = {
    es: { translation: { ...es, 'app.title': 'República en Llamas' } },
    en: { translation: { ...en, 'app.title': 'Republic in Flames' } },
};
void i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem('language') ?? 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
});
export default i18n;
export { i18n };
//# sourceMappingURL=i18n.js.map