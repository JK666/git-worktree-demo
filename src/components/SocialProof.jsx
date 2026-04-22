import { SOCIAL_PROOF } from '../data/socialProof';
import { useLanguage } from '../context/LanguageContext';

function SocialProof() {
    const { t } = useLanguage();
    const { heading, logos, testimonial } = SOCIAL_PROOF;

    return (
        <section className="social-proof" id="social-proof" aria-labelledby="social-proof-title">
            <div className="container">
                <p id="social-proof-title" className="social-proof__heading">
                    {t(heading)}
                </p>

                <div className="social-proof__logos" role="list" aria-label={t({ zh: '客戶企業列表', en: 'Client company list' })}>
                    {logos.map((logo) => (
                        <div key={logo.id} className="social-proof__logo" role="listitem">
                            <div className="social-proof__logo-placeholder" aria-label={logo.name}>
                                {logo.name}
                            </div>
                        </div>
                    ))}
                </div>

                <blockquote className="social-proof__testimonial">
                    <p className="social-proof__quote">「{t(testimonial.quote)}」</p>
                    <footer className="social-proof__author">
                        <div className="social-proof__avatar" aria-hidden="true">
                            {testimonial.author.charAt(0)}
                        </div>
                        <div>
                            <cite className="social-proof__name">{testimonial.author}</cite>
                            <span className="social-proof__role">
                                {t(testimonial.role)}，{testimonial.company}
                            </span>
                        </div>
                    </footer>
                </blockquote>
            </div>
        </section>
    );
}

export default SocialProof;
