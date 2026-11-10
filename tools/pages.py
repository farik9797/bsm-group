"""Inner pages: content in both languages and the markup that carries it.

Every fact here comes from the client's brief (Anketa_sayt_logistika_UZ, 10.11.2026). The Uzbek text
mostly keeps the client's own wording; the Russian is our translation of it. Nothing else is added:
no prices, no cases, no reviews.
"""

A = '<svg class="icon" aria-hidden="true"><use href="#i-arrow-r"/></svg>'

UI = {
    'ru': {'home': 'Главная', 'services': 'Услуги', 'term': 'Сроки', 'routes': 'Направления', 'price': 'Стоимость',
           'how': 'Как это работает', 'cargo': 'Какие грузы возим', 'other': 'Другие услуги', 'calc': 'Рассчитать перевозку',
           'all': 'Все услуги', 'price_note': 'Считаем под ваш груз: вес, объём, маршрут и вид транспорта.', 'crumbs': 'Навигация по разделам',
           'call': 'Позвонить'},
    'uz': {'home': 'Bosh sahifa', 'services': 'Xizmatlar', 'term': 'Muddat', 'routes': 'Yo‘nalishlar', 'price': 'Narx',
           'how': 'Qanday ishlaydi', 'cargo': 'Qanday yuklar tashiymiz', 'other': 'Boshqa xizmatlar', 'calc': 'Narxni hisoblash',
           'all': 'Barcha xizmatlar', 'price_note': 'Yuk ma’lumotlari asosida har bir mijozga individual hisoblab beriladi.', 'crumbs': 'Bo‘limlar bo‘yicha navigatsiya',
           'call': 'Qo‘ng‘iroq qilish'},
}

