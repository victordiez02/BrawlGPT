import { Link } from "react-router-dom";

const Header = () => (
  <header className="relative z-10 mx-auto mb-6 mt-6 flex w-full max-w-6xl items-center justify-center px-4">
    <Link
      to="/"
      className="group inline-flex items-center justify-center transition-transform hover:-translate-y-0.5"
      aria-label="BrawlGPT — Inicio"
    >
      <img
        src="/resources/Logo.png"
        alt="BrawlGPT"
        className="drop-bs h-16 w-auto sm:h-20 md:h-24"
      />
    </Link>
  </header>
);

export default Header;
