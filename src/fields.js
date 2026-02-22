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
        createField("cta", "mc", { ru: "Целевое действие пользователя", en: "Primary user action", ua: "Цільова дія користувача", lt: "Pagrindinis vartotojo veiksmas" }, {
            required: true,
            hint: { ru: "Что должен сделать посетитель в идеале?", en: "What is the ideal action a visitor should take?", ua: "Що в ідеалі має зробити відвідувач?", lt: "Koks yra idealus lankytojo veiksmas?" },
            choices: {
                ru: ["Позвонить", "Записаться онлайн", "Написать в мессенджер", "Оставить заявку в форме", "Купить товар"],
                en: ["Call by phone", "Book online", "Message in messenger", "Submit a form", "Buy a product"],
                ua: ["Зателефонувати", "Записатися онлайн", "Написати в месенджер", "Залишити заявку у формі", "Купити товар"],
                lt: ["Paskambinti", "Užsiregistruoti internetu", "Parašyti per Messenger", "Pateikti užklausą formoje", "Nupirkti prekę"],
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
        createField("ref1", "url", { ru: "Пример сайта, который вам нравится #1", en: "Example website you like #1", ua: "Приклад сайту, який вам подобається #1", lt: "Svetainės pavyzdys, kuris jums patinka #1" }, {
            hint: { ru: "Вставьте ссылку на любой сайт-ориентир (референс)", en: "Paste a link to any reference website", ua: "Вставте посилання на будь-який сайт-орієнтир (референс)", lt: "Įklijuokite nuorodą į bet kokią pavyzdinę svetainę (referencą)" }
        }),
        createField("ref1note", "text", { ru: "Что конкретно нравится в примере #1?", en: "What exactly do you like about example #1?", ua: "Що конкретно подобається у прикладі #1?", lt: "Kas tiksliai patinka pavyzdyje #1?" }, {
            hint: { ru: "Например: цвета, шрифты, расположение блоков, анимации", en: "For example: colors, fonts, layout, animations", ua: "Наприклад: кольори, шрифти, розташування блоків, анімації", lt: "Pavyzdžiui: spalvos, šriftai, blokų išdėstymas, animacijos" }
        }),
        createField("ref2", "url", { ru: "Пример сайта, который вам нравится #2", en: "Example website you like #2", ua: "Приклад сайту, який вам подобається #2", lt: "Svetainės pavyzdys, kuris jums patinka #2" }),
        createField("ref2note", "text", { ru: "Что конкретно нравится в примере #2?", en: "What exactly do you like about example #2?", ua: "Що конкретно подобається у прикладі #2?", lt: "Kas tiksliai patinka pavyzdyje #2?" }),
        createField("dislike", "ta", { ru: "Анти-примеры (что точно НЕ нужно)", en: "Anti-examples (what NOT to do)", ua: "Анти-приклади (чого точно НЕ треба)", lt: "Anti-pavyzdžiai (ko tiksliai NEREIKIA)" }, {
            hint: { ru: "Что вас раздражает на других сайтах?", en: "What annoys you on other websites?", ua: "Що вас дратує на інших сайтах?", lt: "Kas jus erzina kitose svetainėse?" }
        }),
        createField("photoLink", "url", { ru: "Ссылка на ваши фото/материалы", en: "Link to your photos/materials", ua: "Посилання на ваші фото/матеріали", lt: "Nuoroda į jūsų nuotraukas/medžiagas" }, {
            hint: { ru: "Ссылку на папку (Google Drive, Dropbox, Яндекс.Диск)", en: "Link to a folder (Google Drive, Dropbox, etc.)", ua: "Посилання на папку (Google Drive, Dropbox і т.д.)", lt: "Nuoroda į aplanką (Google Drive, Dropbox ir kt.)" },
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
        createField("cms", "sel", { ru: "Нужна ли админ-панель (CMS)?", en: "Do you need an admin panel (CMS)?", ua: "Чи потрібна адмін-панель (CMS)?", lt: "Ar reikalinga administravimo panelė (CMS)?" }, {
            choices: {
                ru: ["Да, хочу сам менять тексты и фото", "Нет, сайт будет меняться редко", "Нужна консультация"],
                en: ["Yes, I want to edit content myself", "No, the site won't change often", "Need consultation"],
                ua: ["Так, хочу сам міняти тексти та фото", "Ні, сайт змінюватиметься рідко", "Потрібна консультація"],
                lt: ["Taip, noriu pats keisti tekstus ir nuotraukas", "Ne, svetainė keisis retai", "Reikia konsultacijos"],
            },
            hint: { ru: "Это система управления сайтом (WordPress и т.д.)", en: "A Content Management System (like WordPress)", ua: "Це система управління сайтом (WordPress і т.д.)", lt: "Tai turinio valdymo sistema (pvz., WordPress)" },
        }),
    ],
    [
        // Step 5: Technical
        createField("domainStatus", "sel", { ru: "Домен (имя сайта в интернете: mysite.com)", en: "Domain (website address: mysite.com)", ua: "Домен (ім'я сайту в інтернеті: mysite.com)", lt: "Domenas (svetainės adresas: mysite.com)" }, {
            choices: {
                ru: ["Уже куплен", "Пока нет, нужна помощь с выбором", "Пока нет, но есть идеи названия"],
                en: ["Already purchased", "Not yet, need help choosing", "Not yet, but I have ideas for the name"],
                ua: ["Вже куплено", "Поки немає, потрібна допомога з вибором", "Поки немає, але є ідеї назви"],
                lt: ["Jau nupirktas", "Dar ne, reikia pagalbos pasirenkant", "Dar ne, bet turiu idėjų pavadinimui"],
            },
        }),
        createField("domain", "url", { ru: "Ваш домен (если уже куплен)", en: "Your domain (if already purchased)", ua: "Ваш домен (якщо вже куплено)", lt: "Jūsų domenas (jei jau nupirktas)" }),
        createField("hosting", "sel", { ru: "Хостинг (сервер, где хранятся файлы сайта)", en: "Hosting (server where files are stored)", ua: "Хостинг (сервер, де зберігаються файли сайту)", lt: "Talpinimas (serveris, kur saugomi svetainės failai)" }, {
            choices: {
                ru: ["Уже есть купленный хостинг", "Нет хостинга, нужна помощь", "Не знаю что это, доверюсь вам"],
                en: ["Already have purchased hosting", "No hosting, need help", "Don't know what this is, will trust you"],
                ua: ["Вже є куплений хостинг", "Немає хостингу, потрібна допомога", "Не знаю що це, довірюся вам"],
                lt: ["Jau turiu nupirktą talpinimą", "Neturiu talpinimo, reikia pagalbos", "Nežinau kas tai, pasikliausiu jumis"],
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