# (slug, image, form value ru, form value uz, {lang: dict})
SERVICES = [
    ('auto', 'auto', 'Автоперевозки', 'Avtotashuvlar', {
        'ru': dict(title='Автоперевозки', h1='Автоперевозки из Китая, Турции и Европы', meta='Из Китая за 15–25 дней',
                   lead='Полные фуры (FTL) и сборные грузы (LTL). Возим тентованными и изотермическими фурами: под большую партию даём отдельную машину, небольшие партии собираем в сборный груз.',
                   how='Забираем груз на заводе поставщика или собираем его на ближайшем складе консолидации. Оттуда груз быстро уходит на наши склады у границы с Казахстаном и Кыргызстаном. Там его перегружают в другие фуры, и они идут в Узбекистан. После таможенного оформления привозим груз клиенту.',
                   routes='Китай, Турция, Европа и Юго-Восточная Азия → Узбекистан', term='Из Китая: 15–25 дней',
                   cargo='Минимальный заказ от 1 м³. Незаконные и контрафактные товары не возим.'),
        'uz': dict(title='Avtotashuvlar', h1='Xitoy, Turkiya va Yevropadan avtotashuvlar', meta='Xitoydan 15–25 kunda',
                   lead='To‘liq furalar (FTL) va yig‘ma yuklar (LTL). Tentli va izotermik furalarda tashiymiz: katta partiyalar uchun alohida avtotransport, kichik partiyalar uchun yig‘ma (konsolidatsiya) tizimi yo‘lga qo‘yilgan.',
                   how='Yuk xorijdagi zavoddan qabul qilinadi yoki eng yaqin konsolidatsiya omboriga jamlanadi. So‘ng tezlik bilan Qozog‘iston va Qirg‘iziston chegarasi yaqinidagi BSM yuk qabul qilish omborlariga yuboriladi. Bu yerda yuklar boshqa furalarga qayta yuklanadi va O‘zbekistonga yo‘lga chiqadi. Yetib kelgan yuklar bojxona rasmiylashtiruvidan so‘ng mijozlarga yetkazib beriladi.',
                   routes='Xitoy, Turkiya, Yevropa va Janubi-Sharqiy Osiyo → O‘zbekiston', term='Xitoydan: 15–25 kun',
                   cargo='Minimal buyurtma hajmi 1 kub metrdan boshlanadi. Noqonuniy va kontrafakt tovarlar olib kelinmaydi.')}),
    ('rail', 'rail', 'Ж/д перевозки', 'Temir yo‘l tashuvlari', {
        'ru': dict(title='Ж/д перевозки', h1='Железнодорожные перевозки из Китая', meta='Из Китая за 30–35 дней',
                   lead='Крупные партии промышленного сырья, тяжёлую технику и товары возим блок-поездами и универсальными вагонами. На дальних расстояниях это дешевле и надёжнее.',
                   how='Берём на себя всё, что происходит на станциях в Китае и других странах: подачу контейнера или вагона, погрузку и выгрузку, оформление международной железнодорожной накладной СМГС, станционные сборы и контроль.',
                   routes='Китай → Казахстан → Узбекистан', term='Из Китая: 30–35 дней',
                   cargo='Крупные партии металлоизделий, химическое сырьё, сельхозтехника, крупное оборудование. Стандартные 20- и 40-футовые универсальные и высокие (HC) контейнеры, крытые вагоны и открытые платформы.'),
        'uz': dict(title='Temir yo‘l tashuvlari', h1='Xitoydan temir yo‘l orqali yuk tashish', meta='Xitoydan 30–35 kunda',
                   lead='Yirik hajmdagi sanoat xomashyolari, og‘ir texnika va tovarlarni blok-poyezdlar hamda universal vagonlarda uzoq masofalarga arzon va ishonchli yetkazamiz.',
                   how='Xitoy va boshqa davlat temir yo‘l stansiyalarida konteyner yoki vagon ta’minoti, ortish-tushirish, SMGS (xalqaro temir yo‘l xati) rasmiylashtiruvi, stansiya to‘lovlari va nazoratini to‘liq o‘z zimmamizga olamiz.',
                   routes='Xitoy → Qozog‘iston → O‘zbekiston', term='Xitoydan: 30–35 kun',
                   cargo='Yirik partiyali metall buyumlar, kimyoviy xomashyolar, qishloq xo‘jaligi texnikalari, yirik uskunalar. Standart 20 va 40 futlik universal va baland (HC) konteynerlar, yopiq vagonlar va ochiq platformalar.')}),
    ('air', 'air', 'Авиаперевозки', 'Aviatashuvlar', {
        'ru': dict(title='Авиаперевозки', h1='Авиаперевозки из Китая в Ташкент', meta='Из Китая за 6–9 дней',
                   lead='Срочные и дорогие запчасти, электронику и образцы доставляем из крупных аэропортов Китая в Ташкент за несколько дней.',
                   how='Забираем груз с завода или склада поставщика и везём в аэропорт. Оформляем авианакладную (AWB), проводим досмотр авиабезопасности. Отправляем чартером или регулярным рейсом в грузовой терминал аэропорта Ташкента (TAS) и сопровождаем транзитный таможенный контроль.',
                   routes='Китай → Ташкент', term='Из Китая: 6–9 дней',
                   cargo='Всё, что разрешено перевозить по воздуху. Минимальный вес отправки 45 кг.'),
        'uz': dict(title='Aviatashuvlar', h1='Xitoydan Toshkentga aviatashuvlar', meta='Xitoydan 6–9 kunda',
                   lead='Shoshilinch, yuqori qiymatga ega ehtiyot qismlar, elektronika va namunaviy tovarlarni Xitoyning yirik aeroportlaridan Toshkentga qisqa muddatda yetkazamiz.',
                   how='Xorijdagi zavod yoki ombordan yukni aeroportga keltiramiz, Air Waybill (AWB) rasmiylashtiruvi va avia-xavfsizlik ko‘rigidan o‘tkazamiz. Charter yoki muntazam reyslar orqali Toshkent xalqaro aeroporti (TAS) yuk terminaliga tushiramiz va tranzit bojxona nazoratini ta’minlaymiz.',
                   routes='Xitoy → Toshkent', term='Xitoydan: 6–9 kun',
                   cargo='Aviada tashish mumkin bo‘lgan barcha yuklar. Minimal og‘irlik 45 kg dan boshlanadi.')}),
    ('china', 'china-map', 'Логистика по Китаю', 'Xitoy ichki logistikasi', {
        'ru': dict(title='Логистика по Китаю', h1='Логистика внутри Китая и pick-up', meta='Заберём груз у поставщика',
                   lead='Забираем груз у производителя в любой точке Китая и везём на склады BSM или сразу отправляем в Узбекистан.',
                   how='Если поставщик находится в радиусе 100 км от наших складов в Иу, Гуанчжоу или Ляньюньгане и груз больше 30 м³, отправляем его сразу на склады в Хоргосе и Улугчате. Из более далёких провинций груз сначала едет внутренней логистикой на центральные склады консолидации.',
                   routes='Любая провинция Китая → Узбекистан', term='По Китаю: зависит от расстояния',
                   cargo='Любые законные производственные и коммерческие товары. Если у товара есть экспортные ограничения или он входит в перечень постановления № 77, проверяем экспортное разрешение производителя.',
                   price='Если груз подходит под условия акции pick-up, заберём бесплатно. Внутреннюю доставку считаем по расстоянию.'),
        'uz': dict(title='Xitoy ichki logistikasi', h1='Xitoy ichki logistikasi va Pick-up xizmati', meta='Yukni yetkazib beruvchidan olamiz',
                   lead='Xitoyning istalgan burchagidagi ishlab chiqaruvchidan yukni qabul qilib olib, BSM omborlariga keltiramiz yoki to‘g‘ridan-to‘g‘ri O‘zbekistonga jo‘natamiz.',
                   how='Xitoydagi BSM omborlari (Yiwu, Guanchjou, Lianyungang) atrofidagi 100 km radiusda joylashgan va hajmi 30 m³ dan oshgan yuklar to‘g‘ridan-to‘g‘ri Xorgos va Ulug‘chatdagi omborlarimizga ortib ketiladi. Radiusdan uzoqroq provinsiyalardan esa ichki logistika orqali markaziy konsolidatsiya omborlarimizga yetkaziladi.',
                   routes='Xitoyning istalgan provinsiyasi → O‘zbekiston', term='Xitoy bo‘ylab masofaga qarab',
                   cargo='Barcha qonuniy ishlab chiqarish va tijorat tovarlari. Eksport cheklovi bor yoki 77-sonli qaror ro‘yxatiga tushgan tovarlar uchun ishlab chiqaruvchi eksport ruxsatnomasi mavjudligi tekshiriladi.',
                   price='Pick-up aksiyasi shartlariga tushsa bepul olib ketiladi; ichki yetkazish masofaga ko‘ra hisoblab beriladi.')}),
    ('multimodal', 'multimodal', 'Мультимодальные перевозки', 'Multimodal tashuvlar', {
        'ru': dict(title='Мультимодальные перевозки', h1='Мультимодальные перевозки', meta='Море, ж/д и авто по одному договору',
                   lead='Соединяем морской, железнодорожный и автомобильный транспорт в одну цепочку. Так заметно дешевле, чем везти одним видом транспорта.',
                   how='Один договор и одна ответственность. Груз переходит с одного вида транспорта на другой, например с морского судна на железную дорогу или на международную фуру. Сюда входят кросс-докинг в портах, хранение на транзитных складах и все транзитные таможенные документы.',
                   routes='Китай, Европа, Турция, Иран, Юго-Восточная Азия → Узбекистан', term='Считаем от страны отправки',
                   cargo='Любые грузы, которые отвечают требованиям международной логистики.'),
        'uz': dict(title='Multimodal tashuvlar', h1='Multimodal yuk tashuvlari', meta='Dengiz, temir yo‘l va avto bitta shartnomada',
                   lead='Dengiz, temir yo‘l va avtomobil transportini yagona zanjirga birlashtiramiz. Bu logistika xarajatlarini sezilarli tejaydi.',
                   how='Bitta shartnoma va yagona mas’uliyat: yuk bir transport turidan ikkinchisiga, masalan dengiz kemasidan temir yo‘lga yoki xalqaro furaga o‘tkaziladi. Portlarda cross-docking, oraliq tranzit omborlarida saqlash va tranzit bojxona hujjatlarini to‘liq boshqarish kiradi.',
                   routes='Xitoy, Yevropa, Turkiya, Eron, Janubi-Sharqiy Osiyo → O‘zbekiston', term='Yuk olinadigan davlatdan kelib chiqib hisoblanadi',
                   cargo='Xalqaro logistika talablariga mos keladigan barcha yuklar.')}),
    ('container', 'container', 'Контейнерные перевозки', 'Konteyner tashuvlari', {
        'ru': dict(title='Контейнерные перевозки', h1='Контейнерные перевозки FCL и LCL', meta='FCL и LCL, 20, 40 и 45 футов',
                   lead='Везём товары в стандартных 20-, 40- и 45-футовых морских, сухопутных и железнодорожных контейнерах под международными пломбами.',
                   how='Контейнер целиком под одного заказчика (FCL) или консолидация с другими грузами (LCL). Подаём пустой контейнер на завод, пломбируем, грузим на платформу, выгружаем и возвращаем пустой контейнер в депо.',
                   routes='Китай, Турция, европейские коридоры, Юго-Восточная Азия → Узбекистан', term='Из Китая по ж/д: 30–35 дней',
                   cargo='Грузы, которые отвечают международным нормам перевозки.'),
        'uz': dict(title='Konteyner tashuvlari', h1='Xalqaro konteyner tashuvlari (FCL va LCL)', meta='FCL va LCL, 20, 40 va 45 futlik',
                   lead='Tovarlarni standart 20, 40 va 45 futlik dengiz, quruqlik va temir yo‘l konteynerlarida xalqaro xavfsizlik muhrlari bilan kafolatli tashiymiz.',
                   how='Butun konteynerni bitta buyurtmachiga ajratish (FCL) yoki konteyner ichida boshqa yuklar bilan konsolidatsiya qilish (LCL). Bo‘sh konteynerni zavodga olib borish, plombalash, platformaga ortish, tushirish va bo‘sh konteynerni belgilangan depoga qaytarish.',
                   routes='Xitoy, Turkiya, Yevropa koridorlari va Janubi-Sharqiy Osiyo → O‘zbekiston', term='Xitoydan temir yo‘l orqali: 30–35 kun',
                   cargo='Xalqaro yuk tashish me’yorlariga mos yuklar.')}),
    ('special', 'special', 'Спецгрузы', 'Maxsus yuklar', {
        'ru': dict(title='Негабарит, ADR, рефрижератор', h1='Негабаритные, опасные и температурные грузы', meta='Спецтехника и разрешения',
                   lead='Станки, которые не помещаются в обычную фуру, химию класса ADR и товары с точным температурным режимом возим на специальной технике.',
                   how='Для негабарита даём тралы и тяжёлые платформы, готовим проект маршрута, специальные разрешения и сопровождение на дороге. Для грузов ADR проверяем паспорт безопасности MSDS от производителя и выделяем водителей и машины с допуском ДОПОГ. Для товаров с температурным режимом ставим рефрижераторы.',
                   routes='Китай, Турция, Европа → Узбекистан', term='Автотранспортом: 18–28 дней, зависит от сроков получения разрешений',
                   cargo='Грузы, которые отвечают международным нормам перевозки.'),
        'uz': dict(title='Maxsus yuklar', h1='Gabaritdan tashqari, xavfli va harorat rejimli yuklar', meta='Maxsus texnika va ruxsatnomalar',
                   lead='Standart furalarga sig‘maydigan yirik stanoklar, ADR toifasidagi kimyoviy moddalar va aniq harorat talab qiluvchi tovarlarni ixtisoslashgan texnikalarda tashiymiz.',
                   how='Negabarit yuklar uchun maxsus trall va og‘ir platformalar, marshrut loyihasi, maxsus ruxsatnomalar va avtoyo‘l eskorti ta’minlanadi. ADR yuklar uchun ishlab chiqaruvchining MSDS xavfsizlik pasporti tekshirilib, ADR ruxsatnomali haydovchi va mashinalar ajratiladi. Harorat rejimli tovarlar uchun refrijeratorlar qo‘yiladi.',
                   routes='Xitoy, Turkiya va Yevropa → O‘zbekiston', term='Avtotransportda: 18–28 kun (ruxsatnomalar olish vaqtiga bog‘liq)',
                   cargo='Xalqaro yuk tashish me’yorlariga mos yuklar.')}),
    ('customs', 'customs', 'Таможенное оформление', 'Bojxona rasmiylashtiruvi', {
        'ru': dict(title='Таможенное оформление', h1='Таможенное оформление в Узбекистане', meta='Коды ТН ВЭД, платежи, сертификаты',
                   lead='Полностью оформляем импорт в Узбекистан: правильно подбираем коды ТН ВЭД и законно оптимизируем таможенные платежи.',
                   how='По договору и инвойсам подбираем коды ТН ВЭД, заранее точно считаем таможенные платежи, получаем сертификаты соответствия и гигиенические сертификаты, заполняем декларацию и выпускаем груз в свободное обращение.',
                   routes='Все таможенные посты Узбекистана', term='Зависит от категории и вида товара',
                   cargo='Запрещённые, контрабандные и контрафактные товары не оформляем.'),
        'uz': dict(title='Bojxona rasmiylashtiruvi', h1='O‘zbekistonda bojxona rasmiylashtiruvi', meta='TIF TN kodlari, to‘lovlar, sertifikatlar',
                   lead='O‘zbekistonga kirib kelayotgan import yuklarini to‘liq rasmiylashtiramiz: TIF TN kodlarini to‘g‘ri belgilaymiz va to‘lovlarni qonuniy optimallashtiramiz.',
                   how='Tovar shartnomasi va invoyslar asosida TIF TN (TN VED) kodlarini tanlaymiz, bojxona to‘lovlarini oldindan aniq hisoblab beramiz, muvofiqlik va gigiyenik sertifikatlar olamiz, yuk bojxona deklaratsiyasini to‘ldiramiz va erkin muomalaga chiqaramiz.',
                   routes='O‘zbekiston bo‘ylab barcha bojxona postlarida', term='Tovar toifasi va turiga qarab hisoblanadi',
                   cargo='Taqiqlangan, kontrabanda va kontrafakt tovarlar qabul qilinmaydi.')}),
    ('local', 'local', 'Доставка по Узбекистану', 'O‘zbekiston bo‘ylab yetkazish', {
        'ru': dict(title='Доставка по Узбекистану', h1='Доставка по Ташкенту и Узбекистану', meta='Ташкент и все регионы',
                   lead='Довозим груз после таможни до склада клиента в Ташкенте и регионах Узбекистана.',
                   how='Когда груз выпущен в свободное обращение, по вашей заявке доставляем его на ваш адрес.',
                   routes='Ташкент, Ташкентская область и все регионы Узбекистана', term='Зависит от адреса',
                   cargo='От небольших паллет до тяжёлых партий. Для тяжёлых грузов заранее согласуем кран и технику для выгрузки.'),
        'uz': dict(title='O‘zbekiston bo‘ylab yetkazish', h1='Toshkent va O‘zbekiston bo‘ylab yetkazib berish', meta='Toshkent va barcha viloyatlar',
                   lead='Bojxonadan chiqqan yuklarni Toshkent shahri va O‘zbekiston viloyatlaridagi mijoz omboriga yetkazamiz.',
                   how='Yuk bojxonadan erkin muomalaga chiqarilgandan so‘ng mijozning so‘roviga binoan uning manziliga yetkazib beriladi.',
                   routes='Toshkent shahri, Toshkent viloyati va butun O‘zbekiston hududlari', term='Mijoz manziliga qarab',
                   cargo='Kichik palletlardan tortib og‘ir partiyalargacha. Og‘ir yuklar uchun kran va yuk tushirish texnikalari kelishiladi.')}),
]

