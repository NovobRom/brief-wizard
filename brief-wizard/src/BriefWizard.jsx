import { useState } from "react";

const themes = {
  dark: {
    bg: "linear-gradient(165deg, #0a0a0f 0%, #0f1118 40%, #121520 100%)",
    text: "#f0f0f0", muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.3)",
    label: "rgba(255,255,255,0.85)", optText: "rgba(255,255,255,0.7)", optActive: "#e0e0ff",
    titleGrad: "linear-gradient(135deg, #f0f0f0 0%, #a5a5b8 100%)",
    inputBg: "rgba(255,255,255,0.03)", inputBdr: "rgba(255,255,255,0.08)",
    optBg: "rgba(255,255,255,0.03)", optBdr: "rgba(255,255,255,0.08)",
    actBg: "rgba(99,102,241,0.12)", actBdr: "#6366f1",
    rdBdr: "rgba(255,255,255,0.15)", navBdr: "rgba(255,255,255,0.05)",
    backCol: "rgba(255,255,255,0.4)", progBg: "rgba(255,255,255,0.05)",
    badgeBg: "rgba(255,255,255,0.06)", badgeCol: "rgba(255,255,255,0.3)",
    reqBg: "rgba(255,107,107,0.15)", switchBg: "rgba(0,0,0,0.5)",
    miniCol: "rgba(255,255,255,0.3)", miniActBg: "rgba(99,102,241,0.2)", miniActCol: "#a78bfa",
    themeBg: "rgba(255,255,255,0.06)", themeCol: "rgba(255,255,255,0.5)",
    rdInset: "#0f1118", shadow: "none",
  },
  light: {
    bg: "linear-gradient(165deg, #f8f9fc 0%, #eef0f5 40%, #e8ebf2 100%)",
    text: "#1a1a2e", muted: "rgba(26,26,46,0.55)", dim: "rgba(26,26,46,0.35)",
    label: "rgba(26,26,46,0.85)", optText: "rgba(26,26,46,0.7)", optActive: "#312e81",
    titleGrad: "linear-gradient(135deg, #1a1a2e 0%, #4a4a6a 100%)",
    inputBg: "rgba(255,255,255,0.7)", inputBdr: "rgba(26,26,46,0.12)",
    optBg: "rgba(255,255,255,0.6)", optBdr: "rgba(26,26,46,0.1)",
    actBg: "rgba(99,102,241,0.08)", actBdr: "#6366f1",
    rdBdr: "rgba(26,26,46,0.2)", navBdr: "rgba(26,26,46,0.08)",
    backCol: "rgba(26,26,46,0.4)", progBg: "rgba(26,26,46,0.06)",
    badgeBg: "rgba(26,26,46,0.06)", badgeCol: "rgba(26,26,46,0.35)",
    reqBg: "rgba(239,68,68,0.1)", switchBg: "rgba(255,255,255,0.8)",
    miniCol: "rgba(26,26,46,0.35)", miniActBg: "rgba(99,102,241,0.12)", miniActCol: "#6366f1",
    themeBg: "rgba(26,26,46,0.06)", themeCol: "rgba(26,26,46,0.5)",
    rdInset: "#f0f2f5", shadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
};

const ui = {
  ru: { req: "Обязательное", opt: "Необязательно", ph: "Введите ответ...", url: "https://...", next: "Далее →", back: "← Назад", submit: "Отправить бриф", of: "из", hero: "Создадим ваш идеальный сайт", heroSub: "Заполните бриф — это займёт ~10 минут. Чем подробнее ответите, тем точнее результат.", ok: "Спасибо!", okMsg: "Мы получили ваш бриф и свяжемся в течение 24 часов." },
  en: { req: "Required", opt: "Optional", ph: "Enter your answer...", url: "https://...", next: "Next →", back: "← Back", submit: "Submit brief", of: "of", hero: "Let's create your perfect website", heroSub: "Fill out this brief — it takes about 10 minutes. The more detail, the better.", ok: "Thank you!", okMsg: "We've received your brief and will contact you within 24 hours." },
  ua: { req: "Обов'язкове", opt: "Необов'язково", ph: "Введіть відповідь...", url: "https://...", next: "Далі →", back: "← Назад", submit: "Відправити бриф", of: "з", hero: "Створимо ваш ідеальний сайт", heroSub: "Заповніть бриф — це займе ~10 хвилин. Чим детальніше, тим точніше результат.", ok: "Дякуємо!", okMsg: "Ми отримали ваш бриф і зв'яжемося протягом 24 годин." },
};

