import { useState } from 'react';
import { NAV_LINKS, BRAND } from '../data/navigation';
import { useLanguage } from '../context/LanguageContext';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    function toggleLanguage() {
        setLanguage(language === 'zh' ? 'en' : 'zh');
    }

    return (
        <header className="navbar" role="banner">
            <div className="navbar__inner container">
                <a href="/" className="navbar__brand" aria-label={`${BRAND.name} ${language === 'zh' ? '首頁' : 'Home'}`}>
                    <span className="navbar__logo" aria-hidden="true">◆</span>
                    <span className="navbar__brand-name">{BRAND.name}</span>
                </a>

                <button
                    className="navbar__toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
                    aria-controls="nav-menu"
                    aria-label={language === 'zh' ? '切換導覽選單' : 'Toggle navigation menu'}
                >
                    <span className="navbar__toggle-bar" />
                    <span className="navbar__toggle-bar" />
                    <span className="navbar__toggle-bar" />
                </button>

                <nav
                    id="nav-menu"
                    className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}
                    role="navigation"
                    aria-label={language === 'zh' ? '主要導覽' : 'Main navigation'}
                >
                    <ul className="navbar__list">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href} className="navbar__item">
                                <a href={link.href} className="navbar__link" onClick={() => setMenuOpen(false)}>
                                    {t(link.label)}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="btn btn--outline btn--sm"
                        onClick={toggleLanguage}
                        aria-label={language === 'zh' ? '切換為英文' : 'Switch to Chinese'}
                    >
                        {language === 'zh' ? '中 / EN' : 'EN / 中'}
                    </button>
                    <a href="#demo" className="btn btn--primary btn--sm navbar__cta">
                        {t({ zh: '預約 Demo', en: 'Book a Demo' })}
                    </a>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
