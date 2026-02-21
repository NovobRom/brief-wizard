export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const d = req.body;
  const str = (v) => (v && String(v).trim()) || '';
  const arr = (v) => Array.isArray(v) ? v : (v ? [v] : []);
  const strOrNull = (v) => str(v) || null;

  const langLabel = { ru: '🇷🇺 Русский', en: '🇬🇧 English', ua: '🇺🇦 Українська' };

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
    'Визитка': 'Визитка', 'Business card': 'Визитка',
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

  const mapArr = (val, map) => arr(val).map(v => map[v] || v).filter(Boolean);
  const mapOne = (val, map) => map[val] || str(val);

  const projectTitle = [
    str(d.brandName) || 'Новый клиент',
    str(d.contactPerson) ? ` — ${str(d.contactPerson)}` : '',
  ].join('');

  const budgetNum = d.budget
    ? parseFloat(String(d.budget).replace(/[^0-9.]/g, '')) || null
    : null;

  const cmsMap = (v) => {
    if (!v) return null;
    if (['Да','Yes','Так'].includes(v)) return 'Да';
    if (['Нет','No','Ні'].includes(v)) return 'Нет';
    return 'Нужна консультация';
  };

  // ── Notion properties ─────────────────────────────────────────────────────
  const properties = {
    'Проект': { title: [{ text: { content: projectTitle } }] },
    'Статус': { select: { name: '📋 Анкета заполнена' } },
  };

  const setText = (key, val) => { if (str(val)) properties[key] = { rich_text: [{ text: { content: str(val) } }] }; };
  const setEmail = (key, val) => { if (str(val)) properties[key] = { email: str(val) }; };
  const setPhone = (key, val) => { if (str(val)) properties[key] = { phone_number: str(val) }; };
  const setUrl = (key, val) => { if (str(val)) properties[key] = { url: str(val) }; };
  const setSelect = (key, val) => { if (val) properties[key] = { select: { name: val } }; };
  const setMulti = (key, vals) => { if (vals && vals.length) properties[key] = { multi_select: vals.map(n => ({ name: n })) }; };

  setText('Клиент', d.brandName);
  setText('Сфера деятельности', d.industry);
  setText('УТП (преимущество)', d.usp);
  setText('Целевая аудитория', d.audience);
  setText('Контактное лицо', d.contactPerson);
  setText('Способ связи', d.contactMethod);
  setText('ЛПР (кто решает)', d.decisionMaker);
  setText('Адрес (Google Maps)', d.address);
  setText('Фирменные цвета', d.colors);
  setText('Что НЕ нравится в дизайне', d.dislike);
  setText('Telegram', d.contactTg);

  setEmail('Email для заявок', d.contactEmail);
  setEmail('Тех. почта', d.techEmail);
  setPhone('WhatsApp', d.contactWa);

  setUrl('Текущий сайт', d.currentSite);
  setUrl('Домен', d.domain);
  setUrl('Референс 1', d.ref1);
  setUrl('Референс 2', d.ref2);
  setUrl('Ссылка на фото/медиа', d.photoLink);
  setUrl('Instagram', d.instagram);
  setUrl('Facebook', d.facebook);
  setUrl('TikTok', d.tiktok);

  if (budgetNum) properties['Бюджет (€)'] = { number: budgetNum };

  setSelect('Тон общения', mapOne(d.tone, toneMap));
  setSelect('Статус домена', strOrNull(d.domainStatus));
  setSelect('Хостинг', strOrNull(d.hosting));
  setSelect('Онлайн-запись', strOrNull(d.booking));
  setSelect('Админ-панель', cmsMap(d.cms));
  setSelect('Обработка фото', strOrNull(d.photoStatus));
  setSelect('Язык анкеты', langLabel[d.lang] || null);

  setMulti('Цель сайта', mapArr(d.siteGoal, goalMap));
  setMulti('Целевое действие (CTA)', mapArr(d.cta, ctaMap));
  setMulti('Языки сайта', arr(d.languages));
  setMulti('Разделы сайта', mapArr(d.sections, sectionsMap));
  setMulti('Заявки куда', arr(d.contactForm));
  setMulti('Аналитика', arr(d.analytics));

  // ── Helpers for page body ─────────────────────────────────────────────────
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

  // ── Build AI prompt with client data ─────────────────────────────────────
  const siteType = valArr(d.siteGoal);
  const sections = mapArr(d.sections, sectionsMap);

  const contactDetails = [];
  if (str(d.contactEmail)) contactDetails.push(`Email: ${str(d.contactEmail)}`);
  if (str(d.contactTg)) contactDetails.push(`Telegram: ${str(d.contactTg)}`);
  if (str(d.contactWa)) contactDetails.push(`WhatsApp: ${str(d.contactWa)}`);

  const refs = [];
  if (str(d.ref1)) refs.push(`${str(d.ref1)}${str(d.ref1note) ? ` (${str(d.ref1note)})` : ''}`);
  if (str(d.ref2)) refs.push(`${str(d.ref2)}${str(d.ref2note) ? ` (${str(d.ref2note)})` : ''}`);

  const socialLinks = [];
  if (str(d.instagram)) socialLinks.push(`Instagram: ${str(d.instagram)}`);
  if (str(d.facebook)) socialLinks.push(`Facebook: ${str(d.facebook)}`);
  if (str(d.tiktok)) socialLinks.push(`TikTok: ${str(d.tiktok)}`);

  const aiPrompt = `Create a professional ${siteType} website for ${val(d.brandName)}.

Business: ${val(d.industry)}
USP: ${val(d.usp)}
Target audience: ${val(d.audience)}
Tone of voice: ${mapOne(d.tone, toneMap) || val(d.tone)}
Primary CTA: ${valArr(d.cta)}
Languages: ${valArr(d.languages)}

Pages/sections needed:
${sections.length ? sections.map(s => `- ${s}`).join('\n') : '— not specified'}

Services:
${val(d.servicesText)}

Design preferences:
- Liked references: ${refs.length ? refs.join('\n  ') : '— not specified'}
- Avoid: ${val(d.dislike)}
- Brand colors: ${val(d.colors)}
- Photo status: ${val(d.photoStatus)}
- Photo link: ${val(d.photoLink)}

Functional requirements:
- Contact form → ${contactDetails.length ? contactDetails.join(', ') : '— not specified'}
- Booking: ${val(d.booking)}
- Social links: ${socialLinks.length ? socialLinks.join(', ') : '— not specified'}
- Google Maps: ${val(d.address)}
- Analytics: ${valArr(d.analytics)}
- CMS needed: ${cmsMap(d.cms) || '— not specified'}

Content provided:
${val(d.mainText)}

FAQ:
${val(d.faq)}

Reviews/testimonials:
${val(d.reviews)}

Technical:
- Domain: ${val(d.domain)} (${val(d.domainStatus)})
- Hosting: ${val(d.hosting)}
- Tech email: ${val(d.techEmail)}
- GDPR/Cookie compliance: required (EU/Lithuania)

Budget: ${budgetNum ? `€${budgetNum}` : '— not specified'}
Deadline: ${val(d.deadline)}
Contact: ${val(d.contactPerson)} — ${val(d.contactMethod)}
Decision maker: ${val(d.decisionMaker)}

Additional notes:
${val(d.extra)}

Please create a modern, responsive, SEO-optimized website with clean design.`;

  // ── Page children blocks ──────────────────────────────────────────────────
  const children = [
    h2('📝 Детали брифа'),
    divider(),
    boldPara('Услуги и цены', val(d.servicesText)),
    boldPara('Тексты для сайта', val(d.mainText)),
    boldPara('FAQ', val(d.faq)),
    boldPara('Отзывы', val(d.reviews)),
    boldPara('Нравится в референсе 1', val(d.ref1note)),
    boldPara('Нравится в референсе 2', val(d.ref2note)),
    boldPara('Дополнительно', val(d.extra)),
    divider(),
    h2('🔒 ВНУТРЕННИЙ БЛОК'),
    h3('🤖 Промпт для AI-агента'),
    para('Скопируй и вставь в ChatGPT / Claude / Cursor:'),
    code(aiPrompt),
    divider(),
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
    ].map(item => ({
      object: 'block', type: 'to_do',
      to_do: { rich_text: [{ text: { content: item } }], checked: false },
    }))),
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
