import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cookie-consent';

function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | accepted | rejected | hiding

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            setVisible(true);
        }
    }, []);

    function handleAccept() {
        setStatus('accepted');
        setTimeout(() => {
            setStatus('hiding');
            setTimeout(() => {
                localStorage.setItem(STORAGE_KEY, 'accepted');
                setVisible(false);
            }, 400);
        }, 600);
    }

    function handleReject() {
        setStatus('rejected');
        setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, 'rejected');
            setVisible(false);
        }, 400);
    }

    if (!visible) return null;

    const isAccepted = status === 'accepted';
    const isHiding = status === 'hiding' || status === 'rejected';

    return (
        <div
            className={[
                'cookie-consent',
                isAccepted ? 'cookie-consent--accepted' : '',
                isHiding ? 'cookie-consent--hiding' : '',
            ].filter(Boolean).join(' ')}
            role="dialog"
            aria-label="Cookie 同意"
        >
            <div className="cookie-consent__inner">
                <p className="cookie-consent__text">
                    我們使用 Cookie 來改善您的瀏覽體驗、分析網站流量並提供個人化內容。
                    繼續使用本網站即表示您同意我們的隱私政策。
                </p>
                <div className="cookie-consent__actions">
                    <button
                        className="btn btn--outline btn--sm cookie-consent__reject"
                        onClick={handleReject}
                        disabled={status !== 'idle'}
                    >
                        拒絕
                    </button>
                    <button
                        className={`btn btn--sm ${isAccepted ? 'btn--success' : 'btn--primary'}`}
                        onClick={handleAccept}
                        disabled={status !== 'idle'}
                    >
                        {isAccepted
                            ? <span className="cookie-consent__accept-label">✓ 已同意！</span>
                            : '接受'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CookieConsent;
