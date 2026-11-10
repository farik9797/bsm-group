"""Build the two language versions from one source, src/page.ru.html:

  index.html     Uzbek, the main page (the client asked for UZ first)
  ru/index.html  Russian

Strings are swapped whole, only as an element's text or a quoted value, longest first, so a short
phrase never eats part of a longer one. The build fails if a dictionary entry is not found or if
Cyrillic is left in the Uzbek page. Run after sprite.py / route.py / geo.py:  python3 tools/build.py
"""
import pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
SRC = (root / 'src/page.ru.html').read_text()

UZ = {
    # head
    'Доставка грузов из Китая в Узбекистан: BSM Logistics': 'Xitoydan O‘zbekistonga yuk tashish: BSM Logistics',
    'Авто, ж/д и авиадоставка из Китая в Ташкент. Свои склады в Иу, Гуанчжоу, Ляньюньгане, Хоргосе и Улугчате, таможенное оформление. Также Турция, Европа, Иран, Юго-Восточная Азия.':
        'Xitoydan Toshkentga avto, temir yo‘l va avia orqali yuk tashish. Yiwu, Guanchjou, Lianyungang, Xorgos va Ulug‘chatda o‘z omborlarimiz, bojxona rasmiylashtiruvi. Turkiya, Yevropa, Eron va Janubi-Sharqiy Osiyodan ham.',
    # navigation and chrome
    'К содержимому': 'Asosiy qismga o‘tish', 'BSM Logistics, на главную': 'BSM Logistics, bosh sahifa', 'Основное меню': 'Asosiy menyu',
    'Услуги': 'Xizmatlar', 'Склады': 'Omborlar', 'География': 'Geografiya', 'О компании': 'Kompaniya haqida', 'Как работаем': 'Qanday ishlaymiz',
    'Вопросы': 'Savollar', 'Новости': 'Yangiliklar', 'Контакты': 'Kontaktlar', 'Рассчитать перевозку': 'Narxni hisoblash',
    'Открыть меню': 'Menyuni ochish', 'Мобильное меню': 'Mobil menyu', 'Язык': 'Til', 'Разделы': 'Bo‘limlar', 'Закрыть': 'Yopish',
    'Быстрая связь': 'Tezkor aloqa', 'Позвонить': 'Qo‘ng‘iroq qilish',
    'Тёмная тема': 'Tungi rejim',
    # services
    'Автоперевозки': 'Avtotashuvlar', 'Ж/д перевозки': 'Temir yo‘l tashuvlari', 'Авиаперевозки': 'Aviatashuvlar',
    'Логистика по Китаю': 'Xitoy ichki logistikasi', 'Мультимодальные перевозки': 'Multimodal tashuvlar', 'Контейнерные перевозки': 'Konteyner tashuvlari',
    'Спецгрузы': 'Maxsus yuklar', 'Негабарит, ADR, рефрижератор': 'Negabarit, ADR, refrijerator', 'Таможенное оформление': 'Bojxona rasmiylashtiruvi',
    'Доставка по Узбекистану': 'O‘zbekiston bo‘ylab yetkazish',
    'Из Китая за 15–25 дней': 'Xitoydan 15–25 kunda', 'Из Китая за 30–35 дней': 'Xitoydan 30–35 kunda', 'Из Китая за 6–9 дней': 'Xitoydan 6–9 kunda',
    'Заберём груз у поставщика': 'Yukni yetkazib beruvchidan olamiz', 'Море, ж/д и авто по одному договору': 'Dengiz, temir yo‘l va avto bitta shartnomada',
    'FCL и LCL, 20, 40 и 45 футов': 'FCL va LCL, 20, 40 va 45 futlik', 'Спецтехника и разрешения': 'Maxsus texnika va ruxsatnomalar',
    'Коды ТН ВЭД, платежи, сертификаты': 'TIF TN kodlari, to‘lovlar, sertifikatlar', 'Ташкент и все регионы': 'Toshkent va barcha viloyatlar',
    'От склада поставщика до вашего склада': 'Yetkazib beruvchi omboridan sizning omboringizgacha',
    'Заберём груз у поставщика, довезём, растаможим и привезём к вам. Стоимость считаем под ваш груз.':
        'Yukni yetkazib beruvchidan olamiz, tashiymiz, bojxonadan o‘tkazamiz va sizga yetkazamiz. Narxni yukingizga qarab hisoblaymiz.',
    'Все услуги': 'Barcha xizmatlar',
    # hero
    'Доставка грузов': 'Xitoydan', 'из Китая': 'O‘zbekistonga', 'в Узбекистан': 'yuk tashish',
    'Свои склады в пяти городах Китая, таможня и доставка до вашего склада. Возим и из Турции, Европы, Ирана.':
        'Xitoyning beshta shahrida o‘z omborlarimiz, bojxona va omboringizgacha yetkazish. Turkiya, Yevropa va Erondan ham olib kelamiz.',
    'Наши склады в Китае': 'Xitoydagi omborlarimiz', '5 складов': 'Xitoyda', 'в Китае': '5 ta ombor',
    'Лет на рынке': 'Yil bozorda', 'Клиентов': 'Mijoz', 'м²': 'm²', 'Складов в Китае': 'Xitoydagi omborlar', 'Стран и городов': 'Davlat va shahar',
    # transport types
    'Виды перевозок': 'Tashuv turlari', 'Подберём транспорт под груз': 'Yukingizga mos transport tanlaymiz',
    'Еврофуры и тандемы грузоподъёмностью от 20 до 29 тонн, контейнеровозы, платформы, рефрижераторы.':
        '20 tonnadan 29 tonnagacha ko‘taradigan yevro furalar va tandemlar, konteynerovozlar, platformalar, refrijeratorlar.',
    'Рефрижераторные': 'Refrijerator', 'Контейнерные': 'Konteyner', 'Сборные грузы': 'Yig‘ma yuklar', 'Тентовые': 'Tentli',
    'Негабаритные': 'Negabarit', 'Железнодорожные': 'Temir yo‘l', 'Мультимодальные': 'Multimodal',
    # geography
    'Главное направление: Китай': 'Asosiy yo‘nalish: Xitoy',
    'Груз из любой провинции Китая собираем на складах в Иу, Гуанчжоу и Ляньюньгане, через Хоргос и Улугчат везём в Ташкент.':
        'Xitoyning istalgan provinsiyasidan yukni Yiwu, Guanchjou va Lianyungangdagi omborlarda yig‘amiz va Xorgos hamda Ulug‘chat orqali Toshkentga olib kelamiz.',
    'Китай': 'Xitoy', 'Авто, ж/д, авиа, 5 складов': 'Avto, temir yo‘l, avia, 5 ta ombor', 'Турция': 'Turkiya', 'Европа': 'Yevropa', 'Иран': 'Eron',
    'Юго-Восточная Азия': 'Janubi-Sharqiy Osiyo', 'Казахстан, Кыргызстан': 'Qozog‘iston, Qirg‘iziston', 'Ташкент': 'Toshkent', 'Иу': 'Yiwu',
    'Гуанчжоу': 'Guanchjou', 'Ляньюньган': 'Lianyungang', 'Хоргос': 'Xorgos', 'Улугчат': 'Ulug‘chat', 'Малайзия': 'Malayziya',
    # warehouses
    'Склады в Китае': 'Xitoydagi omborlar',
    'Если поставщик в радиусе 100 км от склада в Иу, Гуанчжоу или Ляньюньгане и груз больше 30 м³, отправляем его сразу к границе, в Хоргос или Улугчат.':
        'Yetkazib beruvchi Yiwu, Guanchjou yoki Lianyungangdagi omborimizdan 100 km radiusda bo‘lsa va yuk 30 m³ dan oshsa, uni to‘g‘ridan-to‘g‘ri chegaraga, Xorgos yoki Ulug‘chatga jo‘natamiz.',
    'Склад BSM Logistics в городе Иу': 'BSM Logistics ombori, Yiwu', 'Склад BSM Logistics в городе Гуанчжоу': 'BSM Logistics ombori, Guanchjou',
    'Склад BSM Logistics в городе Ляньюньган': 'BSM Logistics ombori, Lianyungang', 'Склад BSM Logistics в городе Хоргос': 'BSM Logistics ombori, Xorgos',
    'Склад BSM Logistics в городе Улугчат': 'BSM Logistics ombori, Ulug‘chat',
    'Склад консолидации': 'Konsolidatsiya ombori', 'У границы с Казахстаном': 'Qozog‘iston chegarasi yonida', 'У границы с Кыргызстаном': 'Qirg‘iziston chegarasi yonida',
    'Предыдущий склад': 'Oldingi ombor', 'Следующий склад': 'Keyingi ombor',
    # why
    'Начинали в 2016 году с железнодорожных перевозок из Китая. Сейчас возим авто, ж/д и авиа и сами оформляем таможню.':
        '2016-yilda Xitoy yo‘nalishida temir yo‘l tashuvlaridan boshlaganmiz. Bugun avto, temir yo‘l va avia orqali tashiymiz, bojxonani o‘zimiz rasmiylashtiramiz.',
    'Как мы работаем': 'Qanday ishlaymiz', 'Гарантия на груз': 'Yuk uchun kafolat',
    'Если груз пострадал по нашей вине, возместим ущерб': 'Tashishda biz tomondan zarar yetsa, qoplab beramiz',
    'Свои склады в Китае': 'Xitoyda o‘z omborlarimiz', 'Пять складов, от Гуанчжоу до границы': 'Beshta ombor: Guanchjoudan chegaragacha',
    'Логистика внутри Китая': 'Xitoy ichki logistikasi', 'Заберём груз у поставщика в любой провинции': 'Istalgan provinsiyadagi yetkazib beruvchidan yukni olamiz',
    'Статус в Telegram-боте': 'Telegram-botda kuzatish', 'Видно, на каком этапе груз, без звонков менеджеру': 'Yuk qaysi bosqichda ekanini menejerga qo‘ng‘iroq qilmasdan ko‘rasiz',
    # steps
    'Как едет ваш груз': 'Yukingiz qanday yetib keladi',
    'Восемь шагов от заявки до вашего склада. Оплата наличными, картой или переводом.':
        'So‘rovdan omboringizgacha sakkiz bosqich. To‘lov naqd, karta yoki bank o‘tkazmasi orqali.',
    'Заявка': 'So‘rov qoldirish', 'Расчёт стоимости': 'Narx hisoblash', 'Договор': 'Shartnoma tuzish', 'Приём груза на склад': 'Yukni omborga qabul qilish',
    'Погрузка': 'Yuklash', 'Отправка': 'Yuborish', 'Доставка до вас': 'Sizga yetkazib berish',
    # clients, FAQ (answers follow the client's own wording from the brief)
    'Нам доверяют': 'Bizga ishonishadi', 'Частые вопросы': 'Ko‘p beriladigan savollar', 'Не нашли ответ? Позвоните:': 'Javob topmadingizmi? Qo‘ng‘iroq qiling:',
    'Сколько стоит доставка?': 'Yetkazib berish narxi qancha?',
    'Цену считаем под конкретный груз: вес и объём, откуда и куда везём, каким транспортом. Оставьте заявку, и менеджер пришлёт расчёт.':
        'Narx yukingiz parametrlari, qayerdan va qayerga olib kelinishi hamda transport turiga qarab hisoblanadi. Ariza qoldiring, menejer hisob-kitobni yuboradi.',
    'Из каких стран вы возите грузы?': 'Qaysi davlatlardan yuk olib kelasizlar?',
    'Из Китая, Турции, Европы, Ирана и стран Юго-Восточной Азии. Транзитом работаем через Казахстан и Кыргызстан.':
        'Xitoy, Turkiya, Yevropa, Eron va Janubi-Sharqiy Osiyo davlatlaridan. Qozog‘iston va Qirg‘iziston orqali tranzit ishlaymiz.',
    'Сколько дней едет груз из Китая?': 'Yuk Xitoydan necha kunda yetib keladi?',
    'Автотранспортом 15–25 дней, авиа 6–9 дней, по железной дороге 30–35 дней.': 'Avto orqali 15–25 kunda, avia orqali 6–9 kunda, temir yo‘l orqali 30–35 kunda.',
    'Есть ли гарантия на груз?': 'Yuk uchun kafolat bormi?',
    'Да. Если груз пострадал при перевозке по нашей вине, мы возмещаем ущерб. Форс-мажор не покрывается.':
        'Ha. Tashish jarayonida yukka biz tomondan zarar yetsa, qoplab beramiz. Fors-major holatlar bundan mustasno.',
    'Можно следить за грузом онлайн?': 'Yukni onlayn kuzatish mumkinmi?',
    'Да, для клиентов работает Telegram-бот. В нём видно, на каком этапе ваш груз, звонить менеджеру не нужно.':
        'Ha, mijozlarimiz uchun maxsus Telegram-bot bor. Unda yuk qaysi bosqichda ekanini uydan turib ko‘rishingiz mumkin.',
    'Поможете с таможенным оформлением?': 'Bojxona rasmiylashtiruvida yordam berasizlarmi?',
    'Да, у нас своя команда декларантов. Подберут коды ТН ВЭД, заранее посчитают таможенные платежи и оформят груз по закону.':
        'Ha, bizda tajribali deklarantlar jamoasi bor. TIF TN kodlarini tanlaydi, bojxona to‘lovlarini oldindan hisoblaydi va yukni qonun doirasida rasmiylashtiradi.',
    # CTA, form, footer, popup
    'Рассчитаем': 'Yetkazish narxini', 'доставку': 'hisoblaymiz',
    'Оставьте имя и телефон. Менеджер перезвонит и посчитает стоимость под ваш груз.':
        'Ism va telefon raqamingizni qoldiring. Menejer qo‘ng‘iroq qilib, yukingiz uchun narxni hisoblab beradi.',
    'Ваше имя': 'Ismingiz', 'Телефон': 'Telefon', 'Что и откуда везём': 'Nima va qayerdan olib kelinadi', 'Отправить заявку': 'Ariza yuborish',
    'Ваш надёжный партнёр в международной логистике.': 'Xalqaro logistikada ishonchli hamkoringiz.',
    'Ташкент, Яшнабадский район, 1-й проезд Садыка Азимова, 1А (ориентир: посольство Японии)':
        'Toshkent sh., Yashnobod tumani, Sodiq Azimov 1-tor ko‘chasi, 1A (mo‘ljal: Yaponiya elchixonasi)',
    'Пн–Пт 8:00–18:00, Сб 9:00–12:00': 'Du–Ju 8:00–18:00, Sh 9:00–12:00',
    'Менеджер перезвонит в рабочее время и предложит маршрут, сроки и стоимость.': 'Menejer ish vaqtida qo‘ng‘iroq qilib, yo‘nalish, muddat va narxni taklif qiladi.',
    'Услуга': 'Xizmat', 'Откуда': 'Qayerdan', 'Куда': 'Qayerga', 'Груз: что везём, вес, объём': 'Yuk: nima, og‘irligi, hajmi', 'Или сразу:': 'Yoki darhol:',
}
# pieces that carry markup or entities inside them
UZ_RAW = {
    'Пять складов, 9&nbsp;300&nbsp;м²': 'Beshta ombor, 9&nbsp;300&nbsp;m²',
    'Почему BSM&nbsp;Logistics': 'Nega aynan BSM&nbsp;Logistics',
    '<html lang="ru">': '<html lang="uz">',
    'aria-label="Язык: русский">RU ': 'aria-label="Til: o‘zbekcha">UZ ',
}
KEEP = {'Русский'}   # a language's own name stays in its own script


