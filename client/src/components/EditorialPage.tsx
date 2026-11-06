import { useEffect } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import type { EditorialPageContent } from "../editorial/types";
import { tools } from "../catalogData";
import { CERTIFICATE } from "../media";
import { withBasePath } from "../basePath";
import CatalogPreview, { CategoryToolList } from "./CatalogPreview";
import "./EditorialPage.css";

const WHATSAPP = "https://wa.me/79642388885";
const TELEGRAM = "https://t.me/+79642388885";
const catalogToolPaths = new Set(tools.map((tool) => `/instrumenty/${tool.slug}/`));

function calendarDate(value: string) {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return date ? `${date[3]}.${date[2]}.${date[1]}` : value;
}

export default function EditorialPage({ page, knownPaths }: { page: EditorialPageContent; knownPaths: Set<string> }) {
  useEffect(() => {
    document.title = page.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = page.description;
  }, [page]);
  const related = page.related.filter((item) => knownPaths.has(item.href));
  const isArticle = /^\/blog\/[^/]+\/?$/.test(page.route);
  const sectionAnchor = (index: number) => page.sections[index].anchor || `article-section-${index + 1}`;
  const sources = (page.article?.sources || []).filter((source) => knownPaths.has(source.href) || /^https:\/\//.test(source.href));
  return (
    <main className="editorial-page">
      <section className="ep-hero" aria-labelledby="ep-title">
        <div className="ep-wrap">
          <div className="ep-breadcrumb"><a href={withBasePath("/#hero")}>8 УГЛОВ</a><span aria-hidden="true">/</span><span>{page.category}</span></div>
          <div className="ep-hero-grid">
            <div className="ep-hero-copy">
              <p className="ep-kicker"><span>01 /</span> {page.category}</p>
              <h1 id="ep-title">{page.heading}</h1>
              <p className="ep-lead">{page.lead}</p>
              {page.verification && <dl className="ep-metadata" aria-label="Статус сведений">
                <div><dt>СТАТУС</dt><dd>{page.verification.status}</dd></div>
                <div><dt>ДАТА ПРОВЕРКИ</dt><dd>{page.verification.checkedAt ? <time dateTime={page.verification.checkedAt}>{calendarDate(page.verification.checkedAt)}</time> : "Не подтверждена"}</dd></div>
              </dl>}
              {isArticle && <dl className="ep-metadata" aria-label="Сведения о статье">
                <div><dt>ДАТА ПУБЛИКАЦИИ</dt><dd>{page.article?.publishedAt ? <time dateTime={page.article.publishedAt}>{calendarDate(page.article.publishedAt)}</time> : "Не предоставлена"}</dd></div>
                <div><dt>ДАТА ОБНОВЛЕНИЯ</dt><dd>{page.article?.updatedAt ? <time dateTime={page.article.updatedAt}>{calendarDate(page.article.updatedAt)}</time> : "Не предоставлена"}</dd></div>
                <div><dt>АВТОР</dt><dd>{page.article?.author ? <>{page.article.author.name}{page.article.author.qualification && <>, {page.article.author.qualification}</>}</> : "Не предоставлен"}</dd></div>
              </dl>}
              <div className="ep-hero-actions"><a className="ep-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">WHATSAPP <ArrowUpRight size={17} aria-hidden="true" /></a><a className="ep-text-link" href={TELEGRAM} target="_blank" rel="noopener noreferrer">TELEGRAM <ArrowUpRight size={16} aria-hidden="true" /></a><a className="ep-text-link" href="#page-content">ИЗУЧИТЬ ТЕМУ <ArrowDown size={16} aria-hidden="true" /></a></div>
            </div>
            <div className="ep-hero-art" aria-hidden="true">
              <div className="ep-art-top"><span>СИСТЕМА / 8 УГЛОВ</span><span>01 — 08</span></div>
              <div className="ep-art-orbit orbit-a" /><div className="ep-art-orbit orbit-b" /><div className="ep-art-orbit orbit-c" /><span className="ep-art-center">8</span><span className="ep-art-cross">+</span>
              <div className="ep-art-bottom"><span>ЛЮДИ · ПРОЦЕССЫ · ТЕХНОЛОГИИ</span><span>↗</span></div>
            </div>
          </div>
          <div className="ep-hero-bottom"><span>ПОНЯТНЫЙ СЛЕДУЮЩИЙ ШАГ</span><a href="#page-content">ПОДРОБНЕЕ <ArrowDown size={14} aria-hidden="true" /></a></div>
        </div>
      </section>
      {page.route === "/instrumenty/" && <CatalogPreview />}
      {isArticle && <nav className="ep-article-toc" aria-labelledby="article-toc-title"><div className="ep-wrap">
        <p className="ep-kicker"><span>↗ /</span> НАВИГАЦИЯ</p><h2 id="article-toc-title">Содержание</h2>
        <ol>{page.sections.map((section, index) => <li key={sectionAnchor(index)}><a href={`#${sectionAnchor(index)}`}>{section.title}</a></li>)}<li><a href="#article-sources">Источники</a></li>{page.faq.length > 0 && <li><a href="#article-faq">Вопросы и ответы</a></li>}</ol>
      </div></nav>}
      <div id="page-content">
        {page.sections.map((section, index) => {
          const cards = page.route === "/instrumenty/" ? section.cards?.filter((card) => !card.href || !catalogToolPaths.has(card.href)) : section.cards;
          return <section id={isArticle ? sectionAnchor(index) : undefined} className={`ep-section ep-variant-${section.variant || "plain"}`} key={`${section.title}-${index}`}>
            <div className="ep-wrap">
              <div className="ep-section-head"><p className="ep-kicker"><span>{String(index + 2).padStart(2, "0")} /</span> {section.eyebrow}</p><span className="ep-index">8 УГЛОВ / {String(index + 1).padStart(2, "0")}</span></div>
              <div className="ep-section-main"><h2>{section.title}</h2><div className="ep-copy">{section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div></div>
              {section.catalogCategory && <CategoryToolList category={section.catalogCategory} />}
              {cards && cards.length > 0 && <div className={`ep-cards ${section.variant === "steps" ? "ep-steps" : ""}`}>{cards.map((card, i) => <article className="ep-card" key={`${card.title}-${i}`}><div className="ep-card-index"><span>{card.label || String(i + 1).padStart(2, "0")}</span><span aria-hidden="true">{card.href ? "↗" : "·"}</span></div><h3>{card.title}</h3><p>{card.text}</p>{card.href && (knownPaths.has(card.href) || ["/llms.txt", "/llms-full.txt", "/skill.md", "/index.md"].includes(card.href) || /^(https:|tel:)/.test(card.href)) && <a className="ep-card-link" href={withBasePath(card.href)} target={card.href.startsWith("https:") ? "_blank" : undefined} rel={card.href.startsWith("https:") ? "noopener noreferrer" : undefined}>{card.href.startsWith("/") ? "ПОДРОБНЕЕ" : card.href.startsWith("tel:") ? "ПОЗВОНИТЬ" : /wa\.me|t\.me/.test(card.href) ? "СВЯЗАТЬСЯ" : "ОФИЦИАЛЬНЫЙ ИСТОЧНИК"} <ArrowUpRight size={14} aria-hidden="true" /></a>}</article>)}</div>}
            </div>
          </section>;
        })}
      </div>
      {isArticle && <section id="article-sources" className="ep-article-sources" aria-labelledby="article-sources-title"><div className="ep-wrap">
        <p className="ep-kicker"><span>↗ /</span> МАТЕРИАЛЫ</p><h2 id="article-sources-title">Источники</h2>
        {sources.length ? <ul>{sources.map((source) => <li key={`${source.href}-${source.title}`}><a href={withBasePath(source.href)} target={source.href.startsWith("https://") ? "_blank" : undefined} rel={source.href.startsWith("https://") ? "noopener noreferrer" : undefined}>{source.title}</a></li>)}</ul> : <p>Ссылки на источники не предоставлены. Перед публикацией материал и актуальность сведений необходимо проверить.</p>}
      </div></section>}
      {page.route === "/uslugi/amocrm-partner/" && <section className="ep-certificate"><div className="ep-wrap ep-certificate-grid"><div><p className="ep-kicker"><span>↗ /</span> ДОКУМЕНТ</p><h2>Сертификат <em>amoSTART.</em></h2><p>В предоставленном сертификате Руслан Лиферов указан как официальный партнёр программы amoSTART.</p><p>Это личный сертификат специалиста, а не подтверждение статуса компании. Перед публичным размещением необходимо проверить актуальность статуса и связь специалиста с «8 Углов».</p><a className="ep-text-link" href={CERTIFICATE} target="_blank" rel="noopener noreferrer">ОТКРЫТЬ В ПОЛНОМ РАЗМЕРЕ <ArrowUpRight size={16} aria-hidden="true" /></a></div><figure><a href={CERTIFICATE} target="_blank" rel="noopener noreferrer" aria-label="Открыть сертификат amoSTART на имя Руслана Лиферова в полном размере, в новой вкладке"><img src={CERTIFICATE} alt="Сертификат amoSTART на имя Руслана Лиферова" /></a><figcaption>ПЕРСОНАЛЬНЫЙ СЕРТИФИКАТ СПЕЦИАЛИСТА</figcaption></figure></div></section>}
      {page.faq.length > 0 && <section id={isArticle ? "article-faq" : undefined} className="ep-faq"><div className="ep-wrap ep-faq-grid"><div><p className="ep-kicker"><span>↗ /</span> ВОПРОСЫ И ОТВЕТЫ</p><h2>Проясним<br /><em>важное.</em></h2><p>Ответы на вопросы, которые полезно обсудить до начала работы.</p></div><div className="ep-faq-list">{page.faq.map((item) => <details key={item.question}><summary><span>{item.question}</span><Plus size={19} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></div></section>}
      {related.length > 0 && <section className="ep-related"><div className="ep-wrap"><p className="ep-kicker"><span>↗ /</span> ПО ТЕМЕ</p><h2>Продолжить <em>разговор.</em></h2><div className="ep-related-grid">{related.map(item => <a key={item.href} href={withBasePath(item.href)}><span>{item.label}</span><ArrowUpRight size={18} aria-hidden="true" /></a>)}</div></div></section>}
      <section className="ep-contact"><div className="ep-wrap ep-contact-grid"><div><p className="ep-kicker"><span>↗ /</span> СЛЕДУЮЩИЙ ШАГ</p><h2>Начнём с вашей <em>задачи.</em></h2></div><div><p>Расскажите, что происходит в вашем бизнесе и какой процесс вы хотите улучшить. Достаточно общего описания — без паролей и клиентских баз.</p><div className="ep-contact-actions"><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="ep-contact-button">WHATSAPP <ArrowUpRight size={18} aria-hidden="true" /></a><a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="ep-contact-button">TELEGRAM <ArrowUpRight size={18} aria-hidden="true" /></a></div><span>ВЫБЕРИТЕ МЕССЕНДЖЕР · БЕЗ АВТОМАТИЧЕСКОЙ ОТПРАВКИ</span></div></div></section>
    </main>
  );
}
