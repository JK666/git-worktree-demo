import { useLanguage } from '../context/LanguageContext';

function CallToAction() {
    const { t } = useLanguage();

    return (
        <section className="cta-banner" id="demo" aria-labelledby="cta-title">
            <div className="cta-banner__bg" aria-hidden="true" />
            <div className="container cta-banner__inner">
                <h2 id="cta-title" className="cta-banner__title">
                    {t({ zh: '準備好提升你的業務效率了嗎？', en: 'Ready to Boost Your Sales Performance?' })}
                </h2>
                <p className="cta-banner__desc">
                    {t({ zh: '加入超過 500 家企業的行列，用 SalesPilot 讓你的銷售團隊如虎添翼。14 天免費試用，不需信用卡。', en: 'Join 500+ companies already using SalesPilot to supercharge their sales teams. 14-day free trial, no credit card required.' })}
                </p>
                <div className="cta-banner__actions">
                    <a href="#demo" className="btn btn--white btn--lg">
                        {t({ zh: '立即預約 Demo', en: 'Book a Demo Now' })}
                    </a>
                    <a href="#pricing" className="btn btn--outline-white btn--lg">
                        {t({ zh: '查看方案比較', en: 'Compare Plans' })}
                    </a>
                </div>
            </div>
        </section>
    );
}

export default CallToAction;
