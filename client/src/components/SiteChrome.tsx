import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { knownPaths } from "../editorialRegistry";
import { withBasePath, withoutBasePath } from "../basePath";
import "./SiteChrome.css";

const whatsapp = "https://wa.me/79642388885";
const navigation = [
  { label: "Услуги", href: "/uslugi/" },
  { label: "Для бизнеса", href: "/lokalnyy-biznes/" },
  { label: "Кейсы", href: "/kejsy/" },
  { label: "Блог", href: "/blog/" },
  { label: "Инструменты", href: "/instrumenty/" },
  { label: "О компании", href: "/o-kompanii/" },
  { label: "Контакты", href: "/kontakty/" },
].filter(item => knownPaths.has(item.href));

function Brand() {
  return (
    <a className="brand" href={withBasePath("/#hero")} aria-label="8 Углов — на главную">
      <span className="brand-symbol" aria-hidden="true"><i>8</i></span>
      <span className="brand-name">8 УГЛОВ<span>СИСТЕМА ДЛЯ БИЗНЕСА</span></span>
    </a>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);
  const currentPath = withoutBasePath(window.location.pathname).replace(/\/$/, "");
  return (
    <header className="site-header" id="top">
      <div className="header-inner">
        <Brand />
        <nav className="site-desktop-nav" aria-label="Основная навигация">
          {navigation.map(item => <a key={item.href} href={withBasePath(item.href)} aria-current={currentPath === item.href.replace(/\/$/, "") ? "page" : undefined}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <a className="phone" href="tel:+79642388885">+7 964 238-88-85</a>
          <a className="header-contact" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Обсудить задачу в WhatsApp, откроется новая вкладка"><span className="header-contact-label">ОБСУДИТЬ ЗАДАЧУ</span><ArrowUpRight size={15} /></a>
          <button className="site-menu-button" ref={menuButton} type="button" aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      <nav id="mobile-navigation" className="site-mobile-nav" aria-label="Мобильная навигация" hidden={!open}>
        <a href={withBasePath("/#hero")} onClick={() => setOpen(false)}>Главная <span>↗</span></a>
        {navigation.map(item => <a key={item.href} href={withBasePath(item.href)} onClick={() => setOpen(false)} aria-current={currentPath === item.href.replace(/\/$/, "") ? "page" : undefined}>{item.label}<span>↗</span></a>)}
        <a href={withBasePath("/#approach")} onClick={() => setOpen(false)}>Наш подход <span>↗</span></a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer" id="contacts">
      <div className="site-footer-inner">
        <div className="site-footer-topline"><span>8 УГЛОВ / СИСТЕМА</span><a href="#top">НАВЕРХ <span aria-hidden="true">↗</span></a></div>
        <div className="site-footer-main">
          <div className="site-footer-intro"><Brand /><p>Связываем привлечение, CRM и работу команды — от первого обращения до повторной покупки.</p></div>
          <div className="site-footer-column"><span>НАВИГАЦИЯ</span><a href={withBasePath("/#hero")}>Главная</a>{navigation.map(item => <a key={item.href} href={withBasePath(item.href)}>{item.label}</a>)}</div>
          <div className="site-footer-column"><span>КОНТАКТЫ</span><a href="tel:+79642388885">+7 964 238-88-85</a><a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><a href="https://t.me/+79642388885" target="_blank" rel="noopener noreferrer">Telegram по номеру ↗</a><small>Доступность Telegram зависит от настроек приватности номера.</small></div>
        </div>
        <div className="site-footer-entity">ИП Лиферов Руслан Игоревич · ИНН 490912254667 · ОГРНИП 320784700053687</div>
        <div className="site-footer-legal">{[{label:"Партнёрам",href:"/partnery/"},{label:"Партнёрские инструменты",href:"/partnerskie-instrumenty/"},{label:"Для AI-агентов",href:"/agents/"},{label:"Политика (проект)",href:"/privacy/"},{label:"Согласие (проект)",href:"/consent/"},{label:"Условия (проект)",href:"/terms/"}].filter(item => knownPaths.has(item.href)).map(item => <a href={withBasePath(item.href)} key={item.href}>{item.label}</a>)}</div>
        <div className="site-footer-bottom"><span>© 8 УГЛОВ</span><span>ТЕХНОЛОГИИ. ЛЮДИ. ПРОЦЕССЫ.</span></div>
      </div>
    </footer>
  );
}
