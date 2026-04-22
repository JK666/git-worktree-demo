import { FEATURES } from '../data/features';
import { useLanguage } from '../context/LanguageContext';

function Features() {
    const { t } = useLanguage();

    return (
        <section className="features" id="features" aria-labelledby="features-title">
            <div className="container">
                <div className="section-header">
                    <span className="section-header__badge">{t({ zh: '核心功能', en: 'Core Features' })}</span>
                    <h2 id="features-title" className="section-header__title">
                        {t({ zh: '一個平台，解決所有銷售挑戰', en: 'One Platform. Every Sales Challenge Solved.' })}
                    </h2>
                    <p className="section-header__desc">
                        {t({ zh: '從管線管理到數據分析，SalesPilot 涵蓋業務團隊日常所需的每一項功能。', en: 'From pipeline management to data analytics, SalesPilot covers everything your sales team needs every day.' })}
                    </p>
                </div>

                <div className="features__grid" role="list">
                    {FEATURES.map((feature) => (
                        <article
                            key={feature.id}
                            className="features__card"
                            role="listitem"
                        >
                            <div className="features__icon" aria-hidden="true">
                                {feature.icon}
                            </div>
                            <h3 className="features__title">{t(feature.title)}</h3>
                            <p className="features__desc">{t(feature.description)}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
