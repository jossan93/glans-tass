const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}
export const userApi = {
    async register(name: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name ,email, password }),
    });
    if (!res.ok) throw new Error("registation misslyckades");
    return res.json();
},

    async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("login misslyckades");
    const data = await res.json();
    // spara token o localstorage
    localStorage.setItem("token", data.token);
    return data;
},

logout() {
    // ta bort token
    localStorage.removeItem("token");
},

async getProfile() {
    const res = await fetch(`${API_URL}/users/profile`, {
        headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("kunde inte hämta profil sida");
    return res.json();
},
};
/*
export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
}) {
    const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("registration misslyckades");
    return res.json();
}

export async function loginUser(email: string, password: string) {
    const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("login misslyckades");
    return res.json();
} */
