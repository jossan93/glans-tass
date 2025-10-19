import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css"

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }
    
    return (
        <nav className="navbar">
            <h1 className="navbar-title">Glans & Tass</h1>
            <div className="navbar-links">
                <Link to="/">Start</Link>
                <Link to="/booking">Bokning</Link>
                <Link to="/about">Om oss</Link>
                {user ? (
                    <>
                    <Link to="/profile">Profil</Link>
                    <button onClick={handleLogout} className="logout-btn">
                        logga ut
                    </button>
                    </>
                ) : (
                    <>
                    <Link to="/login">Logga in</Link>
                    <Link to="/register">Registera</Link>
                    </>
                )}
                
            </div>
        </nav>
    );
}
