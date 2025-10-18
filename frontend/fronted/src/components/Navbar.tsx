import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }
    
    return (
        <nav className="navbar">
            <h1 className="navbar-logo">Glans & Tass</h1>
            <div className="navbar-links">
                <Link to="/">Start</Link>
                <Link to="/booking">Booking</Link>
                <Link to="/about">Om oss</Link>
                {user ? (
                    <>
                    <Link to="/profile">Profil</Link>
                    <button onClick={handleLogout} className="logout-btn">
                        logga ut
                    </button>
                    </>
                ) : (
                    <Link to="/login">Logga in</Link>
                )}
                
            </div>
        </nav>
    );
}
