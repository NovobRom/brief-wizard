export default function Wrapper({ children, currentTheme, theme, onToggleTheme }) {
    return (
        <div
            className="wizard-wrap"
            style={{ background: currentTheme.bg, color: currentTheme.text }}
        >
            <button
                type="button"
                className="theme-toggle"
                onClick={onToggleTheme}
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                style={{ background: currentTheme.themeBg, color: currentTheme.themeCol }}
            >
                {theme === "dark" ? "☀️" : "🌙"}
            </button>
            {children}
        </div>
    );
}