PAGES = {  # slug: {lang: (title, description, h1, lead)}
    'services': {'ru': ('Услуги BSM Logistics: перевозки из Китая, таможня, доставка по Узбекистану',
                        'Авто, ж/д, авиа, мультимодальные и контейнерные перевозки, спецгрузы, логистика по Китаю, таможенное оформление и доставка по Узбекистану.',
                        'Услуги', 'Девять услуг от склада поставщика до вашего склада. Стоимость считаем под конкретный груз.'),
                 'uz': ('BSM Logistics xizmatlari: Xitoydan yuk tashish, bojxona, O‘zbekiston bo‘ylab yetkazish',
                        'Avto, temir yo‘l, avia, multimodal va konteyner tashuvlari, maxsus yuklar, Xitoy ichki logistikasi, bojxona rasmiylashtiruvi va O‘zbekiston bo‘ylab yetkazish.',
                        'Xizmatlar', 'Yetkazib beruvchi omboridan sizning omboringizgacha to‘qqizta xizmat. Narxni yukingizga qarab hisoblaymiz.')},
    'about': {'ru': ('О компании BSM Logistics: международная логистика с 2016 года',
                     'BSM Logistics: мультимодальные перевозки из Китая, Турции, Ирана, Европы и Юго-Восточной Азии в Узбекистан. 5 складов в Китае, 70+ сотрудников.',
                     'О компании', 'BSM Logistics — международный логистический оператор. Везём грузы из Китая, Турции, Ирана, Европы и Юго-Восточной Азии до вашего адреса в Узбекистане.'),
              'uz': ('BSM Logistics haqida: 2016-yildan beri xalqaro logistika',
                     'BSM Logistics: Xitoy, Turkiya, Eron, Yevropa va Janubi-Sharqiy Osiyodan O‘zbekistonga multimodal yuk tashuvlari. Xitoyda 5 ta ombor, 70+ xodim.',
                     'Kompaniya haqida', 'BSM Logistics — Xitoy, Turkiya, Eron, Yevropa va Janubi-Sharqiy Osiyo yo‘nalishlarida multimodal yuk tashuvlariga ixtisoslashgan xalqaro logistika operatori.')},
    'warehouses': {'ru': ('Склады BSM Logistics в Китае: Иу, Гуанчжоу, Ляньюньган, Хоргос, Улугчат',
                          'Пять складов консолидации в Китае общей площадью 9 300 м². Собираем груз от нескольких поставщиков и отправляем в Узбекистан.',
                          'Склады в Китае', 'Пять складов общей площадью 9 300 м². Три собирают грузы от поставщиков, два стоят у границы и отправляют машины в Узбекистан.'),
                   'uz': ('BSM Logistics omborlari Xitoyda: Yiwu, Guanchjou, Lianyungang, Xorgos, Ulug‘chat',
                          'Xitoyda umumiy maydoni 9 300 m² bo‘lgan beshta konsolidatsiya ombori. Bir nechta yetkazib beruvchidan yukni yig‘ib, O‘zbekistonga jo‘natamiz.',
                          'Xitoydagi omborlar', 'Umumiy maydoni 9 300 m² bo‘lgan beshta ombor. Uchtasida yetkazib beruvchilardan yuk yig‘iladi, ikkitasi chegara yonida turadi va mashinalarni O‘zbekistonga jo‘natadi.')},
    'contacts': {'ru': ('Контакты BSM Logistics: телефон, адрес в Ташкенте, часы работы',
                        'Телефон +998 55 520 02 02, WhatsApp +998 77 506 33 33, bsmlogistics.uz@gmail.com. Ташкент, Яшнабадский район. Пн–Пт 8:00–18:00, Сб 9:00–12:00.',
                        'Контакты', 'Позвоните, напишите или оставьте заявку. Менеджер посчитает доставку под ваш груз.'),
                 'uz': ('BSM Logistics kontaktlari: telefon, Toshkentdagi manzil, ish tartibi',
                        'Telefon +998 55 520 02 02, WhatsApp +998 77 506 33 33, bsmlogistics.uz@gmail.com. Toshkent, Yashnobod tumani. Du–Ju 8:00–18:00, Sh 9:00–12:00.',
                        'Kontaktlar', 'Qo‘ng‘iroq qiling, yozing yoki ariza qoldiring. Menejer yukingiz uchun yetkazish narxini hisoblab beradi.')},
}

