import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { userApi } from "../api/userApi";

interface AuthContextType {
    user: string | null;
    token: string | null;
    login: (token: string, user: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: {children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }

        setLoading(false);

    }, []);

    const login = async (email: string, password: string) => {
        const data = await userApi.login(email, password);

        // api bör returnera {token, user: {name, email } }
        const username = data.user?.name || data.user?.email || "användare"
        setToken(data.token);
        setUser(username);
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", username);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        userApi.logout();
    };

    if (loading) {
        return <div>laddar...</div>
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth måste anvädas inom AuthProvider");
    return context;
}
