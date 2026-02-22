/**
 * Creates a field definition object.
 * @param {string} key - Unique field identifier
 * @param {string} type - Field type: 'text', 'url', 'ta' (textarea), 'sel' (select), 'mc' (multi-check)
 * @param {Object} label - Localized labels { ru, en, ua }
 * @param {Object} [options] - Optional config
 * @param {boolean} [options.required] - Is field required
 * @param {Object} [options.hint] - Localized hints { ru, en, ua }
 * @param {Object} [options.choices] - Localized options { ru: [...], en: [...], ua: [...] }
 */
function createField(key, type, label, options) {
    const field = { key, type, label };
    if (options) {
        if (options.required) field.required = true;
        if (options.hint) field.hint = options.hint;
        if (options.choices) field.choices = options.choices;
    }
    return field;
}

export const fields = [
    [
        // Step 0: About business
        createField("brandName", "text", { ru: "Название бренда", en: "Brand name", ua: "Назва бренду", lt: "Prekės ženklo pavadinimas" }, {
            required: true,
            hint: { ru: "Как называется ваш бизнес?", en: "What is your business called?", ua: "Як називається бізнес?", lt: "Kaip vadinasi jūsų verslas?" },
        }),
        createField("industry", "ta", { ru: "Сфера деятельности", en: "Industry", ua: "Сфера діяльності", lt: "Veiklos sritis" }, {
            required: true,
            hint: { ru: "Чем занимается ваш бизнес?", en: "What does your business do?", ua: "Чим займається бізнес?", lt: "Kuo užsiima jūsų verslas?" },
        }),
        createField("usp", "ta", { ru: "Главное преимущество", en: "Main advantage", ua: "Головна перевага", lt: "Pagrindinis privalumas" }, {
            hint: { ru: "Почему клиенты выбирают вас?", en: "Why do clients choose you?", ua: "Чому обирають вас?", lt: "Kodėl klientai renkasi jus?" },
        }),
        createField("audience", "ta", { ru: "Типичный клиент", en: "Typical client", ua: "Типовий клієнт", lt: "Tipiškas klientas" }, {
            hint: { ru: "Пол, возраст, интересы", en: "Gender, age, interests", ua: "Стать, вік, інтереси", lt: "Lytis, amžius, pomėgiai" },
        }),
        createField("tone", "sel", { ru: "Тон общения", en: "Tone", ua: "Тон спілкування", lt: "Bendravimo tonas" }, {
            required: true,
            choices: {
                ru: ["Формальный", "Дружелюбный", "Премиальный", "С юмором"],
                en: ["Formal", "Friendly", "Premium", "Fun"],
                ua: ["Формальний", "Дружній", "Преміальний", "З гумором"],
                lt: ["Formalus", "Draugiškas", "Premium", "Su humoru"],
            },
        }),
    ],
    [
        // Step 1: Goals
        createField("siteGoal", "mc", { ru: "Задача сайта", en: "Purpose", ua: "Завдання", lt: "Svetainės užduotis" }, {
            required: true,
            choices: {
                ru: ["Продажа услуг", "Визитка", "Онлайн-запись", "Сбор заявок", "Продажа товаров"],
                en: ["Sell services", "Business card", "Online booking", "Lead gen", "Sell products"],
                ua: ["Продаж послуг", "Візитка", "Онлайн-запис", "Збір заявок", "Продаж товарів"],
                lt: ["Paslaugų pardavimas", "Vizitinė kortelė", "Registracija internetu", "Užklausų surinkimas", "Prekių pardavimas"],
            },
        }),
        createField("cta", "mc", { ru: "Целевое действие", en: "Target action", ua: "Цільова дія", lt: "Tikslinis veiksmas" }, {
            required: true,
            choices: {
                ru: ["Позвонить", "Записаться", "Написать", "Оставить заявку", "Купить"],
                en: ["Call", "Book", "Message", "Enquiry", "Purchase"],
                ua: ["Зателефонувати", "Записатися", "Написати", "Заявка", "Купити"],
                lt: ["Paskambinti", "Užsiregistruoti", "Parašyti", "Palikti užklausą", "Pirkti"],
            },
        }),
        createField("languages", "mc", { ru: "Языки сайта", en: "Languages", ua: "Мови сайту", lt: "Svetainės kalbos" }, {
            required: true,
            choices: {
                ru: ["Русский", "English", "Lietuvių", "Українська"],
                en: ["Russian", "English", "Lithuanian", "Ukrainian"],
                ua: ["Українська", "English", "Lietuvių", "Російська"],
                lt: ["Rusų", "Anglų", "Lietuvių", "Ukrainiečių"],
            },
        }),
        createField("currentSite", "url", { ru: "Текущий сайт", en: "Current site", ua: "Поточний сайт", lt: "Dabartinė svetainė" }),
    ],
    [
        // Step 2: Structure
        createField("sections", "mc", { ru: "Разделы", en: "Sections", ua: "Розділи", lt: "Skyriai" }, {
            required: true,
            choices: {
                ru: ["Главная", "О нас", "Услуги", "Цены", "Галерея", "Отзывы", "Блог", "FAQ", "Контакты"],
                en: ["Home", "About", "Services", "Pricing", "Gallery", "Reviews", "Blog", "FAQ", "Contact"],
                ua: ["Головна", "Про нас", "Послуги", "Ціни", "Галерея", "Відгуки", "Блог", "FAQ", "Контакти"],
                lt: ["Pagrindinis", "Apie mus", "Paslaugos", "Kainos", "Galerija", "Atsiliepimai", "Blogas", "DUK", "Kontaktai"],
            },
        }),
        createField("servicesText", "ta", { ru: "Услуги и цены", en: "Services & pricing", ua: "Послуги та ціни", lt: "Paslaugos ir kainos" }, {
            hint: { ru: "Перечислите услуги с ценами", en: "List services with prices", ua: "Перелічіть послуги з цінами", lt: "Išvardinkite paslaugas su kainomis" },
        }),
        createField("mainText", "ta", { ru: "Тексты для сайта", en: "Key messages", ua: "Тексти для сайту", lt: "Tekstai svetainei" }, {
            hint: { ru: "Ключевые мысли для сайта", en: "Key ideas for the website", ua: "Ключові думки", lt: "Pagrindinės mintys svetainei" },
        }),
        createField("faq", "ta", { ru: "Частые вопросы", en: "FAQ", ua: "Часті питання", lt: "Dažnai užduodami klausimai" }),
        createField("reviews", "ta", { ru: "Отзывы", en: "Reviews", ua: "Відгуки", lt: "Atsiliepimai" }),
    ],
    [
        // Step 3: Visual style
        createField("colors", "text", { ru: "Фирменные цвета", en: "Brand colors", ua: "Фірмові кольори", lt: "Firminės spalvos" }, {
            hint: { ru: "HEX-коды или названия", en: "HEX codes or names", ua: "HEX-коди або назви", lt: "HEX kodai arba pavadinimai" },
        }),
        createField("ref1", "url", { ru: "Референс #1", en: "Reference #1", ua: "Референс #1", lt: "Nuoroda #1" }),
        createField("ref1note", "text", { ru: "Что нравится в #1?", en: "What do you like about #1?", ua: "Що подобається в #1?", lt: "Kas patinka #1?" }),
        createField("ref2", "url", { ru: "Референс #2", en: "Reference #2", ua: "Референс #2", lt: "Nuoroda #2" }),
        createField("ref2note", "text", { ru: "Что нравится в #2?", en: "What do you like about #2?", ua: "Що подобається в #2?", lt: "Kas patinka #2?" }),
        createField("dislike", "ta", { ru: "Что НЕ нравится?", en: "What do you NOT like?", ua: "Що НЕ подобається?", lt: "Kas NEPATINKA?" }),
        createField("photoLink", "url", { ru: "Ссылка на фото", en: "Photo link", ua: "Посилання на фото", lt: "Nuoroda į nuotraukas" }, {
            hint: { ru: "Google Drive / Dropbox", en: "Google Drive / Dropbox", ua: "Google Drive / Dropbox", lt: "Google Drive / Dropbox" },
        }),
        createField("photoStatus", "sel", { ru: "Состояние фото", en: "Photo status", ua: "Стан фото", lt: "Nuotraukų būklė" }, {
            choices: {
                ru: ["Фото готовы", "Нужна обработка", "Нет фото"],
                en: ["Ready", "Need editing", "No photos"],
                ua: ["Готові", "Потрібна обробка", "Немає"],
                lt: ["Nuotraukos paruoštos", "Reikia apdoroti", "Nėra nuotraukų"],
            },
        }),
    ],
    [
        // Step 4: Functionality
        createField("contactForm", "mc", { ru: "Заявки отправлять в", en: "Send enquiries to", ua: "Заявки відправляти в", lt: "Užklausas siųsti į" }, {
            choices: {
                ru: ["Email", "Telegram", "WhatsApp", "Не нужна"],
                en: ["Email", "Telegram", "WhatsApp", "Not needed"],
                ua: ["Email", "Telegram", "WhatsApp", "Не потрібна"],
                lt: ["El. paštas", "Telegram", "WhatsApp", "Nereikia"],
            },
        }),
        createField("contactEmail", "text", { ru: "Email для заявок", en: "Email", ua: "Email для заявок", lt: "El. paštas užklausoms" }),
        createField("contactTg", "text", { ru: "Telegram", en: "Telegram", ua: "Telegram", lt: "Telegram" }, {
            hint: { ru: "@username", en: "@username", ua: "@username", lt: "@username" },
        }),
        createField("contactWa", "text", { ru: "WhatsApp", en: "WhatsApp", ua: "WhatsApp", lt: "WhatsApp" }, {
            hint: { ru: "+370...", en: "+370...", ua: "+370...", lt: "+370..." },
        }),
        createField("booking", "sel", { ru: "Онлайн-запись", en: "Booking", ua: "Онлайн-запис", lt: "Registracija internetu" }, {
            choices: {
                ru: ["Не нужна", "Treatwell", "Calendly", "Другое"],
                en: ["Not needed", "Treatwell", "Calendly", "Other"],
                ua: ["Не потрібна", "Treatwell", "Calendly", "Інше"],
                lt: ["Nereikia", "Treatwell", "Calendly", "Kita"],
            },
        }),
        createField("instagram", "url", { ru: "Instagram", en: "Instagram", ua: "Instagram", lt: "Instagram" }),
        createField("facebook", "url", { ru: "Facebook", en: "Facebook", ua: "Facebook", lt: "Facebook" }),
        createField("tiktok", "url", { ru: "TikTok", en: "TikTok", ua: "TikTok", lt: "TikTok" }),
        createField("address", "text", { ru: "Адрес (Google Maps)", en: "Address (Maps)", ua: "Адреса (Maps)", lt: "Adresas (Google Maps)" }),
        createField("analytics", "mc", { ru: "Аналитика", en: "Analytics", ua: "Аналітика", lt: "Analitika" }, {
            choices: {
                ru: ["Google Analytics", "Meta Pixel", "Не нужна", "Консультация"],
                en: ["Google Analytics", "Meta Pixel", "Not needed", "Consultation"],
                ua: ["Google Analytics", "Meta Pixel", "Не потрібна", "Консультація"],
                lt: ["Google Analytics", "Meta Pixel", "Nereikia", "Konsultacija"],
            },
        }),
        createField("cms", "sel", { ru: "Админ-панель", en: "Admin panel", ua: "Адмін-панель", lt: "Admin panelė" }, {
            choices: {
                ru: ["Да", "Нет", "Консультация"],
                en: ["Yes", "No", "Consultation"],
                ua: ["Так", "Ні", "Консультація"],
                lt: ["Taip", "Ne", "Konsultacija"],
            },
            hint: { ru: "Менять контент самому", en: "Change content yourself", ua: "Міняти контент самому", lt: "Patiems keisti turinį" },
        }),
    ],
    [
        // Step 5: Technical
        createField("domainStatus", "sel", { ru: "Домен", en: "Domain", ua: "Домен", lt: "Domenas" }, {
            choices: {
                ru: ["Уже куплен", "Нужна помощь", "Есть идеи"],
                en: ["Already bought", "Need help", "Have ideas"],
                ua: ["Вже куплено", "Потрібна допомога", "Є ідеї"],
                lt: ["Jau nupirktas", "Reikia pagalbos", "Yra idėjų"],
            },
        }),
        createField("domain", "url", { ru: "Домен (если есть)", en: "Domain (if any)", ua: "Домен (якщо є)", lt: "Domenas (jei yra)" }),
        createField("hosting", "sel", { ru: "Хостинг", en: "Hosting", ua: "Хостинг", lt: "Talpinimas" }, {
            choices: {
                ru: ["Уже есть", "Нужна помощь", "Не знаю что это"],
                en: ["Already have", "Need help", "Don't know"],
                ua: ["Вже є", "Потрібна допомога", "Не знаю що це"],
                lt: ["Jau yra", "Reikia pagalbos", "Nežinau kas tai"],
            },
        }),
        createField("techEmail", "text", { ru: "Тех. почта", en: "Tech email", ua: "Тех. пошта", lt: "Techninis el. paštas" }),
    ],
    [
        // Step 6: Organizational
        createField("budget", "text", { ru: "Бюджет (€)", en: "Budget (€)", ua: "Бюджет (€)", lt: "Biudžetas (€)" }),
        createField("deadline", "text", { ru: "Срок готовности", en: "Delivery date", ua: "Термін готовності", lt: "Terminas" }),
        createField("contactPerson", "text", { ru: "Контактное лицо", en: "Contact person", ua: "Контактна особа", lt: "Kontaktinis asmuo" }, { required: true }),
        createField("contactMethod", "text", { ru: "Способ связи", en: "Contact method", ua: "Спосіб зв'язку", lt: "Susisiekimo būdas" }, {
            required: true,
            hint: { ru: "Телефон, email или мессенджер", en: "Phone, email or messenger", ua: "Телефон, email або месенджер", lt: "Telefonas, el. paštas arba Messenger" },
        }),
        createField("decisionMaker", "text", { ru: "Кто решает?", en: "Decision maker", ua: "Хто вирішує?", lt: "Kas priima sprendimą?" }),
        createField("extra", "ta", { ru: "Что-то ещё?", en: "Anything else?", ua: "Щось ще?", lt: "Kažkas dar?" }),
    ],
];
