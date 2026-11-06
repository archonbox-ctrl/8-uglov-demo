import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { steps } from "../content";
import { knownPaths } from "../editorialRegistry";
import { withBasePath } from "../basePath";
import "./HomeSections.css";

const whatsapp = "https://wa.me/79642388885";

const directions = [
  {
    number: "01",
    title: "Привлечение клиентов",
    text: "Предложение, аудитория и каналы — с пониманием того, куда попадёт обращение и кто на него ответит.",
    tags: "Яндекс Директ / VK Реклама / Авито",
    href: "/uslugi/privlechenie-klientov/",
  },
  {
    number: "02",
    title: "CRM и работа с обращениями",
    text: "Этапы работы, карточка клиента, задачи сотрудников и правила передачи договорённостей.",
    tags: "amoCRM / процессы / команда",
    href: "/uslugi/vnedrenie-amocrm/",
  },
  {
    number: "03",
    title: "Разработка и интеграции",
    text: "Обмен между рабочими системами — после проверки совместимости, доступов и ответственности за ошибки.",
    tags: "Системы / данные / поддержка",
    href: "/uslugi/razrabotka-i-integracii/",
  },
  {
    number: "04",
    title: "AI для бизнеса",
    text: "Помощь в типовых вопросах, звонках и переписке. Полномочия и передачу человеку определяем заранее.",
    tags: "Аудит / голос / мессенджеры",
    href: "/uslugi/ai-otdel-prodazh/",
  },
  {
    number: "05",
    title: "Аналитика и CRM-маркетинг",
    text: "Разбираем доступные данные: какие обращения дошли до визита и продажи, а где связь с источником потеряна.",
    tags: "Переходы / источники / повтор",
  },
  {
    number: "06",
    title: "Аудит процессов и расходов",
    text: "Изучаем действия людей, переходы между системами и используемые сервисы. Замена всех инструментов не обязательна.",
    tags: "Процессы / сервисы / решения",
  },
  {
    number: "07",
    title: "AI-оборудование из Китая",
    text: "Можно обсудить подбор техники для локальных моделей: совместимость, условия закупки, логистику и гарантию проверяют отдельно.",
    tags: "Локальные модели / совместимость / условия закупки",
    href: "/uslugi/ai-oborudovanie-iz-kitaya/",
  },
];

const industries = [
  "Фитнес-клубы", "Студии растяжки", "Косметология", "Стоматологии",
  "Салоны красоты", "Рестораны", "Доставка еды", "Автосервисы и детейлинг", "Образовательные центры",
];

const process = [
  { number: "01", title: "Начинаем с задачи", text: "Обсуждаем, что происходит после обращения, кто участвует и где нужна помощь." },
  { number: "02", title: "Разбираем переход", text: "Смотрим на работу сотрудников, существующие системы, доступные данные и ограничения." },
  { number: "03", title: "Выбираем решение", text: "Сравниваем изменение порядка работы, настройку, интеграцию или разработку. AI нужен не всегда." },
  { number: "04", title: "Согласуем условия", text: "Определяем состав работ, ответственность, расходы, проверку результата и дальнейшую поддержку." },
];

const questions = [
  { question: "С чего начать, если я не знаю, нужна реклама или CRM?", answer: "Опишите, где возникает вопрос: в количестве обращений, их обработке, визитах, передаче заказа или исполнении. Сначала стоит проверить этот переход, а не выбирать инструмент по названию." },
  { question: "Обязательно ли менять CRM?", answer: "Нет. Сначала стоит проверить существующий порядок работы и возможности используемых систем. Иногда достаточно изменить процесс или настройку." },
  { question: "Можно ли обсудить только одну задачу?", answer: "Да. Можно начать с отдельного процесса или системы. Формат и границы работ согласуются после обсуждения." },
  { question: "AI будет общаться с клиентами вместо сотрудников?", answer: "Роль помощника зависит от сценария. Нестандартные запросы, жалобы, подтверждение условий и профессиональные решения должны передаваться человеку." },
  { question: "Что потребуется для первого разговора?", answer: "Достаточно общего описания задачи, участников и используемых систем. Не присылайте пароли, клиентские базы или медицинские данные." },
];