ABOUT = {
    'ru': dict(h_hist='С чего начинали', hist='BSM Logistics начинала в 2016 году с железнодорожных перевозок из Китая. За это время компания построила свою сеть складов консолидации в главных городах Китая: Иу, Гуанчжоу, Ляньюньгане, Хоргосе и Улугчате. Сейчас мы возим грузы из Европы, Турции и Азии автомобильным, железнодорожным и авиатранспортом и полностью оформляем таможню.',
               h_mission='Наша задача', mission='Давать бизнесу надёжную и выгодную логистику и этим вносить вклад в развитие экономики.',
               h_clients='Кого мы возим', clients='Производителей и промышленные предприятия, государственные организации, крупных и средних импортёров, строительные компании, оптовиков, дилеров иностранных брендов и дистрибьюторов.',
               h_feats='Почему с нами удобно', stats=[('10', '', 'Лет на рынке'), ('1000', '+', 'Клиентов'), ('70', '+', 'Сотрудников'), ('9300', ' м²', 'Складов в Китае')],
               feats=[('i-shield', 'Гарантия на груз', 'Если груз пострадал при перевозке по нашей вине, возместим ущерб. Форс-мажор не покрывается.'),
                      ('i-warehouse', '5 складов в Китае', 'Собираем грузы от разных поставщиков в один и отправляем к границе.'),
                      ('i-package', 'Логистика внутри Китая', 'Заберём груз у поставщика в любой провинции.'),
                      ('i-telegram', 'Отслеживание в Telegram-боте', 'Видно, на каком этапе груз, без звонков менеджеру.'),
                      ('i-eye', 'Прозрачность', 'Логистика, транзит и таможня под одним управлением.')],
               pay='Оплата наличными, картой или банковским переводом.'),
    'uz': dict(h_hist='Qanday boshlaganmiz', hist='BSM Logistics o‘z faoliyatini 2016-yilda Xitoy yo‘nalishida temir yo‘l tashuvlaridan boshlagan. O‘tgan davr mobaynida kompaniya Xitoyning Yiwu, Guanchjou, Lianyungang, Xorgos va Ulug‘chat kabi asosiy shaharlarida o‘z konsolidatsiya omborlari infratuzilmasini yo‘lga qo‘ydi. Bugungi kunda xizmatlar geografiyasi Yevropa, Turkiya va Osiyo yo‘nalishlarigacha kengayib, avto, temir yo‘l, aviatashuvlar va to‘liq bojxona rasmiylashtiruvini qamrab olgan.',
               h_mission='Missiyamiz', mission='Bizneslar uchun ishonchli va tejamkor logistika yechimlarini taqdim etish va shu orqali iqtisodiyot rivojiga hissa qo‘shish.',
               h_clients='Mijozlarimiz', clients='Ishlab chiqaruvchilar va sanoat korxonalari, davlat tashkilotlari, yirik va o‘rta importyorlar, qurilish kompaniyalari, ulgurji savdo korxonalari, xorijiy brend dilerlari hamda distribyutorlar.',
               h_feats='Nega biz bilan qulay', stats=[('10', '', 'Yil bozorda'), ('1000', '+', 'Mijoz'), ('70', '+', 'Xodim'), ('9300', ' m²', 'Xitoydagi omborlar')],
               feats=[('i-shield', 'Yuk uchun kafolat', 'Tashish jarayonida yukka biz tomondan zarar yetsa, qoplab beramiz. Fors-major holatlar bundan mustasno.'),
                      ('i-warehouse', 'Xitoyda 5 ta ombor', 'Turli yetkazib beruvchilardan yukni bir joyga yig‘ib, chegaraga jo‘natamiz.'),
                      ('i-package', 'Xitoy ichki logistikasi', 'Istalgan provinsiyadagi yetkazib beruvchidan yukni olamiz.'),
                      ('i-telegram', 'Telegram-botda kuzatish', 'Yuk qaysi bosqichda ekanini menejerga qo‘ng‘iroq qilmasdan ko‘rasiz.'),
                      ('i-eye', 'Shaffoflik', 'Logistika, tranzit va bojxona yagona boshqaruv nazorati ostida.')],
               pay='To‘lov naqd, karta yoki bank o‘tkazmasi orqali.'),
}

