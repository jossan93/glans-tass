import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/pages/LoginPage.css";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // vänta lite så att sidan hinner rendera först
    const timer = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      if (params.get("sessionExpired") === "true") {
        setMessage("Session har gått ut, logga in igen.");

        // ta bort parametern från urel:en efter att vi visat medelandet
        params.delete("sessionExpired");
        window.history.replaceState({}, "", `${location.pathname}`);

        // dölj medelandet automatiskt efter 5sekunder
        setTimeout(() => setMessage(""), 5000);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/profile");
    } catch (err) {
      console.error("login misslyckades", err);
      alert("fell e-post eller lösenord");
    }
  };

  return (
    <div className="login-container">
      <h2>Logga in</h2>

      {message && <div className="session-expired-message">{message}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <label>
          E-post:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Lösenord:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn-secondary">
          Logga in
        </button>
      </form>
    </div>
  );
}
