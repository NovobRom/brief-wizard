import { useState } from "react";

const LANGUAGES = [
    ["en", "English"],
    ["ua", "Українська"],
    ["ru", "Русский"],
    ["lt", "Lietuvių"],
];

export default function LangSelect({ currentTheme, uiStrings, lang, setLang, fade, onStart }) {

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
            <div className="hero__buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '32px' }}>
                {LANGUAGES.map(([code, label]) => (
                    <button
                        key={code}
                        type="button"
                        onClick={() => setLang(code)}
                        className="hero__lang-btn"
                        style={{
                            border: `1px solid ${lang === code ? currentTheme.optActBdr : currentTheme.optBdr}`,
                            background: lang === code ? currentTheme.optActBg : currentTheme.optBg,
                            color: currentTheme.text,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '14px 24px',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            boxShadow: lang === code ? `0 0 0 1px ${currentTheme.optActBdr}` : 'none'
                        }}
                    >
                        <span>{label}</span>
                    </button>
                ))}
            </div>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                <button
                    type="button"
                    onClick={() => onStart(lang)}
                    className="nav-bar__next nav-bar__next--active"
                    style={{
                        padding: '16px 48px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        borderRadius: '30px',
                    }}
                >
                    {uiStrings.start || "Start →"}
                </button>
            </div>
        </div>
    );
}