const stepNames = {
  ru: [["О вашем бизнесе","Расскажите о себе"],["Цели сайта","Что сайт должен делать?"],["Структура","Какие разделы нужны?"],["Визуальный стиль","Покажите что нравится"],["Функционал","Что сайт должен уметь?"],["Техническая часть","Домен и хостинг"],["Организационное","Финальные детали"]],
  en: [["About your business","Tell us about yourself"],["Website goals","What should the site do?"],["Structure","Which sections?"],["Visual style","Show us what you like"],["Functionality","What should it do?"],["Technical details","Domain & hosting"],["Final details","Organizational stuff"]],
  ua: [["Про ваш бізнес","Розкажіть про себе"],["Цілі сайту","Що сайт повинен робити?"],["Структура","Які розділи потрібні?"],["Візуальний стиль","Покажіть що подобається"],["Функціонал","Що сайт повинен вміти?"],["Технічна частина","Домен та хостинг"],["Організаційне","Фінальні деталі"]],
};

const F = (k, type, l, opts) => {
  const f = { k, type, l };
  if (opts) {
    if (opts.req) f.req = true;
    if (opts.h) f.h = opts.h;
    if (opts.o) f.o = opts.o;
  }
  return f;
};

const fields = [
  [// 0: Business
    F("brandName","text",{ru:"Название бренда",en:"Brand name",ua:"Назва бренду"},{req:true,h:{ru:"Как называется ваш бизнес?",en:"What is your business called?",ua:"Як називається бізнес?"}}),
    F("industry","ta",{ru:"Сфера деятельности",en:"Industry",ua:"Сфера діяльності"},{req:true,h:{ru:"Чем занимается ваш бизнес?",en:"What does your business do?",ua:"Чим займається бізнес?"}}),
    F("usp","ta",{ru:"Главное преимущество",en:"Main advantage",ua:"Головна перевага"},{h:{ru:"Почему клиенты выбирают вас?",en:"Why do clients choose you?",ua:"Чому обирають вас?"}}),
    F("audience","ta",{ru:"Типичный клиент",en:"Typical client",ua:"Типовий клієнт"},{h:{ru:"Пол, возраст, интересы",en:"Gender, age, interests",ua:"Стать, вік, інтереси"}}),
    F("tone","sel",{ru:"Тон общения",en:"Tone",ua:"Тон спілкування"},{req:true,o:{ru:["Формальный","Дружелюбный","Премиальный","С юмором"],en:["Formal","Friendly","Premium","Fun"],ua:["Формальний","Дружній","Преміальний","З гумором"]}}),
  ],
  [// 1: Goals
    F("siteGoal","mc",{ru:"Задача сайта",en:"Purpose",ua:"Завдання"},{req:true,o:{ru:["Продажа услуг","Визитка","Онлайн-запись","Сбор заявок","Продажа товаров"],en:["Sell services","Business card","Online booking","Lead gen","Sell products"],ua:["Продаж послуг","Візитка","Онлайн-запис","Збір заявок","Продаж товарів"]}}),
    F("cta","mc",{ru:"Целевое действие",en:"Target action",ua:"Цільова дія"},{req:true,o:{ru:["Позвонить","Записаться","Написать","Оставить заявку","Купить"],en:["Call","Book","Message","Enquiry","Purchase"],ua:["Зателефонувати","Записатися","Написати","Заявка","Купити"]}}),
    F("languages","mc",{ru:"Языки сайта",en:"Languages",ua:"Мови сайту"},{req:true,o:{ru:["Русский","English","Lietuvių","Українська"],en:["Russian","English","Lithuanian","Ukrainian"],ua:["Українська","English","Lietuvių","Російська"]}}),
    F("currentSite","url",{ru:"Текущий сайт",en:"Current site",ua:"Поточний сайт"}),
  ],
  [// 2: Structure
    F("sections","mc",{ru:"Разделы",en:"Sections",ua:"Розділи"},{req:true,o:{ru:["Главная","О нас","Услуги","Цены","Галерея","Отзывы","Блог","FAQ","Контакты"],en:["Home","About","Services","Pricing","Gallery","Reviews","Blog","FAQ","Contact"],ua:["Головна","Про нас","Послуги","Ціни","Галерея","Відгуки","Блог","FAQ","Контакти"]}}),
    F("servicesText","ta",{ru:"Услуги и цены",en:"Services & pricing",ua:"Послуги та ціни"},{h:{ru:"Перечислите услуги с ценами",en:"List services with prices",ua:"Перелічіть послуги з цінами"}}),
    F("mainText","ta",{ru:"Тексты для сайта",en:"Key messages",ua:"Тексти для сайту"},{h:{ru:"Ключевые мысли для сайта",en:"Key ideas for the website",ua:"Ключові думки"}}),
    F("faq","ta",{ru:"Частые вопросы",en:"FAQ",ua:"Часті питання"}),
    F("reviews","ta",{ru:"Отзывы",en:"Reviews",ua:"Відгуки"}),
  ],
  [// 3: Visual
    F("colors","text",{ru:"Фирменные цвета",en:"Brand colors",ua:"Фірмові кольори"},{h:{ru:"HEX-коды или названия",en:"HEX codes or names",ua:"HEX-коди або назви"}}),
    F("ref1","url",{ru:"Референс #1",en:"Reference #1",ua:"Референс #1"}),
    F("ref1note","text",{ru:"Что нравится в #1?",en:"What do you like about #1?",ua:"Що подобається в #1?"}),
    F("ref2","url",{ru:"Референс #2",en:"Reference #2",ua:"Референс #2"}),
    F("ref2note","text",{ru:"Что нравится в #2?",en:"What do you like about #2?",ua:"Що подобається в #2?"}),
    F("dislike","ta",{ru:"Что НЕ нравится?",en:"What do you NOT like?",ua:"Що НЕ подобається?"}),
    F("photoLink","url",{ru:"Ссылка на фото",en:"Photo link",ua:"Посилання на фото"},{h:{ru:"Google Drive / Dropbox",en:"Google Drive / Dropbox",ua:"Google Drive / Dropbox"}}),
    F("photoStatus","sel",{ru:"Состояние фото",en:"Photo status",ua:"Стан фото"},{o:{ru:["Фото готовы","Нужна обработка","Нет фото"],en:["Ready","Need editing","No photos"],ua:["Готові","Потрібна обробка","Немає"]}}),
  ],
  [// 4: Functionality
    F("contactForm","mc",{ru:"Заявки отправлять в",en:"Send enquiries to",ua:"Заявки відправляти в"},{o:{ru:["Email","Telegram","WhatsApp","Не нужна"],en:["Email","Telegram","WhatsApp","Not needed"],ua:["Email","Telegram","WhatsApp","Не потрібна"]}}),
    F("contactEmail","text",{ru:"Email для заявок",en:"Email",ua:"Email для заявок"}),
    F("contactTg","text",{ru:"Telegram",en:"Telegram",ua:"Telegram"},{h:{ru:"@username",en:"@username",ua:"@username"}}),
    F("contactWa","text",{ru:"WhatsApp",en:"WhatsApp",ua:"WhatsApp"},{h:{ru:"+370...",en:"+370...",ua:"+370..."}}),
    F("booking","sel",{ru:"Онлайн-запись",en:"Booking",ua:"Онлайн-запис"},{o:{ru:["Не нужна","Treatwell","Calendly","Другое"],en:["Not needed","Treatwell","Calendly","Other"],ua:["Не потрібна","Treatwell","Calendly","Інше"]}}),
    F("instagram","url",{ru:"Instagram",en:"Instagram",ua:"Instagram"}),
    F("facebook","url",{ru:"Facebook",en:"Facebook",ua:"Facebook"}),
    F("tiktok","url",{ru:"TikTok",en:"TikTok",ua:"TikTok"}),
    F("address","text",{ru:"Адрес (Google Maps)",en:"Address (Maps)",ua:"Адреса (Maps)"}),
    F("analytics","mc",{ru:"Аналитика",en:"Analytics",ua:"Аналітика"},{o:{ru:["Google Analytics","Meta Pixel","Не нужна","Консультация"],en:["Google Analytics","Meta Pixel","Not needed","Consultation"],ua:["Google Analytics","Meta Pixel","Не потрібна","Консультація"]}}),
    F("cms","sel",{ru:"Админ-панель",en:"Admin panel",ua:"Адмін-панель"},{o:{ru:["Да","Нет","Консультация"],en:["Yes","No","Consultation"],ua:["Так","Ні","Консультація"]},h:{ru:"Менять контент самому",en:"Change content yourself",ua:"Міняти контент самому"}}),
  ],
  [// 5: Technical
    F("domainStatus","sel",{ru:"Домен",en:"Domain",ua:"Домен"},{o:{ru:["Уже куплен","Нужна помощь","Есть идеи"],en:["Already bought","Need help","Have ideas"],ua:["Вже куплено","Потрібна допомога","Є ідеї"]}}),
    F("domain","url",{ru:"Домен (если есть)",en:"Domain (if any)",ua:"Домен (якщо є)"}),
    F("hosting","sel",{ru:"Хостинг",en:"Hosting",ua:"Хостинг"},{o:{ru:["Уже есть","Нужна помощь","Не знаю что это"],en:["Already have","Need help","Don't know"],ua:["Вже є","Потрібна допомога","Не знаю що це"]}}),
    F("techEmail","text",{ru:"Тех. почта",en:"Tech email",ua:"Тех. пошта"}),
  ],
  [// 6: Org
    F("budget","text",{ru:"Бюджет (€)",en:"Budget (€)",ua:"Бюджет (€)"}),
    F("deadline","text",{ru:"Срок готовности",en:"Delivery date",ua:"Термін готовності"}),
    F("contactPerson","text",{ru:"Контактное лицо",en:"Contact person",ua:"Контактна особа"},{req:true}),
    F("contactMethod","text",{ru:"Способ связи",en:"Contact method",ua:"Спосіб зв'язку"},{req:true,h:{ru:"Телефон, email или мессенджер",en:"Phone, email or messenger",ua:"Телефон, email або месенджер"}}),
    F("decisionMaker","text",{ru:"Кто решает?",en:"Decision maker",ua:"Хто вирішує?"}),
    F("extra","ta",{ru:"Что-то ещё?",en:"Anything else?",ua:"Щось ще?"}),
  ],
];