BASE = 'https://farik9797.github.io/bsm-group/'


def translate(html, strict):
    out = html
    for ru, uz in UZ_RAW.items():
        if ru in out:
            out = out.replace(ru, uz)
        else:
            assert not strict, f'raw not found: {ru}'
    for ru in sorted(UZ, key=len, reverse=True):
        pat = re.compile(r'(?<=>)(\s*)' + re.escape(ru) + r'(\s*)(?=<)|(?<=")' + re.escape(ru) + r'(?=")')
        out, n = pat.subn(lambda m: (m.group(1) or '') + UZ[ru] + (m.group(2) or '') if m.group(1) is not None else UZ[ru], out)
        assert n or not strict, f'not found: {ru}'
    check = re.sub(r'<!--.*?-->', '', out, flags=re.S)
    for k in KEEP:
        check = check.replace(k, '')
    left = sorted(set(re.findall(r'[^<>"]*[А-Яа-яЁё][^<>"]*', check)))
    assert not left, 'Cyrillic left in UZ: ' + ' | '.join(s.strip() for s in left[:12])
    return out


def localize(html, lang, path):
    """path: the page inside its language root, '' for home, 'services/auto/' and so on."""
    depth = path.count('/')
    L = '../' * depth                                    # to this language's home
    R = '../' * (depth + (1 if lang == 'ru' else 0))     # to the site root, where assets live
    for attr in ('src', 'href', 'poster'):
        html = re.sub(rf'{attr}="(assets/|style\.css|main\.js)', rf'{attr}="{R}\1', html)
    html = html.replace('{UZ}', (R + path) or './').replace('{RU}', R + 'ru/' + path)
    html = re.sub(r'(data-lang="' + lang + '")', r'\1 aria-current="true"', html)
    html = html.replace('{L}', L)
    html = re.sub(r'<link rel="alternate" hreflang="uz" href="[^"]*">', f'<link rel="alternate" hreflang="uz" href="{BASE}{path}">', html)
    html = re.sub(r'<link rel="alternate" hreflang="ru" href="[^"]*">', f'<link rel="alternate" hreflang="ru" href="{BASE}ru/{path}"><link rel="canonical" href="{BASE}{"ru/" if lang == "ru" else ""}{path}">', html)
    return html


