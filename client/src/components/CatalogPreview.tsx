import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { categories, tools } from "../catalogData";
import { withBasePath } from "../basePath";
import "./CatalogPreview.css";

const normalize = (value: string) => value.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").trim();

export function CategoryToolList({ category }: { category: string }) {
  const [query, setQuery] = useState("");
  const search = normalize(query);
  const matches = tools.filter((tool) => tool.category === category && normalize(`${tool.name} ${tool.purpose}`).includes(search));

  return <div className="catalog-products catalog-category-tools">
    <div className="catalog-filters" role="search" aria-label="Поиск в категории инструментов">
      <div className="catalog-field">
        <label htmlFor="catalog-category-search">Поиск в этой категории</label>
        <input id="catalog-category-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Название или задача" />
      </div>
      <button className="catalog-reset" type="button" onClick={() => setQuery("")} disabled={!query}>Сбросить поиск</button>
    </div>
    <p className="catalog-result-count" role="status" aria-live="polite" aria-atomic="true">Найдено инструментов: {matches.length}</p>
    {matches.length > 0 ? <div className="catalog-results">{matches.map((tool) => <a key={tool.slug} href={withBasePath(`/instrumenty/${tool.slug}/`)}><span><strong>{tool.name}</strong><small>{tool.purpose}</small></span><ArrowUpRight size={17} aria-hidden="true" /></a>)}</div> : <p className="catalog-empty">По вашему запросу инструментов не найдено. Измените или сбросьте поиск.</p>}
  </div>;
}

export default function CatalogPreview() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const search = normalize(query);
  const matches = tools.filter((tool) => {
    const group = categories.find((item) => item.slug === tool.category);
    const searchable = normalize([tool.name, tool.purpose, group?.title || ""].join(" "));
    return (category === "all" || tool.category === category) && searchable.includes(search);
  });

  return (
    <section className="catalog-preview" aria-labelledby="catalog-preview-title">
      <div className="ep-wrap">
        <div className="catalog-heading">
          <div><p className="ep-kicker"><span>↗ /</span> КАТАЛОГ</p><h2 id="catalog-preview-title">Начните с <em>задачи.</em></h2></div>
          <p>Предварительная подборка по предоставленным материалам. Состав и условия нужно согласовать; перед выбором проверяйте актуальную информацию у поставщика.</p>
        </div>
        <nav className="catalog-list" aria-label="Категории каталога">
          {categories.map((item) => (
            <a key={item.slug} href={withBasePath(`/instrumenty/kategorii/${item.slug}/`)}>
              <span><small>КАТЕГОРИЯ</small><strong>{item.title}</strong><i>{item.lead}</i></span>
              <ArrowUpRight size={19} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div className="catalog-products">
          <p className="ep-kicker"><span>↗ /</span> ПРИМЕРЫ ИНСТРУМЕНТОВ</p>
          <div className="catalog-filters" role="search" aria-label="Поиск по каталогу инструментов">
            <div className="catalog-field">
              <label htmlFor="catalog-search">Поиск по названию или задаче</label>
              <input id="catalog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Например, CRM или аналитика" />
            </div>
            <div className="catalog-field">
              <label htmlFor="catalog-category">Категория</label>
              <select id="catalog-category" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">Все категории</option>
                {categories.map((item) => <option value={item.slug} key={item.slug}>{item.title}</option>)}
              </select>
            </div>
            <button className="catalog-reset" type="button" onClick={() => { setQuery(""); setCategory("all"); }} disabled={!query && category === "all"}>Сбросить фильтры</button>
          </div>
          <p className="catalog-result-count" role="status" aria-live="polite" aria-atomic="true">Найдено инструментов: {matches.length}</p>
          {matches.length > 0 ? (
            <div className="catalog-results">
              {matches.map((tool) => (
                <a key={tool.slug} href={withBasePath(`/instrumenty/${tool.slug}/`)}>
                  <span><strong>{tool.name}</strong><small>{categories.find((item) => item.slug === tool.category)?.title}</small><small>{tool.purpose}</small></span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : <p className="catalog-empty">По вашему запросу инструментов не найдено. Измените запрос или сбросьте фильтры.</p>}
          <small>Это не рейтинг; реферальные адреса не предоставлены.</small>
        </div>
      </div>
    </section>
  );
}