WAREHOUSES = {
    'ru': dict(items=[('wh-yiwu', 'Иу', 'Склад консолидации'), ('wh-guangzhou', 'Гуанчжоу', 'Склад консолидации'), ('wh-lianyungang', 'Ляньюньган', 'Склад консолидации'),
                      ('wh-khorgos', 'Хоргос', 'У границы с Казахстаном'), ('wh-ulugchat', 'Улугчат', 'У границы с Кыргызстаном')],
               alt='Склад BSM Logistics в городе {c}', h_how='Как груз проходит через склады',
               how='Груз от разных поставщиков собираем на складах в Иу, Гуанчжоу и Ляньюньгане. Если поставщик в радиусе 100 км от склада и груз больше 30 м³, отправляем его сразу к границе, в Хоргос или Улугчат. Из более далёких провинций груз сначала едет внутренней логистикой на склад консолидации.',
               h_map='Где стоят склады', map_alt='Карта Китая со складами BSM Logistics', link='Логистика по Китаю'),
    'uz': dict(items=[('wh-yiwu', 'Yiwu', 'Konsolidatsiya ombori'), ('wh-guangzhou', 'Guanchjou', 'Konsolidatsiya ombori'), ('wh-lianyungang', 'Lianyungang', 'Konsolidatsiya ombori'),
                      ('wh-khorgos', 'Xorgos', 'Qozog‘iston chegarasi yonida'), ('wh-ulugchat', 'Ulug‘chat', 'Qirg‘iziston chegarasi yonida')],
               alt='BSM Logistics ombori, {c}', h_how='Yuk omborlardan qanday o‘tadi',
               how='Turli yetkazib beruvchilarning yuklarini Yiwu, Guanchjou va Lianyungangdagi omborlarda yig‘amiz. Yetkazib beruvchi omborimizdan 100 km radiusda bo‘lsa va yuk 30 m³ dan oshsa, uni to‘g‘ridan-to‘g‘ri chegaraga, Xorgos yoki Ulug‘chatga jo‘natamiz. Uzoqroq provinsiyalardan yuk avval ichki logistika orqali konsolidatsiya omboriga keladi.',
               h_map='Omborlar qayerda', map_alt='BSM Logistics omborlari ko‘rsatilgan Xitoy xaritasi', link='Xitoy ichki logistikasi'),
}

