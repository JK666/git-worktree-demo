import { useState } from 'react';
import { faqs } from '../data/faq';
import { useLanguage } from '../context/LanguageContext';

function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);
    const { t } = useLanguage();

    function handleToggle(index) {
        setOpenIndex(prev => (prev === index ? null : index));
    }

    return (
        <section className="faq">
            <div className="container">
                <div className="section-header">
                    <span className="section-header__badge">FAQ</span>
                    <h2 className="section-header__title">{t({ zh: '常見問題', en: 'Frequently Asked Questions' })}</h2>
                    <p className="section-header__desc">{t({ zh: '找不到答案？歡迎聯絡我們的客服團隊。', en: "Can't find the answer? Contact our support team." })}</p>
                </div>
                <div className="faq__list">
                    {faqs.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`faq__item${isOpen ? ' faq__item--open' : ''}`}
                            >
                                <button
                                    className="faq__question"
                                    onClick={() => handleToggle(index)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{t(item.question)}</span>
                                    <span className="faq__icon" aria-hidden="true">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path
                                                d="M5 7.5L10 12.5L15 7.5"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                </button>
                                <div className="faq__answer" aria-hidden={!isOpen}>
                                    <p className="faq__answer-text">{t(item.answer)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default FAQ;
