import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { steps } from "./content";
import { mascotForStep, PORTRAIT } from "./media";
import About from "./pages/About";
import HomeSections from "./pages/HomeSections";
import { Header, Footer } from "./components/SiteChrome";
import EditorialPage from "./components/EditorialPage";
import NotFound from "./pages/NotFound";
import { editorialEntries, knownPaths } from "./editorialRegistry";
import { catalogPageForPath } from "./catalogData";
import { withBasePath, withoutBasePath } from "./basePath";

const ShipScene = lazy(() => import("./components/ShipScene"));
const WHATSAPP = "https://wa.me/79642388885";
const editorialComponents = Object.fromEntries(Object.entries(editorialEntries).map(([path, entry]) => [path, lazy(async () => {
  const page = await entry.load();
  return { default: () => <EditorialPage page={page} knownPaths={knownPaths} /> };
})]));

function StaticShip() {
  return <div className="static-ship" aria-label="Собранная непрозрачная модель корабля"><span className="static-antenna" /><span className="static-dome" /><span className="static-disc" /><span className="static-base" /></div>;
}

function needsStaticView() {
  if (window.matchMedia("(prefers-reduced-motion: reduce), (max-height: 650px)").matches) return true;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const available = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return !available;
  } catch { return true; }
}

function useReducedOrNoWebGL() {
  const [fallback, setFallback] = useState(needsStaticView);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce), (max-height: 650px)");
    const update = () => setFallback(needsStaticView());
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return fallback;
}

function VisualShip({ fallback, progress, onFailure }: { fallback: boolean; progress: number; onFailure: () => void }) {
  return fallback ? <StaticShip /> : <Suspense fallback={<StaticShip />}><ShipScene progress={progress} onFailure={onFailure} /></Suspense>;
}