CONTACTS = {
    'ru': dict(phone='Телефон', msg='WhatsApp и Telegram', mail='Почта', addr='Адрес', addr_text='Ташкент, Яшнабадский район, 1-й проезд Садыка Азимова, 1А',
               addr_note='Ориентир: посольство Японии', map='Открыть в Яндекс Картах', hours='Часы работы', hours_text='Пн–Пт 8:00–18:00<br>Сб 9:00–12:00', social='Соцсети'),
    'uz': dict(phone='Telefon', msg='WhatsApp va Telegram', mail='Pochta', addr='Manzil', addr_text='Toshkent sh., Yashnobod tumani, Sodiq Azimov 1-tor ko‘chasi, 1A',
               addr_note='Mo‘ljal: Yaponiya elchixonasi', map='Yandex Xaritada ochish', hours='Ish tartibi', hours_text='Du–Ju 8:00–18:00<br>Sh 9:00–12:00', social='Ijtimoiy tarmoqlar'),
}


def crumbs(lang, trail):
    ui = UI[lang]
    items = [f'<li><a href="{{L}}">{ui["home"]}</a></li>'] + [f'<li><a href="{href}">{t}</a></li>' if href else f'<li aria-current="page">{t}</li>' for t, href in trail]
    return f'<nav class="crumbs" aria-label="{ui["crumbs"]}"><ol>{"".join(items)}</ol></nav>'


