export function Footer() {
  return (
    <footer className="px-6 py-10 mt-10 border-t border-white/10 text-sm text-white/50 flex flex-col gap-2 items-center text-center">
      <p>
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a className="underline" href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
          TMDB
        </a>
        . Watch provider data by{" "}
        <a className="underline" href="https://www.justwatch.com" target="_blank" rel="noreferrer">
          JustWatch
        </a>
        .
      </p>
    </footer>
  );
}
