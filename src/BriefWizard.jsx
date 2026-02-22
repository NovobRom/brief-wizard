import { useState, useEffect, useCallback } from "react";
import { themes } from "./themes.js";
import { uiStrings, stepNames, TOTAL_STEPS } from "./i18n.js";
import { fields } from "./fields.js";
import Wrapper from "./components/Wrapper.jsx";
import LangSelect from "./components/LangSelect.jsx";
import SuccessScreen from "./components/SuccessScreen.jsx";
import FieldRenderer from "./components/FieldRenderer.jsx";

const STORAGE_KEY = "brief-wizard-data";
const STORAGE_LANG_KEY = "brief-wizard-lang";

function loadSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function loadSavedLang() {
  try {
    return localStorage.getItem(STORAGE_LANG_KEY) || null;
  } catch {
    return null;
  }
}

export default function BriefWizard() {
  const [lang, setLang] = useState(loadSavedLang);
  const [theme, setTheme] = useState("dark");
  const [step, setStep] = useState(loadSavedLang() ? 0 : -1);
  const [data, setData] = useState(loadSavedData);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [fade, setFade] = useState("in");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const currentLang = lang || "ru";
  const currentTheme = themes[theme];
  const strings = uiStrings[currentLang];
  const currentStepNames = stepNames[currentLang];

  // ── Persist form data to localStorage ──
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* ignore quota errors */ }
  }, [data]);

  useEffect(() => {
    if (lang) {
      try {
        localStorage.setItem(STORAGE_LANG_KEY, lang);
      } catch { /* ignore */ }
    }
  }, [lang]);

  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_LANG_KEY);
    } catch { /* ignore */ }
  }, []);

  // ── Helpers ──
  const translate = (obj) => (obj && obj[currentLang]) || (obj && obj.ru) || "";

  const updateField = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const toggleField = (key, value) => {
    setData((prev) => {
      const arr = prev[key] || [];
      return { ...prev, [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value] };
    });
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  // ── Validation ──
  const validate = () => {
    if (step < 0) return true;
    const errs = {};
    (fields[step] || []).forEach((field) => {
      if (field.required) {
        const val = data[field.key];
        if (field.type === "mc") {
          if (!val || !val.length) errs[field.key] = true;
        } else if (!val || !String(val).trim()) {
          errs[field.key] = true;
        }
      }
    });
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  // ── Animation ──
  const animateTo = (callback) => {
    setFade("out");
    setTimeout(() => { callback(); setFade("in"); }, 220);
  };

  // ── Navigation ──
  const goNext = async () => {
    if (!validate()) return;
    if (step < TOTAL_STEPS - 1) {
      animateTo(() => setStep(step + 1));
    } else {
      setLoading(true);
      setSubmitError(null);
      try {
        const response = await fetch("/api/submit-brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: currentLang, ...data }),
        });
        if (!response.ok) {
          let message = `Server error (${response.status})`;
          try { const err = await response.json(); message = err.error || message; } catch { /* non-JSON response */ }
          throw new Error(message);
        }
        clearSavedData();
        animateTo(() => setSubmitted(true));
      } catch (error) {
        setSubmitError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const goPrev = () => animateTo(() => setStep(step > 0 ? step - 1 : -1));

  const startWithLang = (selectedLang) => {
    setLang(selectedLang);
    animateTo(() => setStep(0));
  };

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // ── Render: Success ──
  if (submitted) {
    return (
      <Wrapper currentTheme={currentTheme} theme={theme} onToggleTheme={toggleTheme}>
        <SuccessScreen currentTheme={currentTheme} uiStrings={strings} />
      </Wrapper>
    );
  }

  // ── Render: Language select ──
  if (step === -1) {
    return (
      <Wrapper currentTheme={currentTheme} theme={theme} onToggleTheme={toggleTheme}>
        <LangSelect
          currentTheme={currentTheme}
          uiStrings={strings}
          lang={lang}
          fade={fade}
          onStart={startWithLang}
        />
      </Wrapper>
    );
  }

  // ── Render: Form steps ──
  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const currentFields = fields[step] || [];

  return (
    <Wrapper currentTheme={currentTheme} theme={theme} onToggleTheme={toggleTheme}>
      {/* Progress bar */}
      <div className="progress-bar" style={{ background: currentTheme.progBg }}>
        <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Step counter */}
      <div className="step-counter" style={{ color: currentTheme.dim }}>
        {step + 1} {strings.of} {TOTAL_STEPS}
      </div>

      {/* Form content */}
      <div className={`step-form ${fade === "out" ? "step-form--fade-out" : "step-form--fade-in"}`}>
        <h2
          className="step-form__title"
          style={{ backgroundImage: currentTheme.titleGrad }}
        >
          {currentStepNames[step][0]}
        </h2>
        <p className="step-form__subtitle" style={{ color: currentTheme.dim }}>
          {currentStepNames[step][1]}
        </p>

        {currentFields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={data[field.key]}
            error={errors[field.key]}
            currentLang={currentLang}
            currentTheme={currentTheme}
            uiStrings={strings}
            onUpdate={updateField}
            onToggle={toggleField}
          />
        ))}

        {/* Navigation */}
        <div className="nav-bar" style={{ borderTop: `1px solid ${currentTheme.navBdr}` }}>
          <button
            type="button"
            className="nav-bar__back"
            onClick={goPrev}
            style={{ color: currentTheme.backCol }}
          >
            {strings.back}
          </button>
          <div className="nav-bar__right">
            {submitError && <p className="nav-bar__error">⚠ {submitError}</p>}
            <button
              type="button"
              className={`nav-bar__next ${loading ? "nav-bar__next--loading" : "nav-bar__next--active"}`}
              onClick={goNext}
              disabled={loading}
            >
              {loading ? strings.sending : step === TOTAL_STEPS - 1 ? strings.submit : strings.next}
            </button>
          </div>
        </div>
      </div>

      {/* Language switcher */}
      <div className="lang-switcher" style={{ background: currentTheme.switchBg }}>
        {["ru", "en", "ua"].map((code) => (
          <button
            key={code}
            type="button"
            className="lang-switcher__btn"
            onClick={() => setLang(code)}
            aria-label={`Switch to ${code.toUpperCase()}`}
            style={{
              background: lang === code ? currentTheme.miniActBg : "transparent",
              color: lang === code ? currentTheme.miniActCol : currentTheme.miniCol,
            }}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
    </Wrapper>
  );
}