def head(lang, h1, lead, trail, img=None, svc=None, extra=''):
    ui = UI[lang]
    photo = f'<figure class="page-head__photo"><img src="assets/img/bsm/{img}.webp" alt="" width="1280" height="720" fetchpriority="high"></figure>' if img else ''
    data = f' data-service="{svc}"' if svc else ''
    return f'''  <section class="page-head theme-dark{' page-head--photo' if img else ''}">
    <div class="container page-head__grid">
      <div class="page-head__copy">
        {crumbs(lang, trail)}
        <h1 data-rise>{h1}</h1>
        <p class="lead" data-rise>{lead}</p>
        <div class="page-head__actions" data-rise>
          <a class="btn btn--lime" href="#contact" data-modal{data}>{ui["calc"]} {A}</a>
          <a class="play" href="tel:+998555200202">+998 55 520 02 02</a>
        </div>{extra}
      </div>
      {photo}
    </div>
  </section>
'''


def card(lang, s):
    slug, img, vru, vuz, d = s
    c = d[lang]
    return (f'<li><a class="card" href="{{L}}services/{slug}/"><img src="assets/img/bsm/{img}.webp" alt="" loading="lazy" width="1280" height="720">'
            f'<span class="card__text"><span class="card__title">{c["title"]}</span><span class="card__meta">{c["meta"]}</span></span>'
            f'<span class="card__go" aria-hidden="true"><svg class="icon"><use href="#i-arrow-r"/></svg></span></a></li>')


def service_page(lang, s):
    ui = UI[lang]
    slug, img, vru, vuz, d = s
    c = d[lang]
    value = vru if lang == 'ru' else vuz
    i = next(k for k, x in enumerate(SERVICES) if x[0] == slug)
    others = [SERVICES[(i + k) % len(SERVICES)] for k in (1, 2, 3)]
    body = head(lang, c['h1'], c['lead'], [(ui['services'], '{L}services/'), (c['title'], None)], img, value)
    body += f'''  <section class="facts">
    <dl class="container facts__grid">
      <div class="fact"><dt>{ui["term"]}</dt><dd>{c["term"]}</dd></div>
      <div class="fact"><dt>{ui["routes"]}</dt><dd>{c["routes"]}</dd></div>
      <div class="fact"><dt>{ui["price"]}</dt><dd>{c.get("price", ui["price_note"])}</dd></div>
    </dl>
  </section>
  <section class="prose">
    <div class="container prose__grid">
      <div class="prose__block"><h2 data-reveal>{ui["how"]}</h2><p data-reveal>{c["how"]}</p></div>
      <div class="prose__block"><h2 data-reveal>{ui["cargo"]}</h2><p data-reveal>{c["cargo"]}</p></div>
    </div>
  </section>
  <section class="services services--more">
    <div class="container">
      <div class="section-head"><h2 data-reveal>{ui["other"]}</h2><a class="btn btn--outline btn--sm" href="{{L}}services/">{ui["all"]} {A}</a></div>
      <ul class="cards" data-cards>{"".join(card(lang, o) for o in others)}</ul>
    </div>
  </section>
'''
    meta = (f'{c["h1"]}: BSM Logistics', f'{c["lead"]} {c["term"]}.')
    return f'services/{slug}/', meta, body


def services_page(lang):
    title, desc, h1, lead = PAGES['services'][lang]
    body = head(lang, h1, lead, [(h1, None)])
    body += f'''  <section class="services services--all">
    <div class="container">
      <ul class="cards" data-cards>{"".join(card(lang, s) for s in SERVICES)}</ul>
    </div>
  </section>
'''
    return 'services/', (title, desc), body


