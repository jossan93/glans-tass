import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 900);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  //stänger menyn vid klick utanför eller Escape
  useEffect(() => {
    if (!isMobile) return; //endast för skärmar míndre än 900

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, isMobile]);

  return (
    <>
      {menuOpen && isMobile && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>
      )}

      <nav className="navbar" ref={menuRef}>
        <div className="navbar-header">
          <h1 className="navbar-title">Glans & Tass</h1>

          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Öppna meny"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div
          className={`navbar-links ${
            isMobile ? (menuOpen ? "active" : "fade-out") : ""
          }`}
        >
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Start
          </Link>
          <Link to="/service" onClick={() => setMenuOpen(false)}>
            Tjänster & Priser
          </Link>
          <Link to="/booking" onClick={() => setMenuOpen(false)}>
            Bokning
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            Om oss
          </Link>

          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                Profil
              </Link>

              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Logga ut
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Logga in
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Registera
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
