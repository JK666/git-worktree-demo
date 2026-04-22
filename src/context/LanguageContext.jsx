import { createContext, useContext, useState } from 'react';
import zh from '../i18n/zh';
import en from '../i18n/en';

const TRANSLATIONS = { zh, en };
const STORAGE_KEY = 'salespilot_language';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved === 'en' ? 'en' : 'zh';
    });

    function setLanguage(lang) {
        setLanguageState(lang);
        localStorage.setItem(STORAGE_KEY, lang);
    }

    /**
     * t(key) — key 格式：'section.field'
     * 也可傳入 { zh: '...', en: '...' } 物件，依目前語系取值
     * 若 key 為一般 string（無 zh/en 屬性），直接查 translations map
     */
    function t(key) {
        if (key && typeof key === 'object') {
            return key[language] ?? key.zh ?? '';
        }
        return TRANSLATIONS[language][key] ?? key;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return ctx;
}
