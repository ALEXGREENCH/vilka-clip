/* ВИЛКА — explicit narrative edit, 0:00–4:15.
 * Style IDs refer to the catalog in procedural-director.js. They are authored
 * shot by shot; there is no modulus, repeated cycle, or fixed-period scheduler.
 * Exact lyric boundaries come from timeline.json. Longer plans hold complete
 * thoughts; only the breakdown deliberately cuts inside sung sentences.
 *
 * Browser: window.VilkaStory. CommonJS: require('./procedural-story').
 * cueAt(t) => shot + {index, local, duration, progress, prev, next}.
 * prev/next reference immutable entries of plan (= shots), or null at the ends.
 * intensity is an editorial envelope, 0…1; it is not a replacement for RMS.
 * transition describes the ENTRY to a shot. The first shot has 'none'.
 */
(function(root,factory){
 'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.VilkaStory=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const duration=255;
 const motifs=Object.freeze(['plate','interview','library','rejection','copies','hunger','bread','shop','resume','breakdown','distribution','outro']);
 const transitionSeconds=Object.freeze({none:0,cut:0,dissolve:.38,pixel:.22,diagonal:.18,shards:.14,fade:.70});
 const authored=[
  {start:0,end:6.2,styleId:1,motif:'plate',intensity:.12,transition:'none',chapter:'ПУСТАЯ ТАРЕЛКА',reason:'Начать с настоящего предмета: хром, пустая тарелка и вилка задают голод до первого слова. Удержать предмет достаточно долго, чтобы он стал мотивом, а не заставкой.'},
  {start:6.2,end:12.22,styleId:0,motif:'plate',intensity:.18,transition:'dissolve',chapter:'ПУСТАЯ ТАРЕЛКА',reason:'Из отражения тарелки перейти в тёмную комнату человека за столом. Дождь и ожидание вводят героя; первый куплет начинается после спокойного установочного плана.'},

  {start:12.22,end:16.24,styleId:22,motif:'interview',intensity:.28,transition:'cut',chapter:'СОБЕСЕДОВАНИЕ',reason:'«Мне сорок семь. Я убрал это поле»: бумажное лицо и возрастной талон превращают анкету в физический коллаж. Резать кадр только после всей фразы об удалённом возрасте.'},
  {start:16.24,end:19.52,styleId:28,motif:'interview',intensity:.32,transition:'pixel',chapter:'СОБЕСЕДОВАНИЕ',reason:'«Опыт работы меня всё же выдал»: автор собирается из символов, словно система восстановила его по оставленным данным. Текстовый терминал соответствует опыту программиста.'},
  {start:19.52,end:22.8,styleId:25,motif:'interview',intensity:.35,transition:'diagonal',chapter:'СОБЕСЕДОВАНИЕ',reason:'«Молодая и голодная команда» получает нарядную театральную витрину ар-деко: торжественная самопрезентация работодателя перед следующей бытовой оговоркой.'},
  {start:22.8,end:26.12,styleId:11,motif:'hunger',intensity:.31,transition:'dissolve',chapter:'СОБЕСЕДОВАНИЕ',reason:'«По одному из условий я подходил»: гигантская пустая тарелка в пустыне раскрывает, какое именно условие совпало. Сюрреализм работает на шутку о голоде.'},
  {start:26.12,end:30.2,styleId:7,motif:'library',intensity:.48,transition:'pixel',chapter:'СОБЕСЕДОВАНИЕ',reason:'«Библиотеку взяли в основу»: векторные линии превращают личный труд в работающую техническую структуру. Линии и копии расходятся от одного источника.'},
  {start:30.2,end:35.52,styleId:18,motif:'rejection',intensity:.43,transition:'cut',chapter:'СОБЕСЕДОВАНИЕ',reason:'Отказ из-за недостатка гибкости и попытка выпрямиться остаются в одном плане. Подвижная марионетка буквально подчиняется чужим условиям; нити заменяют требования интервью.'},
  {start:35.52,end:39,styleId:9,motif:'rejection',intensity:.40,transition:'dissolve',chapter:'СОБЕСЕДОВАНИЕ',reason:'«Когда они это произносили»: фронтальный витраж делает комиссию безличным торжественным институтом. Герой оказывается маленькой частью чужой симметрии.'},
  {start:39,end:42.62,styleId:15,motif:'interview',intensity:.56,transition:'diagonal',chapter:'ЗАРПЛАТНАЯ ВИЛКА',reason:'Зарплатная вилка выглядит как обещание доступа в сияющий собор. Предприпев впервые раздувает масштаб и свет, не превращая предложение работы в победу.'},
  {start:42.62,end:46,styleId:1,motif:'plate',intensity:.41,transition:'cut',chapter:'ЗАРПЛАТНАЯ ВИЛКА',reason:'«Не облизнулся» возвращает метафору к столовому прибору. Крупная хромированная вилка связывает деньги с едой и подготавливает резкий вход припева.'},

  {start:46,end:52.04,styleId:10,motif:'rejection',intensity:.82,transition:'cut',chapter:'ОДИН ОРИГИНАЛ',reason:'Первый припев — ещё сопротивление: одна большая аниме-дуэль охватывает четыре строки о работе, нужной без автора. Непрерывная атака сильнее четырёх независимых заставок.'},
  {start:52.04,end:55.38,styleId:4,motif:'copies',intensity:.79,transition:'diagonal',chapter:'ОДИН ОРИГИНАЛ',reason:'«На тысячу копий — один оригинал»: многогранная арена окружает одного героя повторяемыми конструкциями. Обе половины сопоставления остаются в одном пространстве.'},
  {start:55.38,end:58.64,styleId:27,motif:'hunger',intensity:.61,transition:'cut',chapter:'ОДИН ОРИГИНАЛ',reason:'«Он хочет есть. Неудачный дизайн»: рентген показывает тело и прибор без оболочки. Биологическая потребность оказывается тем, что нельзя скопировать вместе с работой.'},
  {start:58.64,end:64.5,styleId:23,motif:'copies',intensity:.73,transition:'shards',chapter:'ОДИН ОРИГИНАЛ',reason:'Инструментальное продолжение разворачивает результат копирования в невозможную архитектуру. Система растёт после завершения фразы; автор не получает облегчения.'},
  {start:64.5,end:71.28,styleId:12,motif:'hunger',intensity:.54,transition:'dissolve',chapter:'ОДИН ОРИГИНАЛ',reason:'Вторая половина проигрыша отдаляет камеру до чужой пустынной планеты. После перенасыщенной структуры остаётся одиночество оригинала перед бытовым куплетом о хлебе.'},

  {start:71.28,end:78.12,styleId:20,motif:'bread',intensity:.46,transition:'cut',chapter:'КАРЬЕРА ХЛЕБА',reason:'Хлеб делает карьеру, поднимается и держит форму в упругом мультфильме. Две связанные строки получают единую комическую сцену пекарни.'},
  {start:78.12,end:84.16,styleId:13,motif:'bread',intensity:.43,transition:'diagonal',chapter:'КАРЬЕРА ХЛЕБА',reason:'Корочка, спрос и скидка становятся экономикой маленькой RPG: статус, товар и цена. Изометрия создаёт аккуратный мир, где место предмета заранее определено.'},
  {start:84.16,end:91.26,styleId:14,motif:'bread',intensity:.55,transition:'cut',chapter:'КАРЬЕРА ХЛЕБА',reason:'Переподготовка в сухари оформлена как производственный плакат. Жёсткая геометрия и тиражные штампы превращают одну буханку в стандартизованные части.'},
  {start:91.26,end:96.82,styleId:29,motif:'bread',intensity:.32,transition:'dissolve',chapter:'КАРЬЕРА ХЛЕБА',reason:'Поздравление успешного коллеги и просьбу не говорить о личном удерживает тёплая тканая поверхность. Ручной узор возвращает человеческое усилие внутрь сухой шутки.'},
  {start:96.82,end:100.06,styleId:30,motif:'shop',intensity:.45,transition:'cut',chapter:'ПРОДАТЬ СЕБЯ',reason:'«Надо себя продавать»: лицо раскладывается на кубистические товарные стороны. Здесь продаётся сам человек, поэтому крупный портрет важнее абстрактного магазина.'},
  {start:100.06,end:103.9,styleId:22,motif:'shop',intensity:.42,transition:'diagonal',chapter:'ПРОДАТЬ СЕБЯ',reason:'«Не хотелось бы портить продукт»: бумажный герой пытается сохранить цельность среди отдельных ярлыков. Возврат коллажа связывает продажу с анкетой первого куплета.'},

  {start:103.9,end:109.94,styleId:24,motif:'rejection',intensity:.84,transition:'cut',chapter:'РАБОТА БЕЗ АВТОРА',reason:'Второй припев дробится внутри комикса, а не повторяет первую дуэль. Глаз, рука с вилкой и маленькая фигура одновременно показывают усилие, действие и масштаб отказа.'},
  {start:109.94,end:113.02,styleId:31,motif:'copies',intensity:.77,transition:'shards',chapter:'РАБОТА БЕЗ АВТОРА',reason:'Тысяча копий образует оптическую решётку, внутри которой трудно удержать единичный оригинал. Повтор песни получает иной способ показать тиражирование.'},
  {start:113.02,end:117.16,styleId:6,motif:'hunger',intensity:.62,transition:'diagonal',chapter:'РАБОТА БЕЗ АВТОРА',reason:'Голод и неудачный дизайн становятся маленькой лодкой перед большой волной. Человеческая уязвимость остаётся видимой в природной метафоре, без повторения рентгена.'},
  {start:117.16,end:123.14,styleId:21,motif:'copies',intensity:.68,transition:'pixel',chapter:'РАБОТА БЕЗ АВТОРА',reason:'Проигрыш ускоряется в бесконечную гонку одинаковых участников. Движение не приносит финиша; это переход от конкуренции к попытке открыть собственный магазин.'},

  {start:123.14,end:127.08,styleId:2,motif:'shop',intensity:.37,transition:'cut',chapter:'СВОЯ КНОПКА «КУПИТЬ»',reason:'«Я форкнул магазин. Теперь у меня»: герой входит в маленькую собственную игру. Простая карманная консоль делает жест самостоятельности скромным и конкретным.'},
  {start:127.08,end:131.02,styleId:13,motif:'shop',intensity:.40,transition:'pixel',chapter:'СВОЯ КНОПКА «КУПИТЬ»',reason:'Собственная кнопка покупки получает пространство торговой RPG. Мир из куплета о хлебе теперь принадлежит автору хотя бы в пределах одной витрины.'},
  {start:131.02,end:135.54,styleId:7,motif:'distribution',intensity:.46,transition:'diagonal',chapter:'ЛИЦЕНЗИЯ',reason:'Лицензия разрешает деньги кому угодно: техническая сеть расходится во все стороны, не выделяя привилегированного получателя. Это правила распространения, а не ещё одна битва.'},
  {start:135.54,end:141.68,styleId:28,motif:'distribution',intensity:.31,transition:'pixel',chapter:'ЛИЦЕНЗИЯ',reason:'Отсутствие исключения для автора и многократная проверка остаются на одном терминальном экране. Длительный план передаёт навязчивое перечитывание условий.'},
  {start:141.68,end:147.52,styleId:16,motif:'resume',intensity:.29,transition:'dissolve',chapter:'ДОВЕСТИ ДО КОНЦА',reason:'Резюме и фраза о способности доводить до конца показаны нервным угольным рисунком. Герой сидит над листом; натиск эффектов отступает перед личным признанием.'},
  {start:147.52,end:153.07,styleId:22,motif:'resume',intensity:.36,transition:'cut',chapter:'ДОВЕСТИ ДО КОНЦА',reason:'На слове «стёр» меняется материал: коллаж позволяет зачеркнуть и пересобрать себя. «Быстро обучаюсь» и последующая пауза сохраняют одну бумажную сцену до срыва.'},

  {start:153.07,end:154.44,styleId:4,motif:'breakdown',intensity:.91,transition:'cut',chapter:'ИЛИ ЖИЗНЬ?',reason:'«Я тестовое»: короткое возвращение арены напоминает уже пройденное испытание. Ускорение монтажа начинается только вместе с криком.'},
  {start:154.44,end:156.36,styleId:10,motif:'breakdown',intensity:.99,transition:'shards',chapter:'ИЛИ ЖИЗНЬ?',reason:'«Сделал!» получает физический удар аниме-клинка. Разрез проходит по ударному слову, а не по независимому таймеру.'},
  {start:156.36,end:158.2,styleId:24,motif:'breakdown',intensity:.96,transition:'cut',chapter:'ИЛИ ЖИЗНЬ?',reason:'«Я шутку понял!» — тесные комиксные панели сжимают лицо и жест. Короткий кадр отвечает короткой выкрикнутой фразе.'},
  {start:158.2,end:160.14,styleId:19,motif:'breakdown',intensity:1,transition:'cut',chapter:'ИЛИ ЖИЗНЬ?',reason:'«Я вместе с вами»: первый огонь появляется на пике вынужденного участия. Эстрадная сцена превращает корпоративную общительность в болезненное публичное выступление.'},
  {start:160.14,end:163.47,styleId:26,motif:'breakdown',intensity:.98,transition:'shards',chapter:'ИЛИ ЖИЗНЬ?',reason:'На «смеялся» формы теряют устойчивость и текут. Новая психоделическая среда обозначает эмоциональный распад, а не декоративную смену фона.'},
  {start:163.47,end:165,styleId:30,motif:'breakdown',intensity:.83,transition:'cut',chapter:'ИЛИ ЖИЗНЬ?',reason:'«Скажите» на мгновение останавливает действие на расколотом лице. Это адресованный вопрос, поэтому центр кадра занимает говорящий человек.'},
  {start:165,end:166.82,styleId:17,motif:'rejection',intensity:.88,transition:'diagonal',chapter:'ИЛИ ЖИЗНЬ?',reason:'«Не прошёл собеседование»: вид от первого лица упирается в стены лабиринта. Пространство буквально не даёт пройти.'},
  {start:166.82,end:170.52,styleId:8,motif:'breakdown',intensity:.85,transition:'cut',chapter:'ИЛИ ЖИЗНЬ?',reason:'«Или жизнь?» расширяет частный тупик до индустриального тоннеля без выхода. Удержать его и в краткой паузе после вопроса, не разряжая напряжение новым аттракционом.'},
  {start:170.52,end:173.54,styleId:27,motif:'distribution',intensity:.39,transition:'dissolve',chapter:'ПОКА ТЁПЛЫЙ',reason:'«Не надо на память»: после вопроса остаётся призрачный человеческий след. Рентген возвращает тело из-под машинной конструкции и снижает зрительный шум.'},
  {start:173.54,end:177,styleId:5,motif:'hunger',intensity:.33,transition:'dissolve',chapter:'ПОКА ТЁПЛЫЙ',reason:'«Берите, пока тёплый»: прозрачный текучий материал передаёт хрупкость и ещё сохраняющееся тепло. Жест предложения удерживается до входа изменённого припева.'},

  {start:177,end:182.98,styleId:23,motif:'distribution',intensity:.63,transition:'cut',chapter:'МЕНЯ РАЗДАЛИ',reason:'«Меня раздали» получает архитектуру, собранную из повторяемых частей. Припев больше не выглядит новой победной атакой: работа уже функционирует как система без автора.'},
  {start:182.98,end:186.34,styleId:9,motif:'copies',intensity:.54,transition:'diagonal',chapter:'МЕНЯ РАЗДАЛИ',reason:'Копии и оригинал теперь застывают в тиражной симметрии витража. Прежний судящий институт оказывается устройством воспроизводства образа.'},
  {start:186.34,end:189.9,styleId:11,motif:'hunger',intensity:.43,transition:'dissolve',chapter:'МЕНЯ РАЗДАЛИ',reason:'Голод возвращает пустынную тарелку первого куплета. Теперь шутка лишена лёгкости: рядом с величественной системой по-прежнему нечего есть.'},
  {start:189.9,end:195.72,styleId:3,motif:'distribution',intensity:.40,transition:'dissolve',chapter:'МЕНЯ РАЗДАЛИ',reason:'В проигрыше впервые появляется живопись отдельными мазками. Разданный труд оставляет живой след руки; новый материал приходит поздно и служит человеческому ответу механическому тиражу.'},
  {start:195.72,end:201.02,styleId:18,motif:'distribution',intensity:.34,transition:'dissolve',chapter:'НЕ НА ПАМЯТЬ',reason:'Повтор «не надо на память» возвращает марионетку в опустевший театр. Длинный план оставляет героя действующим человеком, а не сувениром или победным символом.'},
  {start:201.02,end:207.98,styleId:29,motif:'hunger',intensity:.29,transition:'dissolve',chapter:'НЕ НА ПАМЯТЬ',reason:'«Берите, пока тёплый» и инструментальный хвост держатся на тканой, телесно тёплой поверхности. Дать фразе остыть в кадре, не перезапуская кульминацию.'},

  {start:207.98,end:211.96,styleId:31,motif:'distribution',intensity:.57,transition:'cut',chapter:'ТЫСЯЧА КОПИЙ',reason:'Последний возврат «я не продался — меня раздали» превращает повтор в оптическое давление. Слово «РАЗДАЛИ» входит в саму структуру рисунка.'},
  {start:211.96,end:214.58,styleId:7,motif:'distribution',intensity:.51,transition:'pixel',chapter:'ТЫСЯЧА КОПИЙ',reason:'«Моя работа нужна без меня»: работающая векторная сеть из сцены библиотеки возвращается отдельно от первоначального жеста дарения. Замыкается причинная связь первого куплета и финала.'},
  {start:214.58,end:217.86,styleId:14,motif:'copies',intensity:.47,transition:'diagonal',chapter:'ТЫСЯЧА КОПИЙ',reason:'Тысяча копий окончательно становится тиражом плаката. Первоначально комическая стандартизация хлеба теперь относится к человеку.'},
  {start:217.86,end:221.15,styleId:27,motif:'hunger',intensity:.37,transition:'dissolve',chapter:'ТЫСЯЧА КОПИЙ',reason:'«Он хочет есть. Неудачный дизайн»: рентген повторяется как доказательство неизменной телесной потребности. Это смысловой рефрен, а не повтор расписания стилей.'},
  {start:221.15,end:224.54,styleId:6,motif:'hunger',intensity:.27,transition:'dissolve',chapter:'ТЫСЯЧА КОПИЙ',reason:'Последний инструментальный ответ отводит взгляд к лодке и волне. Движение успокаивается, подготавливая возвращение к обычной вежливой речи.'},

  {start:224.54,end:229.92,styleId:0,motif:'outro',intensity:.16,transition:'dissolve',chapter:'Я СВОБОДЕН',reason:'«Здравствуйте. Возвращаясь к нашей беседе»: снова исходная комната и человек у стола. Держать приветствие и продолжение письма одним тихим планом.'},
  {start:229.92,end:233.46,styleId:1,motif:'plate',intensity:.13,transition:'dissolve',chapter:'Я СВОБОДЕН',reason:'«По вилке готов подвинуться» замыкает двойной смысл крупным предметным планом. Вилка больше не оружие и не архитектура — это прибор у пустой тарелки.'},
  {start:233.46,end:239.3,styleId:16,motif:'outro',intensity:.11,transition:'dissolve',chapter:'Я СВОБОДЕН',reason:'«Когда вам удобно? Я свободен»: неподвижный человек над письмом остаётся до конца последней реплики. Не перебивать признание свободой визуального аттракциона.'},
  {start:239.3,end:247.1,styleId:3,motif:'outro',intensity:.09,transition:'fade',chapter:'Я СВОБОДЕН',reason:'Длинный бессловесный живописный план удерживает присутствие автора после того, как голос замолчал. Мазки и слабое дыхание среды заменяют активный монтаж.'},
  {start:247.1,end:255,styleId:1,motif:'outro',intensity:.055,transition:'fade',chapter:'Я СВОБОДЕН',reason:'Закончить на том же пустом столе, с которого началась песня. Почти восьмисекундное удержание завершает историю ожиданием; никаких новых миров или ускорения в конце.'}
 ];
 const shots=Object.freeze(authored.map((shot,index)=>Object.freeze({...shot,index,duration:shot.end-shot.start})));
 const plan=shots;
 function cueAt(seconds){
  let t=Number(seconds);if(!Number.isFinite(t))t=0;t=Math.max(0,Math.min(duration,t));
  let lo=0,hi=shots.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(t<shots[mid].end)hi=mid;else lo=mid+1}
  const shot=shots[lo],local=Math.max(0,Math.min(shot.duration,t-shot.start));
  return{...shot,local,progress:local/shot.duration,prev:shots[lo-1]||null,next:shots[lo+1]||null};
 }
 return Object.freeze({shots,plan,cueAt,duration,motifs,transitionSeconds});
});
