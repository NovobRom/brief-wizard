// ── Rate limiting (in-memory, resets per cold start) ──
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max requests per window

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.firstRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { firstRequest: now, count: 1 });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ── Required fields ──
const REQUIRED_FIELDS = ['brandName', 'tone', 'siteGoal', 'cta', 'languages', 'sections', 'contactPerson', 'contactMethod'];

function validateRequiredFields(data) {
  const missing = [];
  for (const key of REQUIRED_FIELDS) {
    const val = data[key];
    if (Array.isArray(val)) {
      if (!val.length) missing.push(key);
    } else if (!val || !String(val).trim()) {
      missing.push(key);
    }
  }
  return missing;
}

export default async function handler(req, res) {
  // ── CORS ──
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Rate limit ──
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const data = req.body;

  // ── Server-side validation ──
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const missingFields = validateRequiredFields(data);
  if (missingFields.length) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  // ── Helpers ──
  const str = (v) => (v && String(v).trim()) || '';
  const arr = (v) => Array.isArray(v) ? v : (v ? [v] : []);
  const strOrNull = (v) => str(v) || null;

  const langLabel = { ru: '🇷🇺 Русский', en: '🇬🇧 English', ua: '🇺🇦 Українська' };

  // ── Mappings (localized values → normalized Russian keys for Notion) ──
  const toneMap = {
    'Формальный': 'Формальный и профессиональный',
    'Formal': 'Формальный и профессиональный',
    'Формальний': 'Формальный и профессиональный',
    'Дружелюбный': 'Дружелюбный', 'Friendly': 'Дружелюбный', 'Дружній': 'Дружелюбный',
    'Премиальный': 'Премиальный', 'Premium': 'Премиальный', 'Преміальний': 'Премиальный',
    'С юмором': 'Лёгкий и с юмором', 'Fun': 'Лёгкий и с юмором', 'З гумором': 'Лёгкий и с юмором',
  };

  const ctaMap = {
    'Позвонить': 'Позвонить', 'Call': 'Позвонить', 'Зателефонувати': 'Позвонить',
    'Записаться': 'Записаться онлайн', 'Book': 'Записаться онлайн', 'Записатися': 'Записаться онлайн',
    'Написать': 'Написать в мессенджер', 'Message': 'Написать в мессенджер', 'Написати': 'Написать в мессенджер',
    'Оставить заявку': 'Оставить заявку', 'Enquiry': 'Оставить заявку', 'Заявка': 'Оставить заявку',
    'Купить': 'Купить', 'Purchase': 'Купить', 'Купити': 'Купить',
  };

  const goalMap = {
    'Продажа услуг': 'Продажа услуг', 'Sell services': 'Продажа услуг', 'Продаж послуг': 'Продажа услуг',
    'Визитка': 'Визитка', 'Business card': 'Визитка', 'Візитка': 'Визитка',
    'Онлайн-запись': 'Онлайн-запись', 'Online booking': 'Онлайн-запись', 'Онлайн-запис': 'Онлайн-запись',
    'Сбор заявок': 'Сбор заявок', 'Lead gen': 'Сбор заявок', 'Збір заявок': 'Сбор заявок',
    'Продажа товаров': 'Продажа товаров', 'Sell products': 'Продажа товаров', 'Продаж товарів': 'Продажа товаров',
  };

  const sectionsMap = {
    'Главная': 'Главная', 'Home': 'Главная', 'Головна': 'Главная',
    'О нас': 'О нас', 'About': 'О нас', 'Про нас': 'О нас',
    'Услуги': 'Услуги', 'Services': 'Услуги', 'Послуги': 'Услуги',
    'Цены': 'Цены', 'Pricing': 'Цены', 'Ціни': 'Цены',
    'Галерея': 'Галерея', 'Gallery': 'Галерея',
    'Отзывы': 'Отзывы', 'Reviews': 'Отзывы', 'Відгуки': 'Отзывы',
    'Блог': 'Блог', 'Blog': 'Блог',
    'FAQ': 'FAQ',
    'Контакты': 'Контакты', 'Contact': 'Контакты', 'Контакти': 'Контакты',
  };

  const mapArr = (val, map) => arr(val).map((v) => map[v] || v).filter(Boolean);
  const mapOne = (val, map) => map[val] || str(val);

  const projectTitle = [
    str(data.brandName) || 'Новый клиент',
    str(data.contactPerson) ? ` — ${str(data.contactPerson)}` : '',
  ].join('');

  const budgetNum = data.budget
    ? parseFloat(String(data.budget).replace(/[^0-9.]/g, '')) || null
    : null;

  const cmsMap = (v) => {
    if (!v) return null;
    if (['Да', 'Yes', 'Так'].includes(v)) return 'Да';
    if (['Нет', 'No', 'Ні'].includes(v)) return 'Нет';
    return 'Нужна консультация';
  };

  // ── Notion properties ──
  const properties = {
    'Проект': { title: [{ text: { content: projectTitle } }] },
    'Статус': { select: { name: '📋 Анкета заполнена' } },
  };

  const setText = (key, val) => { if (str(val)) properties[key] = { rich_text: [{ text: { content: str(val) } }] }; };
  const setEmail = (key, val) => { if (str(val)) properties[key] = { email: str(val) }; };
  const setPhone = (key, val) => { if (str(val)) properties[key] = { phone_number: str(val) }; };
  const setUrl = (key, val) => { if (str(val)) properties[key] = { url: str(val) }; };
  const setSelect = (key, val) => { if (val) properties[key] = { select: { name: val } }; };
  const setMulti = (key, vals) => { if (vals && vals.length) properties[key] = { multi_select: vals.map((n) => ({ name: n })) }; };

  setText('Клиент', data.brandName);
  setText('Сфера деятельности', data.industry);
  setText('УТП (преимущество)', data.usp);
  setText('Целевая аудитория', data.audience);
  setText('Контактное лицо', data.contactPerson);
  setText('Способ связи', data.contactMethod);
  setText('ЛПР (кто решает)', data.decisionMaker);
  setText('Адрес (Google Maps)', data.address);
  setText('Фирменные цвета', data.colors);
  setText('Что НЕ нравится в дизайне', data.dislike);
  setText('Telegram', data.contactTg);

  setEmail('Email для заявок', data.contactEmail);
  setEmail('Тех. почта', data.techEmail);
  setPhone('WhatsApp', data.contactWa);

  setUrl('Текущий сайт', data.currentSite);
  setUrl('Домен', data.domain);
  setUrl('Референс 1', data.ref1);
  setUrl('Референс 2', data.ref2);
  setUrl('Ссылка на фото/медиа', data.photoLink);
  setUrl('Instagram', data.instagram);
  setUrl('Facebook', data.facebook);
  setUrl('TikTok', data.tiktok);

  if (budgetNum) properties['Бюджет (€)'] = { number: budgetNum };

  setSelect('Тон общения', mapOne(data.tone, toneMap));
  setSelect('Статус домена', strOrNull(data.domainStatus));
  setSelect('Хостинг', strOrNull(data.hosting));
  setSelect('Онлайн-запись', strOrNull(data.booking));
  setSelect('Админ-панель', cmsMap(data.cms));
  setSelect('Обработка фото', strOrNull(data.photoStatus));
  setSelect('Язык анкеты', langLabel[data.lang] || null);

  setMulti('Цель сайта', mapArr(data.siteGoal, goalMap));
  setMulti('Целевое действие (CTA)', mapArr(data.cta, ctaMap));
  setMulti('Языки сайта', arr(data.languages));
  setMulti('Разделы сайта', mapArr(data.sections, sectionsMap));
  setMulti('Заявки куда', arr(data.contactForm));
  setMulti('Аналитика', arr(data.analytics));

  // ── Helpers for page body ──
  const val = (v, fallback = '—') => str(v) || fallback;
  const valArr = (v, fallback = '—') => arr(v).length ? arr(v).join(', ') : fallback;

  const para = (text) => ({
    object: 'block', type: 'paragraph',
    paragraph: { rich_text: [{ text: { content: text } }] },
  });

  const boldPara = (label, value) => ({
    object: 'block', type: 'paragraph',
    paragraph: {
      rich_text: [
        { text: { content: `${label}: ` }, annotations: { bold: true } },
        { text: { content: value } },
      ],
    },
  });

  const h2 = (text) => ({
    object: 'block', type: 'heading_2',
    heading_2: { rich_text: [{ text: { content: text } }] },
  });

  const h3 = (text) => ({
    object: 'block', type: 'heading_3',
    heading_3: { rich_text: [{ text: { content: text } }] },
  });

  const divider = () => ({ object: 'block', type: 'divider', divider: {} });

  const code = (text) => ({
    object: 'block', type: 'code',
    code: {
      rich_text: [{ text: { content: text } }],
      language: 'javascript',
    },
  });

  const callout = (text, emoji = '⚠️') => ({
    object: 'block', type: 'callout',
    callout: {
      icon: { type: 'emoji', emoji },
      rich_text: [{ text: { content: text } }],
    },
  });

  // ── Build AI prompt from template ──
  const siteType = valArr(data.siteGoal);
  const sections = mapArr(data.sections, sectionsMap);

  const contactDetails = [];
  if (str(data.contactEmail)) contactDetails.push(`Email: ${str(data.contactEmail)}`);
  if (str(data.contactTg)) contactDetails.push(`Telegram: ${str(data.contactTg)}`);
  if (str(data.contactWa)) contactDetails.push(`WhatsApp: ${str(data.contactWa)}`);

  const refs = [];
  if (str(data.ref1)) refs.push(`${str(data.ref1)}${str(data.ref1note) ? ` (${str(data.ref1note)})` : ''}`);
  if (str(data.ref2)) refs.push(`${str(data.ref2)}${str(data.ref2note) ? ` (${str(data.ref2note)})` : ''}`);

  const socialLinks = [];
  if (str(data.instagram)) socialLinks.push(`Instagram: ${str(data.instagram)}`);
  if (str(data.facebook)) socialLinks.push(`Facebook: ${str(data.facebook)}`);
  if (str(data.tiktok)) socialLinks.push(`TikTok: ${str(data.tiktok)}`);

  const domainStatus = str(data.domainStatus) || '—';
  const sslStatus = domainStatus === 'Уже куплен' || domainStatus === 'Already bought' || domainStatus === 'Вже куплено'
    ? 'Нужен'
    : '—';

  const aiPrompt = `Create a professional ${siteType} website for ${val(data.brandName)}.

Business: ${val(data.industry)}
USP: ${val(data.usp)}
Target audience: ${val(data.audience)}
Tone of voice: ${mapOne(data.tone, toneMap) || val(data.tone)}
Primary CTA: ${valArr(data.cta)}
Languages: ${valArr(data.languages)}

Pages/sections needed:
${sections.length ? sections.map((s) => `- ${s}`).join('\n') : '— not specified'}

Services:
${val(data.servicesText)}

Design preferences:
- Liked references: ${refs.length ? refs.join('\n  ') : '— not specified'}
- Avoid: ${val(data.dislike)}
- Brand colors: ${val(data.colors)}
- Logo: attached

Functional requirements:
- Contact form → ${contactDetails.length ? contactDetails.join(', ') : '— not specified'}
- Booking: ${val(data.booking)}
- Social links: ${socialLinks.length ? socialLinks.join(', ') : '— not specified'}
- Google Maps: ${val(data.address)}
- Analytics: ${valArr(data.analytics)}
- CMS needed: ${cmsMap(data.cms) || '— not specified'}

Content provided:
${val(data.mainText)}

FAQ:
${val(data.faq)}

Reviews/testimonials:
${val(data.reviews)}

Technical:
- Domain: ${val(data.domain)}
- SSL: ${sslStatus}
- GDPR/Cookie compliance: required (EU/Lithuania)

Please create a modern, responsive, SEO-optimized website with clean design.`;

  // ── Page children blocks (Notion page body) ──
  const children = [
    // Brief details
    h2('📝 Детали брифа'),
    divider(),
    boldPara('Услуги и цены', val(data.servicesText)),
    boldPara('Тексты для сайта', val(data.mainText)),
    boldPara('FAQ', val(data.faq)),
    boldPara('Отзывы', val(data.reviews)),
    boldPara('Нравится в референсе 1', val(data.ref1note)),
    boldPara('Нравится в референсе 2', val(data.ref2note)),
    boldPara('Дополнительно', val(data.extra)),
    divider(),

    // Internal block
    h2('🔒 ВНУТРЕННИЙ БЛОК (НЕ ПОКАЗЫВАТЬ КЛИЕНТУ)'),
    callout('Этот раздел только для внутреннего использования. Перед отправкой клиенту удалите всё ниже этой линии.'),
    divider(),

    // Project notes
    h3('📝 Заметки по проекту'),
    para('Твои заметки, наблюдения, договорённости с клиентом'),
    divider(),

    // AI prompt
    h3('🤖 Промпт для AI-агента'),
    para('Скопируй заполненные данные из анкеты и вставь в этот шаблон промпта:'),
    code(aiPrompt),
    divider(),

    // Project checklist
    h3('✅ Чеклист проекта'),
    ...([
      'Анкета получена и проверена',
      'Все материалы от клиента собраны (фото, логотип, тексты)',
      'Домен и хостинг настроены',
      'Техническая почта создана',
      'Первая версия сайта готова',
      'Отправлена на согласование клиенту',
      'Правки внесены',
      'SSL установлен',
      'Cookie/GDPR баннер добавлен',
      'Google Analytics / Meta Pixel подключён',
      'Мобильная версия проверена',
      'SEO мета-теги заполнены',
      'Скорость загрузки проверена',
      'Финальное согласование от клиента',
      'Оплата получена',
      'Доступы переданы клиенту',
      'Проект закрыт',
    ].map((item) => ({
      object: 'block', type: 'to_do',
      to_do: { rich_text: [{ text: { content: item } }], checked: false },
    }))),
    divider(),

    // Working links
    h3('📁 Рабочие ссылки'),
    boldPara('Рабочая версия сайта', 'ссылка'),
    boldPara('Папка с материалами клиента', 'ссылка'),
    boldPara('Логин/пароль от хостинга', 'хранить в отдельном менеджере паролей'),
    boldPara('Figma / макет', 'ссылка'),
  ].filter(Boolean);

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties,
        children,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Notion API error:', JSON.stringify(errorBody, null, 2));
      return res.status(500).json({ error: errorBody.message || 'Notion API error' });
    }

    const result = await response.json();
    return res.status(200).json({ success: true, pageId: result.id });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Failed to save brief to Notion' });
  }
}
