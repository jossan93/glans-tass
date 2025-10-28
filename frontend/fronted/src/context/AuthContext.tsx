import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { userApi } from "../api/userApi";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: {children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

 /*       if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser) as User);
            } catch (e) {
                console.error("fel vid läsning av user från localStorage", e);
                setUser(null)
            }
            
        } */
        
            if (storedToken && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser) as User;
                    setUser(parsedUser);
                    setToken(storedToken);
                } catch (err) {
                    console.error("fle vid läsning av user från localstorage:", err)
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                }
            }

        setLoading(false);

    }, []);

    const login = async (email: string, password: string) => {
        const data = await userApi.login(email, password);

        if (!data.user || !data.token) {
            throw new Error("ogilitigt login svar från API")
        }

        // api bör returnera {token, user: {name, email } }
      //  const username = data.user?.name || data.user?.email || "användare"
        setToken(data.token);
        setUser(data.user);
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
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
    if (!context) throw new Error("useAuth måste anvädnas inom AuthProvider");
    return context;
}
