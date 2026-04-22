import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const STORAGE_KEY = 'cookie-consent';

function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [hiding, setHiding] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            setVisible(true);
        }
    }, []);

    function handleChoice(value) {
        setHiding(true);
        setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, value);
            setVisible(false);
        }, 400);
    }

    if (!visible) return null;

    return (
        <div className={`cookie-consent${hiding ? ' cookie-consent--hiding' : ''}`} role="dialog" aria-label={t({ zh: 'Cookie 同意', en: 'Cookie Consent' })}>
            <div className="cookie-consent__inner">
                <p className="cookie-consent__text">
                    {t({
                        zh: '我們使用 Cookie 來改善您的瀏覽體驗、分析網站流量並提供個人化內容。繼續使用本網站即表示您同意我們的隱私政策。',
                        en: 'We use cookies to improve your browsing experience, analyze site traffic, and provide personalized content. By continuing to use this site, you agree to our Privacy Policy.',
                    })}
                </p>
                <div className="cookie-consent__actions">
                    <button
                        className="btn btn--outline btn--sm cookie-consent__reject"
                        onClick={() => handleChoice('rejected')}
                    >
                        {t({ zh: '拒絕', en: 'Decline' })}
                    </button>
                    <button
                        className="btn btn--primary btn--sm"
                        onClick={() => handleChoice('accepted')}
                    >
                        {t({ zh: '接受', en: 'Accept' })}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CookieConsent;
