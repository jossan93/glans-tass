import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api";
import "../styles/pages/RegisterPage.css"

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await userApi.register(name, email, password);
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError("registering misslyckades")
        }
    };

    return (
        <div className="register-container">
            <h2>Registera dig här</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <label>
                    Namn:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>

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

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" className="btn-secondary">Skapa konto</button>
            </form>
        </div>
    );
}