import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhTranslation from '@/locales/zh.json'

// 初始化 i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: {
        translation: zhTranslation
      }
    },
    supportedLngs: ['zh'],
    fallbackLng: 'zh',
    detection: {
      order: ['navigator'],
    },
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;