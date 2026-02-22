import { useId } from "react";

export default function FieldRenderer({ field, value, error, currentLang, currentTheme, uiStrings, onUpdate, onToggle }) {
    const fieldId = useId();
    const translate = (obj) => (obj && obj[currentLang]) || (obj && obj.ru) || "";
    const labelText = translate(field.label);
    const hintText = translate(field.hint);
    const isRequired = field.required;

    const Label = () => (
        <label htmlFor={fieldId} className="field__label" style={{ color: currentTheme.label }}>
            {labelText}
            <span
                className={`field__badge ${isRequired ? "field__badge--required" : ""}`}
                style={{
                    background: isRequired ? currentTheme.reqBg : currentTheme.badgeBg,
                    color: isRequired ? undefined : currentTheme.badgeCol,
                }}
            >
                {isRequired ? uiStrings.required : uiStrings.optional}
            </span>
        </label>
    );

    const Hint = () =>
        hintText ? (
            <p className="field__hint" style={{ color: currentTheme.dim }}>
                {hintText}
            </p>
        ) : null;

    const inputStyle = {
        border: `1px solid ${error ? "#ef4444" : currentTheme.inputBdr}`,
        background: currentTheme.inputBg,
        color: currentTheme.text,
        boxShadow: currentTheme.shadow,
    };

    if (field.type === "text" || field.type === "url") {
        return (
            <div className="field">
                <Label />
                <Hint />
                <input
                    id={fieldId}
                    type={field.type === "url" ? "url" : "text"}
                    value={value || ""}
                    onChange={(e) => onUpdate(field.key, e.target.value)}
                    placeholder={field.type === "url" ? uiStrings.urlPlaceholder : uiStrings.placeholder}
                    className={`field__input ${error ? "field__input--error" : ""}`}
                    style={inputStyle}
                    aria-required={isRequired || undefined}
                    aria-invalid={error || undefined}
                />
            </div>
        );
    }

    if (field.type === "ta") {
        return (
            <div className="field">
                <Label />
                <Hint />
                <textarea
                    id={fieldId}
                    value={value || ""}
                    onChange={(e) => onUpdate(field.key, e.target.value)}
                    placeholder={uiStrings.placeholder}
                    rows={4}
                    className={`field__textarea ${error ? "field__textarea--error" : ""}`}
                    style={inputStyle}
                    aria-required={isRequired || undefined}
                    aria-invalid={error || undefined}
                />
            </div>
        );
    }

    if (field.type === "sel") {
        const options = translate(field.choices) || [];
        return (
            <div className="field">
                <Label />
                <Hint />
                <div className="field__options" role="radiogroup" aria-label={labelText}>
                    {options.map((option) => {
                        const isActive = value === option;
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => onUpdate(field.key, option)}
                                className="field__option-btn"
                                style={{
                                    border: `1px solid ${error ? "#ef4444" : isActive ? currentTheme.actBdr : currentTheme.optBdr}`,
                                    background: isActive ? currentTheme.actBg : currentTheme.optBg,
                                    color: isActive ? currentTheme.optActive : currentTheme.optText,
                                }}
                                role="radio"
                                aria-checked={isActive}
                            >
                                <span
                                    className={`field__radio-dot ${isActive ? "field__radio-dot--active" : ""}`}
                                    style={{
                                        borderColor: isActive ? "#6366f1" : currentTheme.rdBdr,
                                        boxShadow: isActive ? `inset 0 0 0 3px ${currentTheme.rdInset}` : "none",
                                    }}
                                />
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (field.type === "mc") {
        const options = translate(field.choices) || [];
        const selected = value || [];
        return (
            <div className="field">
                <Label />
                <Hint />
                <div className="field__options" role="group" aria-label={labelText}>
                    {options.map((option) => {
                        const isActive = selected.includes(option);
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => onToggle(field.key, option)}
                                className="field__option-btn"
                                style={{
                                    border: `1px solid ${error ? "#ef4444" : isActive ? currentTheme.actBdr : currentTheme.optBdr}`,
                                    background: isActive ? currentTheme.actBg : currentTheme.optBg,
                                    color: isActive ? currentTheme.optActive : currentTheme.optText,
                                }}
                                role="checkbox"
                                aria-checked={isActive}
                            >
                                <span
                                    className={`field__check-box ${isActive ? "field__check-box--active" : ""}`}
                                    style={{ borderColor: isActive ? "#6366f1" : currentTheme.rdBdr }}
                                >
                                    {isActive && "✓"}
                                </span>
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return null;
}
