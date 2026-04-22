import { useState, useEffect, useRef } from 'react';
import { HERO_CONTENT } from '../data/hero';
import { useLanguage } from '../context/LanguageContext';

function parseStatValue(value) {
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!match) return { num: 0, decimals: 0, suffix: value };
    const numStr = match[1];
    const suffix = match[2];
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
    return { num: parseFloat(numStr), decimals, suffix };
}

function useCountUp(end, decimals, duration = 1800) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasStarted = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted.current) {
                    hasStarted.current = true;
                    const startTime = performance.now();

                    const animate = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(parseFloat((eased * end).toFixed(decimals)));
                        if (progress < 1) requestAnimationFrame(animate);
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [end, decimals, duration]);

    return { count, ref };
}

function StatCounter({ value }) {
    const { num, decimals, suffix } = parseStatValue(value);
    const { count, ref } = useCountUp(num, decimals, 1800);
    return (
        <span className="hero__stat-value" ref={ref}>
            {count.toFixed(decimals)}{suffix}
        </span>
    );
}

function Hero() {
    const { t } = useLanguage();
    const { title, subtitle, stats, primaryCta, secondaryCta } = HERO_CONTENT;

    const titleText = t(title);

    return (
        <section className="hero" aria-labelledby="hero-title">
            <div className="hero__bg" aria-hidden="true">
                <div className="hero__gradient" />
                <div className="hero__grid" />
            </div>

            <div className="hero__inner container">
                <div className="hero__content">
                    <h1 id="hero-title" className="hero__title">
                        {titleText.split('\n').map((line, i) => (
                            <span key={i}>
                                {line}
                                {i === 0 && <br />}
                            </span>
                        ))}
                    </h1>
                    <p className="hero__subtitle">{t(subtitle)}</p>

                    <div className="hero__actions">
                        <a href={primaryCta.href} className="btn btn--primary btn--lg">
                            {t(primaryCta.label)}
                        </a>
                        <a href={secondaryCta.href} className="btn btn--outline btn--lg">
                            {t(secondaryCta.label)}
                        </a>
                    </div>

                    <div className="hero__stats" role="list" aria-label={t({ zh: '關鍵成效數據', en: 'Key performance stats' })}>
                        {stats.map((stat, i) => (
                            <div key={i} className="hero__stat" role="listitem">
                                <StatCounter value={stat.value} />
                                <span className="hero__stat-label">{t(stat.label)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hero__visual" aria-hidden="true">
                    <div className="hero__mockup">
                        <div className="hero__mockup-header">
                            <span className="hero__mockup-dot" />
                            <span className="hero__mockup-dot" />
                            <span className="hero__mockup-dot" />
                        </div>
                        <div className="hero__mockup-body">
                            <div className="hero__mockup-sidebar">
                                <div className="hero__mockup-sidebar-item" />
                                <div className="hero__mockup-sidebar-item" />
                                <div className="hero__mockup-sidebar-item hero__mockup-sidebar-item--active" />
                                <div className="hero__mockup-sidebar-item" />
                            </div>
                            <div className="hero__mockup-content">
                                <div className="hero__mockup-pipeline">
                                    <div className="hero__mockup-col">
                                        <div className="hero__mockup-col-header">{t({ zh: '初步接觸', en: 'Prospect' })}</div>
                                        <div className="hero__mockup-card hero__mockup-card--blue" />
                                        <div className="hero__mockup-card hero__mockup-card--blue" />
                                    </div>
                                    <div className="hero__mockup-col">
                                        <div className="hero__mockup-col-header">{t({ zh: '需求確認', en: 'Qualified' })}</div>
                                        <div className="hero__mockup-card hero__mockup-card--purple" />
                                    </div>
                                    <div className="hero__mockup-col">
                                        <div className="hero__mockup-col-header">{t({ zh: '報價中', en: 'Proposal' })}</div>
                                        <div className="hero__mockup-card hero__mockup-card--amber" />
                                        <div className="hero__mockup-card hero__mockup-card--amber" />
                                        <div className="hero__mockup-card hero__mockup-card--amber" />
                                    </div>
                                    <div className="hero__mockup-col">
                                        <div className="hero__mockup-col-header">{t({ zh: '成交 🎉', en: 'Closed 🎉' })}</div>
                                        <div className="hero__mockup-card hero__mockup-card--green" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
