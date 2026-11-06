import { useEffect } from 'react';
import { CERTIFICATE } from '../media';
import { knownPaths } from '../editorialRegistry';
import { withBasePath } from '../basePath';
import './About.css';

const steps = [
  { title: 'Спрос и интерес онлайн', text: 'Учитывать источник обращения, когда он доступен и его учёт допустим; иначе оставлять источник неизвестным.' },
  { title: 'Первый контакт', text: 'Проверить, кто видит запрос, когда отвечает и какой контекст получает.' },
  { title: 'Потребность', text: 'Выяснить, что важно клиенту и какие вопросы нужно передать специалисту.' },
  { title: 'Проверка возможности', text: 'До обещания условий проверить доступные ресурсы, сроки и необходимые согласования.' },
  { title: 'Офлайн-взаимодействие', text: 'Отдельно учитывать запись и фактический визит, а на месте сверять запрос с клиентом.' },
  { title: 'Продажа и передача', text: 'Передать исполнителю согласованный объём, условия и ограничения.' },
  { title: 'Качество и обратная связь', text: 'Определить, кто принимает замечания и сообщает клиенту о следующем шаге.' },
  { title: 'Возврат и повтор', text: 'Использовать доступную историю; возможность и основание повторного контакта определять отдельно.' },
];

const handoffs = [
  {
    number: '01',
    title: 'От интереса к разговору',
    text: 'Откуда пришло обращение, если источник доступен? Получает ли сотрудник сведения о задаче, чтобы клиенту не приходилось повторять всё заново?',
  },
  {
    number: '02',
    title: 'От разговора к решению',
    text: 'Что важно покупателю: доступность, состав работ или согласование с коллегой? Какие вопросы менеджер может решить сам, а какие передать специалисту?',
  },
  {
    number: '03',
    title: 'От продажи к исполнению',
    text: 'Видят ли исполнители согласованный объём и ограничения? Кто проверяет расписание, специалистов и материалы до того, как клиенту обещают условия?',
  },
  {
    number: '04',
    title: 'От исполнения к сервису',
    text: 'Кому передать замечание, кто отвечает за него и как клиент узнаёт о следующем шаге? Доступная история помогает не начинать разговор с нуля.',
  },
];

