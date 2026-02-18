import { Link } from "react-router-dom";
import logo from "../../logo.svg";

export default function AuthShell({ title, navLinks, children }) {
  return (
    <>
      <header>
        <div className="header-container">
          <div className="logo-section">
            <img src={logo} alt="Logo Mercapleno" className="logo-img" />
            <h1 className="portal-title">Portal 2</h1>
          </div>

          <nav className="nav-links">
            {navLinks.map((item) => (
              <Link key={item.to} to={item.to} className="nav-btn">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <div className="form-container">
          <h2>{title}</h2>
          {children}
        </div>
      </main>
    </>
  );
}
