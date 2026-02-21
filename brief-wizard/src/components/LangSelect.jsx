const LANGUAGES = [
    ["ru", "🇷🇺 Русский"],
    ["en", "🇬🇧 English"],
    ["ua", "🇺🇦 Українська"],
];

export default function LangSelect({ currentTheme, uiStrings, lang, fade, onStart }) {
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
                {LANGUAGES.map(([code, label]) => (
                    <button
                        key={code}
                        type="button"
                        onClick={() => onStart(code)}
                        className="hero__lang-btn"
                        style={{
                            border: `1px solid ${currentTheme.optBdr}`,
                            background: currentTheme.optBg,
                            color: currentTheme.text,
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