function Label({ number, children }: { number: string; children: string }) {
  return <div className="hs-label"><span>{number} /</span>{children}</div>;
}

function WhatsAppLink({ children, className = "" }: { children: string; className?: string }) {
  return (
    <a className={className} href={whatsapp} target="_blank" rel="noopener noreferrer">
      {children}<ArrowUpRight aria-hidden="true" size={18} />
    </a>
  );
}

export default function HomeSections() {
  return (
    <div className="home-sections">
      <nav className="hs-chapter-nav" aria-label="Разделы главной">
        <div className="hs-container hs-chapter-nav-inner">
          <span className="hs-chapter-label">ИССЛЕДУЙТЕ СИСТЕМУ <ArrowDown size={13} aria-hidden="true" /></span>
          <div className="hs-chapter-links">
            <a href="#approach">ПОДХОД</a><a href="#directions">НАПРАВЛЕНИЯ</a><a href="#projects">ПРОЕКТЫ</a><a href="#hs-contact">КОНТАКТ</a>
          </div>
        </div>
      </nav>

      <section className="hs-intro hs-section" aria-labelledby="hs-intro-title">
        <div className="hs-container hs-intro-grid">
          <div>
            <Label number="01">ГДЕ НАЧИНАЕТСЯ ЗАДАЧА</Label>
            <h2 id="hs-intro-title">Клиент приходит<br /><em>не в CRM.</em><br />Он приходит к вам.</h2>
          </div>
          <div className="hs-intro-copy">
            <span className="hs-cross" aria-hidden="true">✳</span>
            <p>Человек может легко оставить заявку — и потеряться на следующем шаге. Запись ещё не означает визит, а продажа не означает, что исполнитель получил все договорённости.</p>
            <p>Помогаем разобрать путь целиком: от интереса и первого ответа до исполнения, обратной связи и повторного обращения.</p>
            <a href="#approach" className="hs-underlink">ПОСМОТРЕТЬ ПОДХОД <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="hs-container hs-observations" aria-label="Вопросы к клиентскому процессу">
          <div><span>01</span><p>Откуда пришёл<br />интерес?</p></div>
          <div><span>02</span><p>Кто ответил<br />клиенту?</p></div>
          <div><span>03</span><p>Что передали<br />в исполнение?</p></div>
          <div><span>04</span><p>Почему человек<br />вернулся или нет?</p></div>
        </div>
      </section>

      <section id="approach" className="hs-path hs-section" aria-labelledby="hs-path-title">
        <div className="hs-container">
          <div className="hs-heading hs-path-heading">
            <div><Label number="02">МОДЕЛЬ «8 УГЛОВ»</Label><h2 id="hs-path-title">Восемь переходов.<br /><em>Одна связанная история.</em></h2></div>
            <p>Не набор инструментов, а точки, в которых важно сохранить контекст и ответственность за следующий шаг.</p>
          </div>
          <div className="hs-path-grid">
            {steps.map((step, index) => (
              <article className="hs-path-item" key={step.part}>
                <div className="hs-path-top"><span>{String(index + 1).padStart(2, "0")}</span><span aria-hidden="true">↗</span></div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <div className="hs-path-part">{step.part}</div>
              </article>
            ))}
          </div>
          <p className="hs-path-note"><span>Важный принцип</span> Не каждому бизнесу нужны все восемь шагов в одинаковом виде. Начать можно с одного перехода.</p>
        </div>
      </section>

      <section className="hs-statement" aria-label="Принцип работы">
        <div className="hs-container hs-statement-inner">
          <span className="hs-statement-mark" aria-hidden="true">↗</span>
          <p>Технология имеет смысл,<br />если помогает <strong>конкретному процессу.</strong></p>
          <span className="hs-statement-side">ЛЮДИ + ПРАВИЛА<br />+ СИСТЕМЫ</span>
        </div>
      </section>

      <section id="directions" className="hs-directions hs-section" aria-labelledby="hs-directions-title">
        <div className="hs-container">
          <div className="hs-heading">
            <div><Label number="03">НАПРАВЛЕНИЯ РАБОТЫ</Label><h2 id="hs-directions-title">От задачи —<br /><em>к решению.</em></h2></div>
            <p>Необязательно заранее знать, какая программа или канал нужны бизнесу. Полезнее начать с того, где клиенту трудно получить ответ.</p>
          </div>
          <div className="hs-direction-grid">
            {directions.map((item) => (
              <article className="hs-direction" key={item.number}>
                <div className="hs-direction-top"><span>{item.number} / 07</span><span className="hs-direction-cross" aria-hidden="true">+</span></div>
                <h3>{item.title}</h3><p>{item.text}</p><div className="hs-direction-tags">{item.tags}</div>{item.href && knownPaths.has(item.href) && <a className="hs-card-link" href={withBasePath(item.href)}>ПОДРОБНЕЕ <ArrowRight size={14} aria-hidden="true" /></a>}
              </article>
            ))}
          </div>
          <div className="hs-direction-bottom"><p>Состав работ и инструменты обсуждаются под ситуацию клиента.</p><WhatsAppLink className="hs-underlink">ОБСУДИТЬ ЗАДАЧУ</WhatsAppLink></div>
        </div>
      </section>

      <section className="hs-industries hs-section" aria-labelledby="hs-industries-title">
        <div className="hs-container hs-industries-grid">
          <div className="hs-industries-copy">
            <Label number="04">ЛОКАЛЬНЫЙ БИЗНЕС</Label>
            <h2 id="hs-industries-title">За каждым<br />обращением —<br /><em>реальный человек.</em></h2>
            <p>Клуб, салон, ресторан или сервис: путь клиента продолжается за пределами экрана. Важно, что происходит при встрече, исполнении и после неё.</p>
            <span className="hs-industries-note">ПРИМЕРЫ СФЕР ДЛЯ ОБСУЖДЕНИЯ, НЕ СПИСОК КЕЙСОВ</span>
          </div>
          <div className="hs-industry-list" aria-label="Примеры сфер">
            {industries.map((industry, index) => <div key={industry}><span>{String(index + 1).padStart(2, "0")}</span><h3>{industry}</h3><i aria-hidden="true" /></div>)}
          </div>
        </div>
      </section>

      <section id="projects" className="hs-projects hs-section" aria-labelledby="hs-projects-title">
        <div className="hs-container">
          <div className="hs-heading">
            <div><Label number="05">ПРОЕКТЫ</Label><h2 id="hs-projects-title">Разные задачи.<br /><em>Единый взгляд.</em></h2></div>
            <p>Две истории локального бизнеса: важен не только инструмент, но и то, как работают люди и передаётся контекст.</p>
          </div>
          <div className="hs-project-grid">
            <article className="hs-project hs-project-fitness">
              <div className="hs-project-meta"><span>ФИТНЕС / CRM / ПРОДАЖИ</span><span>01</span></div>
              <div className="hs-project-art" aria-hidden="true"><div className="hs-project-orbit hs-project-orbit-one" /><div className="hs-project-orbit hs-project-orbit-two" /><div className="hs-project-visual-text"><small>КОНТАКТ / КОМАНДА</small><strong>ОТ ИНТЕРЕСА<br /><em>К ПОКУПКЕ</em></strong></div></div>
              <div className="hs-project-content">
                <h3>Escalada Fitness</h3>
                <p>По материалам проекта: работа с CRM, воронками, регламентами, интеграциями и аналитикой для отделов продаж двух клубов.</p>
                <div className="hs-project-stats" aria-label="Показатели из предоставленной презентации">
                  <div><strong>×2,4</strong><span>выручка клуба 1<br />по сводке презентации</span></div>
                  <div><strong>×2,1</strong><span>выручка клуба 2<br />по сводке презентации</span></div>
                  <div><strong>33,55 млн ₽</strong><span>пик за месяц: Коммунарка,<br />декабрь 2024</span></div>
                  <div><strong>28,19 млн ₽</strong><span>пик за месяц: Губкина,<br />ноябрь 2024</span></div>
                </div>
                <p className="hs-project-source">Источник: предоставленная презентация Escalada Fitness. Первичные учётные данные не предоставлены; периоды и методика сводных кратностей не раскрыты. Пики относятся к разным месяцам и не равны средним значениям. Причинная связь с отдельным действием не установлена; результат другого проекта может отличаться.</p>
                {knownPaths.has("/kejsy/fitnes-klub/") && <a className="hs-card-link" href={withBasePath("/kejsy/fitnes-klub/")}>ПОДРОБНЕЕ О ПРОЕКТЕ <ArrowRight size={14} aria-hidden="true" /></a>}
              </div>
            </article>
            <article className="hs-project hs-project-cafe">
              <div className="hs-project-meta"><span>КАФЕ / ДОСТАВКА</span><span className="hs-status"><i /> ПРОЕКТ В РАБОТЕ</span></div>
              <div className="hs-cafe-symbol" aria-hidden="true"><span>●</span><span>✳</span><span>●</span></div>
              <div className="hs-project-content"><h3>Рыба Сан</h3><p>В кафе пиццы и суши с доставкой ведётся автоматизация маркетинга. Подробную информацию предоставляем по запросу; работа продолжается.</p>{knownPaths.has("/kejsy/dostavka-edy/") && <a className="hs-card-link" href={withBasePath("/kejsy/dostavka-edy/")}>ПОДРОБНЕЕ О ПРОЕКТЕ <ArrowRight size={14} aria-hidden="true" /></a>}<WhatsAppLink className="hs-underlink">ЗАПРОСИТЬ ПОДРОБНОСТИ</WhatsAppLink></div>
            </article>
          </div>
          <p className="hs-project-disclaimer">Использование проектов как кейсов подтверждено владельцем. Дополнительные подробности раскрываются по согласованию; права на сторонние материалы проверяются отдельно.</p>
        </div>
      </section>

      <section className="hs-process hs-section" aria-labelledby="hs-process-title">
        <div className="hs-container">
          <div className="hs-heading">
            <div><Label number="06">КАК МЫ ПОДХОДИМ К ЗАДАЧЕ</Label><h2 id="hs-process-title">Сначала понять.<br /><em>Затем менять.</em></h2></div>
            <p>Иногда достаточно договориться о порядке работы. Иногда стоит проверить настройку системы или обмен данными.</p>
          </div>
          <div className="hs-process-grid">
            {process.map((item) => <article key={item.number}><span className="hs-process-num">{item.number}</span><div className="hs-process-line"><i /></div><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="hs-faq hs-section" aria-labelledby="hs-faq-title">
        <div className="hs-container hs-faq-grid">
          <div><Label number="07">ВОПРОСЫ И ОТВЕТЫ</Label><h2 id="hs-faq-title">Хорошие вопросы<br /><em>до начала работы.</em></h2><p className="hs-faq-intro">Если вашего вопроса здесь нет, расскажите о нём в первом разговоре.</p></div>
          <div className="hs-faq-list">
            {questions.map((item) => <details key={item.question}><summary><span>{item.question}</span><Plus size={19} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}
          </div>
        </div>
      </section>

      <section id="hs-contact" className="hs-contact" aria-labelledby="hs-contact-title">
        <div className="hs-container hs-contact-grid">
          <div><Label number="08">СЛЕДУЮЩИЙ ШАГ</Label><h2 id="hs-contact-title">Расскажите,<br />где нужна <em>ясность.</em></h2></div>
          <div className="hs-contact-copy">
            <p>Что происходит после обращения клиента и какой переход хочется улучшить? Начнём с участка, который важен вашему бизнесу.</p>
            <div style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}>
              <WhatsAppLink className="hs-contact-button">ОБСУДИТЬ ЗАДАЧУ</WhatsAppLink>
              <a className="hs-contact-button" href="https://t.me/+79642388885" target="_blank" rel="noopener noreferrer">НАПИСАТЬ В TELEGRAM <ArrowUpRight aria-hidden="true" size={18} /></a>
            </div>
            <span>WHATSAPP И TELEGRAM · БЕЗ АВТОМАТИЧЕСКОЙ ОТПРАВКИ</span>
            <a className="hs-about-link" href={withBasePath("/o-kompanii/")}>БОЛЬШЕ О НАШЕМ ПОДХОДЕ <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </div>
  );
}