export default function BriefWizard() {
  const [lang, setLang] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [step, setStep] = useState(-1);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [fade, setFade] = useState("in");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const c = lang || "ru";
  const th = themes[theme];
  const u = ui[c];
  const sn = stepNames[c];
  const totalSteps = 7;

  const T = (obj) => (obj && obj[c]) || (obj && obj.ru) || "";
  const upd = (k, v) => { setData(d => ({ ...d, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };
  const tog = (k, v) => { setData(d => { const a = d[k] || []; return { ...d, [k]: a.includes(v) ? a.filter(x => x !== v) : [...a, v] }; }); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  const validate = () => {
    if (step < 0) return true;
    const errs = {};
    (fields[step] || []).forEach(f => {
      if (f.req) {
        const v = data[f.k];
        if (f.type === "mc") { if (!v || !v.length) errs[f.k] = true; }
        else if (!v || !String(v).trim()) errs[f.k] = true;
      }
    });
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const anim = cb => { setFade("out"); setTimeout(() => { cb(); setFade("in"); }, 220); };

  const goNext = async () => {
    if (!validate()) return;
    if (step < totalSteps - 1) {
      anim(() => setStep(step + 1));
    } else {
      setLoading(true);
      setSubmitError(null);
      try {
        const res = await fetch("/api/submit-brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: c, ...data }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Server error");
        }
        anim(() => setSubmitted(true));
      } catch (e) {
        setSubmitError(e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const goPrev = () => anim(() => setStep(step > 0 ? step - 1 : -1));
  const start = l => { setLang(l); anim(() => setStep(0)); };

  // ─── Field component ───
  const Fld = ({ f }) => {
    const err = errors[f.k];
    const lbl = T(f.l);
    const hint = T(f.h);
    const Lbl = () => (
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 600, color: th.label, marginBottom: 6, transition: "color 0.3s" }}>
        {lbl}
        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, letterSpacing: "0.04em", textTransform: "uppercase", background: f.req ? th.reqBg : th.badgeBg, color: f.req ? "#ef4444" : th.badgeCol, transition: "all 0.3s" }}>
          {f.req ? u.req : u.opt}
        </span>
      </div>
    );
    const Hnt = () => hint ? <p style={{ fontSize: 13, color: th.dim, marginBottom: 10, marginTop: 0, lineHeight: 1.5 }}>{hint}</p> : null;
    const iS = { width: "100%", padding: "14px 16px", border: `1px solid ${err ? "#ef4444" : th.inputBdr}`, borderRadius: 10, background: th.inputBg, color: th.text, fontSize: 15, fontFamily: "inherit", outline: "none", transition: "all 0.3s", boxSizing: "border-box", boxShadow: th.shadow };

    if (f.type === "text" || f.type === "url") return <div style={{ marginBottom: 28 }}><Lbl /><Hnt /><input type={f.type === "url" ? "url" : "text"} value={data[f.k] || ""} onChange={e => upd(f.k, e.target.value)} placeholder={f.type === "url" ? u.url : u.ph} style={iS} /></div>;

    if (f.type === "ta") return <div style={{ marginBottom: 28 }}><Lbl /><Hnt /><textarea value={data[f.k] || ""} onChange={e => upd(f.k, e.target.value)} placeholder={u.ph} rows={4} style={{ ...iS, resize: "vertical", minHeight: 100, lineHeight: 1.6 }} /></div>;

    if (f.type === "sel") {
      const opts = T(f.o) || [];
      return <div style={{ marginBottom: 28 }}><Lbl /><Hnt /><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {opts.map(o => { const a = data[f.k] === o; return <button key={o} onClick={() => upd(f.k, o)} style={{ padding: "10px 16px", border: `1px solid ${err ? "#ef4444" : a ? th.actBdr : th.optBdr}`, borderRadius: 10, background: a ? th.actBg : th.optBg, color: a ? th.optActive : th.optText, fontSize: 14, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>
          <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${a ? "#6366f1" : th.rdBdr}`, background: a ? "#6366f1" : "transparent", boxShadow: a ? `inset 0 0 0 3px ${th.rdInset}` : "none", flexShrink: 0, transition: "all 0.15s" }} />{o}</button>; })}
      </div></div>;
    }

    if (f.type === "mc") {
      const opts = T(f.o) || []; const sel = data[f.k] || [];
      return <div style={{ marginBottom: 28 }}><Lbl /><Hnt /><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {opts.map(o => { const a = sel.includes(o); return <button key={o} onClick={() => tog(f.k, o)} style={{ padding: "10px 16px", border: `1px solid ${err ? "#ef4444" : a ? th.actBdr : th.optBdr}`, borderRadius: 10, background: a ? th.actBg : th.optBg, color: a ? th.optActive : th.optText, fontSize: 14, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>
          <span style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${a ? "#6366f1" : th.rdBdr}`, background: a ? "#6366f1" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", transition: "all 0.15s" }}>{a && "✓"}</span>{o}</button>; })}
      </div></div>;
    }
    return null;
  };

  const Wrap = ({ children }) => (
    <div style={{ minHeight: "100vh", background: th.bg, color: th.text, fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px 60px", transition: "background 0.5s, color 0.3s" }}>
      <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} style={{ position: "fixed", top: 14, left: 20, zIndex: 200, width: 40, height: 40, borderRadius: 10, border: "none", background: th.themeBg, color: th.themeCol, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", backdropFilter: "blur(10px)" }} title="Toggle theme">
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
      {children}
    </div>
  );

  if (submitted) return <Wrap>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 32, boxShadow: "0 0 60px rgba(34,197,94,0.3)" }}>✓</div>
      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16, background: th.titleGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{u.ok}</h1>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: th.muted, maxWidth: 500 }}>{u.okMsg}</p>
    </div>
  </Wrap>;

  if (step === -1) return <Wrap>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", textAlign: "center", maxWidth: 600, opacity: fade === "out" ? 0 : 1, transform: fade === "out" ? "translateY(20px)" : "translateY(0)", transition: "all 0.3s" }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 40, boxShadow: "0 0 60px rgba(99,102,241,0.3)" }}>W</div>
      <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 16, background: th.titleGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>
        {lang ? u.hero : "Choose language"}
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: th.muted, maxWidth: 440, marginBottom: 48 }}>
        {lang ? u.heroSub : "Select the language for your brief"}
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {[["ru","🇷🇺 Русский"],["en","🇬🇧 English"],["ua","🇺🇦 Українська"]].map(([cd,lb]) => (
          <button key={cd} onClick={() => start(cd)} style={{ padding: "16px 32px", border: `1px solid ${th.optBdr}`, borderRadius: 12, background: th.optBg, color: th.text, fontSize: 17, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}>{lb}</button>
        ))}
      </div>
    </div>
  </Wrap>;

  const progress = ((step + 1) / totalSteps) * 100;
  const fs = fields[step] || [];

  return <Wrap>
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: th.progBg, zIndex: 100 }}>
      <div style={{ height: "100%", background: "linear-gradient(90deg,#6366f1,#a78bfa)", width: `${progress}%`, transition: "width 0.4s", borderRadius: "0 2px 2px 0" }} />
    </div>
    <div style={{ position: "fixed", top: 16, right: 24, fontSize: 13, color: th.dim, fontWeight: 500, letterSpacing: "0.05em", zIndex: 100 }}>{step + 1} {u.of} {totalSteps}</div>

    <div style={{ width: "100%", maxWidth: 640, marginTop: 48, opacity: fade === "out" ? 0 : 1, transform: fade === "out" ? "translateY(15px)" : "translateY(0)", transition: "all 0.25s" }}>
      <h2 style={{ fontSize: "clamp(24px,4vw,34px)", fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em", background: th.titleGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{sn[step][0]}</h2>
      <p style={{ fontSize: 15, color: th.dim, marginBottom: 40, lineHeight: 1.5 }}>{sn[step][1]}</p>

      {fs.map(f => <Fld key={f.k} f={f} />)}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: `1px solid ${th.navBdr}` }}>
        <button onClick={goPrev} style={{ padding: "12px 24px", border: "none", borderRadius: 10, background: "transparent", color: th.backCol, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>{u.back}</button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          {submitError && <p style={{ fontSize: 13, color: "#ef4444", margin: 0 }}>⚠ {submitError}</p>}
          <button onClick={goNext} disabled={loading} style={{ padding: "14px 36px", border: "none", borderRadius: 12, background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg,#6366f1,#7c3aed)", color: "#fff", fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.3)", transition: "all 0.3s" }}>
            {loading ? "Sending..." : step === totalSteps - 1 ? u.submit : u.next}
          </button>
        </div>
      </div>
    </div>

    <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, background: th.switchBg, backdropFilter: "blur(10px)", borderRadius: 8, padding: 4, zIndex: 100 }}>
      {["ru","en","ua"].map(cd => (
        <button key={cd} onClick={() => setLang(cd)} style={{ padding: "6px 12px", border: "none", borderRadius: 6, background: lang === cd ? th.miniActBg : "transparent", color: lang === cd ? th.miniActCol : th.miniCol, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em", transition: "all 0.2s" }}>{cd.toUpperCase()}</button>
      ))}
    </div>
  </Wrap>;
}
