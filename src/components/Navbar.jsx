import { useState, useEffect } from 'react';
import { NAV_LINKS, BRAND } from '../data/navigation';

const STORAGE_KEY = 'theme';

function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const initial = getInitialTheme();
        setTheme(initial);
        document.documentElement.setAttribute('data-theme', initial);
    }, []);

    function handleThemeToggle() {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(STORAGE_KEY, next);
    }

    return (
        <header className="navbar" role="banner">
            <div className="navbar__inner container">
                <a href="/" className="navbar__brand" aria-label={`${BRAND.name} 首頁`}>
                    <span className="navbar__logo" aria-hidden="true">◆</span>
                    <span className="navbar__brand-name">{BRAND.name}</span>
                </a>

                <button
                    className="navbar__toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
                    aria-controls="nav-menu"
                    aria-label="切換導覽選單"
                >
                    <span className="navbar__toggle-bar" />
                    <span className="navbar__toggle-bar" />
                    <span className="navbar__toggle-bar" />
                </button>

                <nav
                    id="nav-menu"
                    className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}
                    role="navigation"
                    aria-label="主要導覽"
                >
                    <ul className="navbar__list">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href} className="navbar__item">
                                <a href={link.href} className="navbar__link" onClick={() => setMenuOpen(false)}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="navbar__theme-toggle"
                        onClick={handleThemeToggle}
                        aria-label={theme === 'dark' ? '切換為淺色模式' : '切換為深色模式'}
                    >
                        {theme === 'dark' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                    </button>
                    <a href="#demo" className="btn btn--primary btn--sm navbar__cta">
                        預約 Demo
                    </a>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
