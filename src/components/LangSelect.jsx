import { useState } from "react";

const FLAGS = {
    ua: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" style={{ width: '1.2em', height: '1.2em', borderRadius: '2px' }}><rect width="1200" height="800" fill="#0057B7" /><rect y="400" width="1200" height="400" fill="#FFDD00" /></svg>,
    en: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" style={{ width: '1.2em', height: '1.2em', borderRadius: '2px' }}><rect width="1200" height="600" fill="#012169" /><path d="M0,0 L1200,600 M0,600 L1200,0" stroke="#fff" strokeWidth="120" /><path d="M0,0 L1200,600 M0,600 L1200,0" stroke="#C8102E" strokeWidth="40" /><path d="M600,0 V600 M0,300 H1200" stroke="#fff" strokeWidth="200" /><path d="M600,0 V600 M0,300 H1200" stroke="#C8102E" strokeWidth="120" /></svg>,
    lt: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" style={{ width: '1.2em', height: '1.2em', borderRadius: '2px' }}><rect width="1000" height="600" fill="#FDB913" /><rect y="200" width="1000" height="400" fill="#006A44" /><rect y="400" width="1000" height="200" fill="#C1272D" /></svg>,
};

const PRIMARY_LANGUAGES = [
    ["ua", "Українська", FLAGS.ua],
    ["en", "English", FLAGS.en],
];

const OTHER_LANGUAGES = [
    ["ru", "Русский", null], // No flag for ru
    ["lt", "Lietuvių", FLAGS.lt],
];

export default function LangSelect({ currentTheme, uiStrings, lang, fade, onStart }) {
    const [showOthers, setShowOthers] = useState(false);

    return (
        <div
            className="hero"
            style={{
                opacity: fade === "out" ? 0 : 1,
                transform: fade === "out" ? "translateY(20px)" : "translateY(0)",
                transition: "all 0.3s",
            }}
        >
            <div className="hero__icon">W</div>
            <h1 className="hero__title" style={{ backgroundImage: currentTheme.titleGrad }}>
                {lang ? uiStrings.heroTitle : "Choose language"}
            </h1>
            <p className="hero__subtitle" style={{ color: currentTheme.muted }}>
                {lang ? uiStrings.heroSubtitle : "Select the language for your brief"}
            </p>
            <div className="hero__buttons">
                {PRIMARY_LANGUAGES.map(([code, label, flag]) => (
                    <button
                        key={code}
                        type="button"
                        onClick={() => onStart(code)}
                        className="hero__lang-btn"
                        style={{
                            border: `1px solid ${currentTheme.optBdr}`,
                            background: currentTheme.optBg,
                            color: currentTheme.text,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {flag}
                        <span>{label}</span>
                    </button>
                ))}
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <button
                    type="button"
                    onClick={() => setShowOthers(!showOthers)}
                    className="hero__lang-btn hero__lang-btn--other"
                    style={{
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        border: 'none',
                        background: 'transparent',
                        color: currentTheme.muted,
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                >
                    {lang ? uiStrings.otherLanguages : "Other languages"}
                </button>

                {showOthers && (
                    <div className="hero__buttons hero__buttons--secondary" style={{ marginTop: '0', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                        {OTHER_LANGUAGES.map(([code, label, flag]) => (
                            <button
                                key={code}
                                type="button"
                                onClick={() => onStart(code)}
                                className="hero__lang-btn"
                                style={{
                                    border: `1px solid ${currentTheme.optBdr}`,
                                    background: currentTheme.optBg,
                                    color: currentTheme.text,
                                    padding: '6px 14px',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                {flag && flag}
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