def write(lang, path, html):
    out = root / ('ru/' if lang == 'ru' else '') / path / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)


import sys
sys.path.insert(0, str(root / 'tools'))
import pages

pre, rest = SRC.split('<!--MAIN-->', 1)
_, post = rest.split('<!--/MAIN-->', 1)
clients = re.search(r'  <!-- Clients -->.*?</section>\n', SRC, re.S).group(0)
inner_pre = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', '', pre, flags=re.S)
inner_pre = re.sub(r'\s*<link rel="preload" as="image"[^>]*>', '', inner_pre)

count = 0
for lang in ('uz', 'ru'):
    home = translate(SRC, True) if lang == 'uz' else SRC
    write(lang, '', localize(home, lang, ''))
    count += 1
    for path, (title, desc), body in pages.all_pages(lang, clients):
        head = re.sub(r'<title>.*?</title>', lambda m: f'<title>{title}</title>', inner_pre, flags=re.S)
        head = re.sub(r'<meta name="description" content="[^"]*">', lambda m: f'<meta name="description" content="{desc}">', head)
        top = '/'.join(path.split('/')[:1]) + '/'
        head = head.replace(f'href="{{L}}{top}">', f'href="{{L}}{top}" aria-current="page">')
        html = head + '<!--MAIN-->\n' + body + '<!--/MAIN-->' + post
        if lang == 'uz':
            html = translate(html, False)
        write(lang, path, localize(html, lang, path))
        count += 1
print('built', count, 'pages')
