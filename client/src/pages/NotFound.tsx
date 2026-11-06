import { withBasePath } from "../basePath";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found-inner">
        <p className="eyebrow"><span className="eyebrow-mark">////</span> 8 УГЛОВ / 404</p>
        <h1>Такой страницы<br /><span>пока нет.</span></h1>
        <p>Возможно, адрес изменился или страница ещё не готова. Вернитесь на главную и выберите нужный раздел.</p>
        <a className="primary-button" href={withBasePath("/#hero")}>НА ГЛАВНУЮ <span aria-hidden="true">↗</span></a>
      </div>
    </main>
  );
}
