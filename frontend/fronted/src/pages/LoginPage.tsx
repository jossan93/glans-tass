import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "../styles/pages/LoginPage.css"

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

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

                <button type="submit" className="btn-secondary">Logga in

                </button>
            </form>
        </div>
    );
}