def about_page(lang, clients_html):
    title, desc, h1, lead = PAGES['about'][lang]
    a = ABOUT[lang]
    stats = ''.join(f'<div class="stat"><div><dd><span data-count="{n}">{int(n):,}</span>{suf}</dd><dt>{t}</dt></div></div>'.replace(',', ' ') for n, suf, t in a['stats'])
    body = head(lang, h1, lead, [(h1, None)], 'about', extra=f'\n        <dl class="stats stats--page" data-rise>{stats}</dl>')
    feats = ''.join(f'<li class="feat"><svg class="icon feat__icon" aria-hidden="true"><use href="#{ic}"/></svg><h3>{t}</h3><p>{p}</p></li>' for ic, t, p in a['feats'])
    body += f'''  <section class="prose">
    <div class="container prose__grid">
      <div class="prose__block"><h2 data-reveal>{a["h_hist"]}</h2><p data-reveal>{a["hist"]}</p></div>
      <div class="prose__block"><h2 data-reveal>{a["h_mission"]}</h2><p data-reveal>{a["mission"]}</p><h2 data-reveal>{a["h_clients"]}</h2><p data-reveal>{a["clients"]}</p></div>
    </div>
  </section>
  <section class="why why--page">
    <div class="container">
      <h2 data-reveal>{a["h_feats"]}</h2>
      <ul class="feats feats--5" data-feats>{feats}</ul>
      <p class="why__pay">{a["pay"]}</p>
    </div>
  </section>
{clients_html}'''
    return 'about/', (title, desc), body


def warehouses_page(lang):
    title, desc, h1, lead = PAGES['warehouses'][lang]
    w = WAREHOUSES[lang]
    items = ''.join(f'<li><figure class="proj"><img src="assets/img/bsm/{i}.webp" alt="{w["alt"].format(c=c)}" loading="lazy" width="1280" height="533"><figcaption><strong>{c}</strong><span>{r}</span></figcaption></figure></li>' for i, c, r in w['items'])
    body = head(lang, h1, lead, [(h1, None)], 'wh-guangzhou')
    body += f'''  <section class="wh">
    <div class="container">
      <ul class="wh__grid">{items}</ul>
    </div>
  </section>
  <section class="prose">
    <div class="container prose__grid">
      <div class="prose__block"><h2 data-reveal>{w["h_how"]}</h2><p data-reveal>{w["how"]}</p><a class="btn btn--outline btn--sm" href="{{L}}services/china/">{w["link"]} {A}</a></div>
      <figure class="prose__figure"><img src="assets/img/bsm/china-map.webp" alt="{w["map_alt"]}" loading="lazy" width="1280" height="773"><figcaption>{w["h_map"]}</figcaption></figure>
    </div>
  </section>
'''
    return 'warehouses/', (title, desc), body


def contacts_page(lang):
    title, desc, h1, lead = PAGES['contacts'][lang]
    c = CONTACTS[lang]
    body = head(lang, h1, lead, [(h1, None)])
    body += f'''  <section class="contacts">
    <div class="container contacts__grid">
      <div class="contact"><svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg><h2>{c["phone"]}</h2><a href="tel:+998555200202">+998 55 520 02 02</a></div>
      <div class="contact"><svg class="icon" aria-hidden="true"><use href="#i-whatsapp"/></svg><h2>{c["msg"]}</h2><a href="https://wa.me/998775063333">+998 77 506 33 33</a><a href="https://t.me/bsmtrade">t.me/bsmtrade</a></div>
      <div class="contact"><svg class="icon" aria-hidden="true"><use href="#i-mail"/></svg><h2>{c["mail"]}</h2><a href="mailto:bsmlogistics.uz@gmail.com">bsmlogistics.uz@gmail.com</a></div>
      <div class="contact contact--wide"><svg class="icon" aria-hidden="true"><use href="#i-map-pin"/></svg><h2>{c["addr"]}</h2><p>{c["addr_text"]}</p><p class="contact__note">{c["addr_note"]}</p><a href="https://yandex.com/maps/org/bsm_logistics_consulting/245433729477">{c["map"]} {A}</a></div>
      <div class="contact"><svg class="icon" aria-hidden="true"><use href="#i-clock"/></svg><h2>{c["hours"]}</h2><p>{c["hours_text"]}</p></div>
      <div class="contact"><svg class="icon" aria-hidden="true"><use href="#i-globe"/></svg><h2>{c["social"]}</h2><a href="https://www.instagram.com/bsmlogistics_uz">Instagram</a><a href="https://t.me/bsmtrade">Telegram</a><a href="https://www.youtube.com/@bsmconsulting_logistic">YouTube</a><a href="https://www.facebook.com/bsmlog.uz/">Facebook</a></div>
    </div>
  </section>
'''
    return 'contacts/', (title, desc), body


def all_pages(lang, clients_html):
    yield services_page(lang)
    for s in SERVICES:
        yield service_page(lang, s)
    yield about_page(lang, clients_html)
    yield warehouses_page(lang)
    yield contacts_page(lang)
