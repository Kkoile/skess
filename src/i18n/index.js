import i18n from 'i18next';
import {initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import translations from './translations';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: translations,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        debug: true
    });
