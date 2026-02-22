export default function SuccessScreen({ currentTheme, uiStrings }) {
    return (
        <div className="success">
            <div className="success__icon" aria-hidden="true">✓</div>
            <h1 className="success__title" style={{ backgroundImage: currentTheme.titleGrad }}>
                {uiStrings.successTitle}
            </h1>
            <p className="success__message" style={{ color: currentTheme.muted }}>
                {uiStrings.successMessage}
            </p>
        </div>
    );
}
