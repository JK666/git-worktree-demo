import { PRICING_PLANS } from '../data/pricing';
import { useLanguage } from '../context/LanguageContext';

function Pricing() {
    const { t } = useLanguage();

    return (
        <section className="pricing" id="pricing" aria-labelledby="pricing-title">
            <div className="container">
                <div className="section-header">
                    <span className="section-header__badge">{t({ zh: '方案價格', en: 'Pricing' })}</span>
                    <h2 id="pricing-title" className="section-header__title">
                        {t({ zh: '簡單透明的定價，無隱藏費用', en: 'Simple, Transparent Pricing — No Hidden Fees' })}
                    </h2>
                    <p className="section-header__desc">
                        {t({ zh: '所有方案均含 14 天免費試用，不需信用卡。', en: 'All plans include a 14-day free trial. No credit card required.' })}
                    </p>
                </div>

                <div className="pricing__grid" role="list">
                    {PRICING_PLANS.map((plan) => (
                        <article
                            key={plan.id}
                            className={`pricing__card ${plan.featured ? 'pricing__card--featured' : ''}`}
                            role="listitem"
                        >
                            {plan.badge && (
                                <span className="pricing__badge">{t(plan.badge)}</span>
                            )}
                            <h3 className="pricing__plan-name">{plan.name}</h3>
                            <p className="pricing__plan-desc">{t(plan.description)}</p>
                            <div className="pricing__price">
                                <span className="pricing__amount">{t(plan.price)}</span>
                                {plan.period && t(plan.period) && (
                                    <span className="pricing__period">{t(plan.period)}</span>
                                )}
                            </div>
                            <a
                                href={plan.cta.href}
                                className={`btn btn--lg btn--full ${plan.featured ? 'btn--primary' : 'btn--outline'}`}
                            >
                                {t(plan.cta.label)}
                            </a>
                            <ul className="pricing__features" role="list">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="pricing__feature" role="listitem">
                                        <span className="pricing__check" aria-hidden="true">✓</span>
                                        {t(f)}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Pricing;