const questions = [
  {
    question: 'С какой задачи можно начать?',
    answer: 'С конкретного затруднения: например, контекст обращения не доходит до исполнителя или после встречи неизвестно, что делать дальше. Для первого разговора достаточно описать процесс и участников — без клиентской базы и паролей.',
  },
  {
    question: 'Обязательно ли менять CRM или заказывать разработку?',
    answer: 'Нет. Сначала стоит проверить существующий порядок работы и возможности используемых систем. Новую систему или разработку имеет смысл обсуждать, только если они подходят задаче и их поддержка оправданна.',
  },
  {
    question: 'Какую роль играет сотрудник, если рассматривается AI?',
    answer: 'Человек остаётся ответственным за решения, требующие профессиональной оценки, согласования или общения с клиентом. Для нестандартной ситуации и ошибки важно заранее определить, кому передаётся вопрос и какой контекст доступен этому сотруднику.',
  },
  {
    question: 'Что происходит, если данные не передаются или решения пока нет?',
    answer: 'Следует обозначить ограничение, проверить технические возможности и назначить ответственного за ручную передачу либо согласовать другой обходной порядок. Наличие интеграции и совместимость систем нельзя предполагать без проверки.',
  },
  {
    question: 'Можно ли посмотреть реальные проекты?',
    answer: 'Подготовлены материалы проектов Escalada Fitness и «Рыба Сан». Проект «Рыба Сан» ещё в работе; показатели Escalada приведены по предоставленной презентации с оговорками о данных. Пример мастерской выше — иллюстрация, а не реальный проект.',
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function About() {
  useEffect(() => {
    const previousTitle = document.title;
    const existingDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = existingDescription?.getAttribute('content');
    const description = existingDescription ?? document.createElement('meta');

    if (!existingDescription) {
      description.name = 'description';
      document.head.appendChild(description);
    }
    document.title = 'О компании — подход к клиентским процессам и технологиям';
    description.setAttribute('content', 'Как мы предлагаем разбирать путь клиента, выбирать технологии и согласовывать работу людей, систем и подразделений');

    return () => {
      document.title = previousTitle;
      if (!existingDescription) description.remove();
      else if (previousDescription === null) existingDescription.removeAttribute('content');
      else if (previousDescription !== undefined) existingDescription.setAttribute('content', previousDescription);
    };
  }, []);

  return (
    <main className="about-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-wrap">
          <div className="about-topline">
            <span><i aria-hidden="true" /> 8 Углов / О компании</span>
            <span>Подход к задачам бизнеса</span>
          </div>
          <div className="about-hero-grid">
            <div className="about-hero-copy">
              <p className="about-kicker"><span>01 /</span> Человек · процесс · технология</p>
              <h1 id="about-title">«8 Углов»: о подходе к <span>задачам бизнеса</span></h1>
              <p className="about-hero-lead">Технологии имеют смысл, когда помогают людям работать вместе, а клиенту — пройти путь от первого вопроса до результата.</p>
              <div className="about-hero-actions">
                <a className="about-button" href="#about-method">Посмотреть подход <span aria-hidden="true">↓</span></a>
                <a className="about-link" href="https://wa.me/79642388885" target="_blank" rel="noopener noreferrer">WhatsApp <span className="about-sr-only">, откроется в новой вкладке</span><Arrow /></a>
                <a className="about-link" href="https://t.me/+79642388885" target="_blank" rel="noopener noreferrer">Telegram <span className="about-sr-only">, откроется в новой вкладке</span><Arrow /></a>
              </div>
            </div>
            <div className="about-hero-art" aria-hidden="true">
              <div className="about-art-top"><span>Смотреть шире системы</span><span>01 — 08</span></div>
              <svg className="about-art-svg" viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="240" cy="240" r="199" stroke="currentColor" strokeOpacity=".13" />
                <circle cx="240" cy="240" r="161" stroke="currentColor" strokeOpacity=".12" />
                <path d="M177 53H303L427 177V303L303 427H177L53 303V177L177 53Z" stroke="currentColor" strokeOpacity=".65" />
                <path d="M204 119H276L361 204V276L276 361H204L119 276V204L204 119Z" stroke="currentColor" strokeOpacity=".28" />
                <path d="M240 41V439M41 240H439M99 99L381 381M381 99L99 381" stroke="currentColor" strokeOpacity=".16" />
                <circle cx="240" cy="240" r="91" fill="#08080a" stroke="currentColor" strokeOpacity=".6" />
                <text x="240" y="280" textAnchor="middle" fill="currentColor" fontFamily="Manrope, sans-serif" fontSize="144" fontWeight="800">8</text>
                <circle cx="177" cy="53" r="4" fill="currentColor" />
                <circle cx="427" cy="177" r="4" fill="currentColor" />
                <circle cx="303" cy="427" r="4" fill="currentColor" />
                <circle cx="53" cy="303" r="4" fill="currentColor" />
              </svg>
              <div className="about-art-bottom"><span>Восемь переходов</span><span>Один клиентский путь</span></div>
            </div>
          </div>
          <div className="about-hero-foot"><span>Подход начинается с вопроса</span><span>Что происходит между шагами? <span aria-hidden="true">↓</span></span></div>
        </div>
      </section>

      <section className="about-section about-intro" aria-labelledby="about-intro-title">
        <div className="about-wrap">
          <div className="about-section-head"><p className="about-kicker"><span>02 /</span> Отправная точка</p><span className="about-section-index">ПРОЦЕСС, А НЕ ИНСТРУМЕНТ</span></div>
          <div className="about-split">
            <h2 id="about-intro-title">Технологии — <span>часть процесса,</span> а не цель.</h2>
            <div className="about-prose">
              <p className="about-prose-lead">Бизнесу может быть нужна не ещё одна программа, а понятный способ решить рабочую проблему.</p>
              <p>Обращения приходят, но сотрудники теряют контекст. Клиенту предлагают запись, но подходящего времени нет. Продажа согласована, а исполнители узнают о важных условиях слишком поздно. Причина может находиться на стыке людей, правил и систем.</p>
              <p>«8 Углов» предлагает разбирать такие задачи как единый клиентский процесс: что человек хочет получить, какие решения ему предстоит принять, кто ему отвечает и что происходит после покупки. Инструмент имеет смысл, если он вписывается в эту цепочку и его можно поддерживать.</p>
            </div>
          </div>
          <div className="about-principle"><span className="about-principle-mark" aria-hidden="true">↳</span><p>Сначала понять задачу и путь клиента.<br /><strong>Затем выбирать решение.</strong></p><span className="about-principle-label">ПРИНЦИП / 01</span></div>
        </div>
      </section>

      <section className="about-section about-losses" aria-labelledby="about-losses-title">
        <div className="about-wrap">
          <div className="about-section-head"><p className="about-kicker"><span>03 /</span> Точки передачи</p><span className="about-section-index">ЧТО ПРОИСХОДИТ МЕЖДУ ШАГАМИ</span></div>
          <div className="about-heading-row"><h2 id="about-losses-title">Где искать<br /><span>потери?</span></h2><p>Начать можно с одного процесса: откуда человек узнал о предложении, кто увидел его запрос и что произошло дальше. Проверять стоит не только действия, но и передачу ответственности.</p></div>
          <div className="about-handoffs">
            {handoffs.map((item) => (
              <article className="about-handoff" key={item.number}>
                <span className="about-card-number">{item.number} / 04</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className="about-note"><span aria-hidden="true">※</span> Обращение, запись, фактическая встреча, заказ, оплата и исполнение — разные события. Одно не означает автоматически следующее. Если источник неизвестен, его не стоит приписывать подходящему каналу.</p>
          <p className="about-note"><span aria-hidden="true">※</span> Причина пропущенного действия может быть в непереданных сведениях, отсутствии ответственного или необходимости согласования. Выводы стоит проверять на фактических процессах, а не предполагать заранее.</p>
        </div>
      </section>

      <section className="about-section about-method" id="about-method" tabIndex={-1} aria-labelledby="about-method-title">
        <div className="about-wrap">
          <div className="about-section-head"><p className="about-kicker"><span>04 /</span> Схема для разговора</p><span className="about-section-index">01 — 08</span></div>
          <div className="about-heading-row about-method-heading"><h2 id="about-method-title">Восемь переходов.<br /><span>Один путь.</span></h2><p>Это не универсальная воронка и не обещание результата. Схема помогает задать вопросы на стыках; реальные этапы и их порядок зависят от задачи бизнеса.</p></div>
          <ol className="about-steps">
            {steps.map((step, index) => (
              <li className="about-step" key={step.title}>
                <span className="about-step-number">{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </li>
            ))}
          </ol>
          <p className="about-method-caption">На каждом переходе полезно спросить: что известно, кто отвечает и какое действие согласовано дальше?</p>
        </div>
      </section>

      <section className="about-section about-example" aria-labelledby="about-example-title">
        <div className="about-wrap about-example-grid">
          <div>
            <p className="about-kicker"><span>05 /</span> Иллюстрация</p>
            <h2 id="about-example-title">Как может выглядеть <span>сквозной разбор.</span></h2>
            <p className="about-example-disclaimer">Вымышленная ситуация для объяснения подхода, не описание реального проекта.</p>
          </div>
          <div className="about-example-body">
            <p className="about-prose-lead">Предположим, организация ищет мастерскую для ремонта рабочего оборудования. Ей важно оценить неисправность, согласовать расходы внутри компании и понять, когда оборудование вернётся в работу.</p>
            <div className="about-example-item"><span>01</span><p><strong>Запрос и запись.</strong> Представитель оставляет запрос на сайте. Доступный источник сохраняют, если его учёт допустим, иначе отмечают как неизвестный. Сотрудник уточняет тип оборудования и договаривается о диагностике; в CRM фиксируют необходимый контекст и ответственного. Запись ещё не означает посещение или продажу.</p></div>
            <div className="about-example-item"><span>02</span><p><strong>Фактический приём.</strong> Когда оборудование привозят, сотрудник сверяет запрос, осматривает его и объясняет возможности диагностики. Результат приёма фиксируют в системе учёта работ или заказ-наряде. Связь с CRM возможна после проверки совместимости систем и согласования передачи данных; если связать записи нельзя, ответственный переносит сведения вручную и проверяет их полноту.</p></div>
            <div className="about-example-item"><span>03</span><p><strong>Предложение и согласование.</strong> Специалист сообщает менеджеру результаты осмотра и варианты. Менеджер объясняет состав предложения и условия, которые ещё нужно проверить; представитель может передать их коллеге для согласования расходов. Если детали или специалиста нет, альтернативу уточняют у исполнителя и обсуждают с клиентом. При отказе фиксируют итог и отсутствие дальнейшего действия либо согласованный способ связи — не предполагая причину отказа.</p></div>
            <div className="about-example-item"><span>04</span><p><strong>Исполнение и сервис.</strong> После согласования объём и условия передают исполнителю. Завершение ремонта и выдачу оборудования фиксируют отдельно от продажи и оплаты. Замечание направляют ответственному за сервис, а при новом обращении используют доступную историю. Возможность повторного контакта и его основание определяют отдельно, не выводя их из факта покупки.</p></div>
            <p className="about-example-end">Задача партнёра — вместе с бизнесом выявить, где теряются информация или ответственность, и предложить изменения: в порядке передачи, настройке существующей системы или интеграции. Необходимость и возможность каждого варианта проверяются отдельно.</p>
          </div>
        </div>
      </section>

      <section className="about-section about-solutions" aria-labelledby="about-solutions-title">
        <div className="about-wrap">
          <div className="about-section-head"><p className="about-kicker"><span>06 /</span> Выбор решения</p><span className="about-section-index">ВМЕСТЕ С КОМАНДОЙ</span></div>
          <div className="about-split">
            <h2 id="about-solutions-title">Не каждую проблему нужно решать <span>разработкой.</span></h2>
            <div className="about-prose"><p className="about-prose-lead">Иногда достаточно договориться о полях в карточке и назначить ответственного.</p><p>В другом случае может понадобиться настройка используемого сервиса, а при подтверждённой технической возможности — обмен между системами или отдельная разработка. Каждый вариант проверяется отдельно.</p><p>AI можно рассматривать для ограниченных задач, если понятны данные, проверка результата и способ передать вопрос человеку. Он не заменяет решение специалиста или согласование с заказчиком.</p></div>
          </div>
          <div className="about-considerations">
            <div><span>01 / УЧАСТНИКИ</span><p>Согласовать изменение с теми, кто принимает обращения, исполняет заказ и отвечает за поддержку: схема на экране может отличаться от работы на месте.</p></div>
            <div><span>02 / ЭКОНОМИКА</span><p>Сравнить запуск, лицензии, инфраструктуру, труд сотрудников, сопровождение, ограничения поставщиков и исправление ошибок. Собственное решение не обязательно дешевле готового.</p></div>
            <div><span>03 / ГРАНИЦЫ</span><p>До работ определить задачу, состав и границы проекта, доступы, ответственных, условия проверки и поддержки.</p></div>
          </div>
          <p className="about-note"><span aria-hidden="true">※</span> Цена, сроки, доступность услуг и условия сотрудничества обсуждаются отдельно и подтверждаются после изучения задачи.</p>
        </div>
      </section>

      <section className="about-section about-measure" aria-labelledby="about-measure-title">
        <div className="about-wrap">
          <div className="about-section-head"><p className="about-kicker"><span>07 /</span> Проверка результата</p><span className="about-section-index">ПОКАЗАТЕЛИ И ЭКОНОМИКА</span></div>
          <div className="about-split">
            <h2 id="about-measure-title">Проверять, а не <span>предполагать.</span></h2>
            <div className="about-prose"><p className="about-prose-lead">Пример рабочей метрики — доля фактических посещений с зафиксированным следующим шагом и ответственным.</p><p>Источники — отметка о фактическом приёме и связанная запись или задача в CRM либо согласованной системе. Повторы нужно сопоставить, а отмены и неявки не включать.</p></div>
          </div>
          <div className="about-metric">
            <div className="about-metric-label">ПРИМЕР / ДОЛЯ ПОСЕЩЕНИЙ</div>
            <div className="about-metric-fraction"><p><span>Числитель</span> Фактические посещения за период, для которых записаны следующий шаг и ответственный</p><p><span>Знаменатель</span> Все фактические посещения за тот же период</p></div>
            <p className="about-metric-note">Записи, которые нельзя надёжно связать, учитываются отдельно как неполные данные.</p>
          </div>
          <p className="about-measure-bottom">Метрика показывает полноту передачи задачи, но сама по себе не доказывает рост продаж или причину изменений. Для оценки экономики отдельно рассматривают выручку и затраты на привлечение, исполнение и сопровождение: <strong>выручка не равна прибыли.</strong> Сопоставление периодов помогает сформулировать вопросы, но без дополнительной проверки не доказывает причинно-следственную связь.</p>
        </div>
      </section>

      <section className="about-section about-certificate" aria-labelledby="about-certificate-title">
        <div className="about-wrap about-certificate-grid">
          <div className="about-certificate-copy">
            <p className="about-kicker"><span>08 /</span> Документ</p>
            <h2 id="about-certificate-title">Сертификат <span>amoSTART.</span></h2>
            <p>В предоставленном сертификате Руслан Лиферов указан как официальный партнёр программы amoSTART.</p>
            <p className="about-certificate-warning">Это личный сертификат специалиста, а не подтверждение статуса компании. Перед публичным размещением необходимо проверить актуальность статуса и связь специалиста с «8 Углов».</p>
            <a className="about-link" href={CERTIFICATE} target="_blank" rel="noopener noreferrer">Открыть в полном размере <span className="about-sr-only">сертификат, откроется в новой вкладке</span><Arrow /></a>
          </div>
          <figure className="about-certificate-figure">
            <a className="about-certificate-image" href={CERTIFICATE} target="_blank" rel="noopener noreferrer" aria-label="Открыть сертификат amoSTART на имя Руслана Лиферова в полном размере, в новой вкладке">
              <img src={CERTIFICATE} alt="Сертификат amoSTART на имя Руслана Лиферова" />
              <span aria-hidden="true">↗</span>
            </a>
            <figcaption>Сертификат программы amoSTART на имя Руслана Лиферова, выдан 31.07.2026</figcaption>
          </figure>
        </div>
      </section>

      <section className="about-section about-faq" aria-labelledby="about-faq-title">
        <div className="about-wrap about-faq-grid">
          <div><p className="about-kicker"><span>09 /</span> Вопросы и ответы</p><h2 id="about-faq-title">Проясним <span>важное.</span></h2></div>
          <div className="about-faq-list">
            {questions.map((item) => (
              <details className="about-faq-item" key={item.question}>
                <summary>{item.question}<span aria-hidden="true" /></summary>
                <p>{item.answer}</p>
              </details>
            ))}
            {knownPaths.has('/kejsy/') && <a className="about-link" href={withBasePath('/kejsy/')}>Посмотреть проекты <Arrow /></a>}
          </div>
        </div>
      </section>

      <section className="about-contact" aria-labelledby="about-contact-title">
        <div className="about-wrap">
          <div className="about-contact-top"><p className="about-kicker"><span>10 /</span> Первый шаг</p><span>ЕСТЬ ЗАДАЧА? ДАВАЙТЕ ОБСУДИМ.</span></div>
          <div className="about-contact-grid">
            <h2 id="about-contact-title">Начнём<br />с <span>вопроса.</span></h2>
            <div><p>Расскажите, где в процессе возникают сложности: при обращении, встрече, согласовании, исполнении или обслуживании.</p><p className="about-contact-small">Достаточно кратко описать ситуацию и используемые системы — без паролей, клиентских баз и медицинских данных.</p><div className="about-messenger-actions"><a className="about-button about-button-light" href="https://wa.me/79642388885" target="_blank" rel="noopener noreferrer">WhatsApp <span className="about-sr-only">, откроется в новой вкладке</span><Arrow /></a><a className="about-button about-button-light" href="https://t.me/+79642388885" target="_blank" rel="noopener noreferrer">Telegram <span className="about-sr-only">, откроется в новой вкладке</span><Arrow /></a></div></div>
          </div>
          <div className="about-contact-bottom"><span>8 УГЛОВ / О КОМПАНИИ</span><a href="https://wa.me/79642388885" target="_blank" rel="noopener noreferrer">WhatsApp <span className="about-sr-only">, откроется в новой вкладке</span><span aria-hidden="true">↗</span></a></div>
        </div>
      </section>
    </main>
  );
}