function Hero({ fallback, onFailure }: { fallback: boolean; onFailure: () => void }) {
  return (
    <section className="hero" id="hero" tabIndex={-1} aria-labelledby="hero-title">
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-mark">////</span> ТЕХНОЛОГИЧЕСКИЙ ПАРТНЁР БИЗНЕСА</div>
          <h1 id="hero-title">ОТ ПЕРВОГО<br />ОБРАЩЕНИЯ <span>— ДО ПОВТОРНОЙ ПОКУПКИ.</span></h1>
          <p className="hero-lead">Связываем привлечение, CRM и работу команды — от обращения до визита, продажи и повторной покупки.</p>
          <div className="hero-actions">
            <a className="primary-button" href={WHATSAPP} target="_blank" rel="noreferrer">WHATSAPP <ArrowUpRight size={18} /></a>
            <a className="text-link" href="https://t.me/+79642388885" target="_blank" rel="noopener noreferrer">TELEGRAM <ArrowUpRight size={17} /></a>
            <a className="text-link" href={withBasePath("/o-kompanii/")}>О КОМПАНИИ <ArrowRight size={17} /></a>
          </div>
          <div className="hero-bottom"><span className="hero-bottom-number">08</span><span>ПЕРЕХОДОВ<br /><b>ОДНА СИСТЕМА</b></span><span className="hero-bottom-line" /><span>ОТ ИНТЕРЕСА<br />ДО ВОЗВРАЩЕНИЯ</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-frame-corner corner-a" /><div className="hero-frame-corner corner-b" />
          <img className="hero-portrait" src={PORTRAIT} alt="Портрет из предоставленных материалов" />
          <div className="hero-visual-label"><span>ЛЮДИ И ТЕХНОЛОГИИ</span><span>01 — 08</span></div>
          <div className="hero-orbit" />
          <div className="hero-ship"><VisualShip fallback={fallback} progress={0} onFailure={onFailure} /></div>
          <div className="hero-visual-bottom"><span><i /> 8 УГЛОВ / СИСТЕМА</span><span>ОТ СИГНАЛА<br />К ВОЗВРАТУ ↗</span></div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const introRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [sceneFailed, setSceneFailed] = useState(false);
  const staticView = useReducedOrNoWebGL();
  const fallback = staticView || sceneFailed;
  const active = Math.min(7, Math.floor(progress * 8));
  const current = steps[active];

  useEffect(() => {
    if (withoutBasePath(window.location.pathname) === "/" && window.location.hash) {
      const anchor = decodeURIComponent(window.location.hash.slice(1));
      requestAnimationFrame(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "instant", block: "start" });
      });
    }
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = introRef.current;
      if (!el || fallback) return;
      const distance = el.offsetHeight - window.innerHeight;
      setProgress(Math.max(0, Math.min(1, (window.scrollY - el.offsetTop) / Math.max(1, distance))));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); if (frame) cancelAnimationFrame(frame); };
  }, [fallback]);

  const skip = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const hero = document.getElementById("hero");
    history.replaceState(null, "", "#hero");
    hero?.scrollIntoView({ behavior: "instant", block: "start" });
    hero?.focus({ preventScroll: true });
  };
  const goToStep = (index: number) => {
    const el = introRef.current;
    if (!el) return;
    const distance = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (distance * (index === 0 ? 0 : (index + 0.12) / 8)), behavior: "instant" });
  };

  return (
    <div className={`site-shell ${new URLSearchParams(window.location.search).get("preview") === "hero" ? "preview-hero" : ""}`}>
      <Header />
      <main>
        <section className={`intro ${fallback ? "intro-fallback" : ""}`} id="intro" ref={introRef} aria-label="Восемь переходов: интро">
          <div className="intro-sticky">
            <div className="intro-topline"><span><i /> МАРШРУТ КЛИЕНТА</span><span>8 УГЛОВ / 01—08</span></div>
            <div className="intro-grid">
              <div className="intro-copy">
                <div className="eyebrow"><span className="eyebrow-mark">////</span> ВОСЕМЬ ПЕРЕХОДОВ. ОДНА СИСТЕМА.</div>
                <span className="sr-only" aria-live="polite" aria-atomic="true">Переход {active + 1} из 8. {current.part}. {current.title}. {current.text}</span>
                <h2>{current.title}<span className="pink-dot">.</span></h2>
                <div className="intro-description"><span className="intro-description-rule" /><p>{current.text}</p></div>
                <a className="skip-link" href="#hero" onClick={skip}>ПРОПУСТИТЬ ИНТРО <ArrowUpRight size={17} /></a>
              </div>
              <div className="intro-art" aria-hidden="true">
                <div className="orbit orbit-one" /><div className="orbit orbit-two" />
                <div className="art-index"><span>ЭЛЕМЕНТ СИСТЕМЫ</span><b>{String(active + 1).padStart(2, "0")}</b></div>
                <div className="ship-wrap"><VisualShip fallback={fallback} progress={progress} onFailure={() => setSceneFailed(true)} /></div>
                <img className="intro-mascot" src={mascotForStep(active, progress)} alt="" />
                <div className="art-part"><span>↗</span> {current.part}</div>
                <span className="art-cross cross-top">+</span><span className="art-cross cross-bottom">+</span>
              </div>
            </div>
            {fallback ? (
              <div className="fallback-steps">{steps.map((step, index) => <div key={step.part}><span>{String(index + 1).padStart(2, "0")}</span><p><b>{step.part} / {step.title}</b><br />{step.text}</p></div>)}</div>
            ) : (
              <div className="intro-bottom">
                <div className="progress-steps" aria-label="Переходы интро">{steps.map((step, index) => <button key={step.part} className={index === active ? "active" : ""} onClick={() => goToStep(index)} aria-label={`Переход ${index + 1}: ${step.title}`} aria-current={index === active ? "step" : undefined}><span className="progress-track" /><span>{String(index + 1).padStart(2, "0")}</span><b>{step.short}</b></button>)}</div>
                <div className="scroll-hint"><span>ЛИСТАЙТЕ, ЧТОБЫ УВИДЕТЬ<br />КАК ВСЁ СВЯЗАНО</span><ArrowDown size={18} /></div>
              </div>
            )}
          </div>
        </section>
        <Hero fallback={fallback} onFailure={() => setSceneFailed(true)} />
        <HomeSections />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const path = withoutBasePath(window.location.pathname).replace(/\/$/, "");
  if (!path) return <HomePage />;
  if (path === "/o-kompanii") return <div className="site-shell"><Header /><About /><Footer /></div>;
  const page = catalogPageForPath(path);
  if (page) return <div className="site-shell"><Header /><EditorialPage page={page} knownPaths={knownPaths} /><Footer /></div>;
  const Page = editorialComponents[path];
  if (Page) return <div className="site-shell"><Header /><Suspense fallback={<main className="site-loading" aria-live="polite">Загружаем страницу…</main>}><Page /></Suspense><Footer /></div>;
  return <div className="site-shell"><Header /><NotFound /><Footer /></div>;
}

export default App;
