import { useState, useEffect } from 'react';
import { NAV_LINKS, BRAND } from '../data/navigation';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState(() => {
        // 頁面載入時讀取 localStorage，初始化主題
        const saved = localStorage.getItem('theme');
        return saved === 'light' ? 'light' : 'dark';
    });

    useEffect(() => {
        // 套用主題至 document.documentElement
        document.documentElement.setAttribute('data-theme', theme);
        // 持久化至 localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

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
                        onClick={toggleTheme}
                        aria-label={theme === 'dark' ? '切換至淺色主題' : '切換至深色主題'}
                        title={theme === 'dark' ? '切換至淺色主題' : '切換至深色主題'}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
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
