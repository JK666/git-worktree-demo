import { USE_CASES } from '../data/useCases';
import { useLanguage } from '../context/LanguageContext';

function UseCases() {
    const { t } = useLanguage();

    return (
        <section className="use-cases" id="use-cases" aria-labelledby="use-cases-title">
            <div className="container">
                <div className="section-header">
                    <span className="section-header__badge">{t({ zh: '應用場景', en: 'Use Cases' })}</span>
                    <h2 id="use-cases-title" className="section-header__title">
                        {t({ zh: '無論你的角色，SalesPilot 都能助你一臂之力', en: 'Whatever Your Role, SalesPilot Has You Covered' })}
                    </h2>
                </div>

                <div className="use-cases__list">
                    {USE_CASES.map((uc, index) => (
                        <article
                            key={uc.id}
                            className={`use-cases__item ${index % 2 === 1 ? 'use-cases__item--reverse' : ''}`}
                        >
                            <div className="use-cases__content">
                                <div className="use-cases__role-badge">
                                    <span aria-hidden="true">{uc.icon}</span> {t(uc.role)}
                                </div>
                                <h3 className="use-cases__title">{t(uc.title)}</h3>
                                <p className="use-cases__desc">{t(uc.description)}</p>
                                <ul className="use-cases__highlights" role="list">
                                    {uc.highlights.map((h, i) => (
                                        <li key={i} className="use-cases__highlight" role="listitem">
                                            <span className="use-cases__check" aria-hidden="true">✓</span>
                                            {t(h)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="use-cases__visual" aria-hidden="true">
                                <div className="use-cases__illustration">
                                    <span className="use-cases__illustration-icon">{uc.icon}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default UseCases;
