import { apiFetch } from "./clientsApi";

export const userApi = {
  async register(name: string, email: string, password: string) {
    const res = await apiFetch("/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) throw new Error("registation misslyckades");
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await apiFetch(`/users/login`, {
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
    const res = await apiFetch("/users/profile");
    if (!res.ok) throw new Error("kunde inte hämta profil sida");
    return res.json();
  },
};

/*
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}*/
/*
export const userApi = {
  async register(name: string, email: string, password: string) {
    const res = await fetch(`/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("registation misslyckades");
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(`/users/login`, {
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
    const res = await fetch(`/users/profile`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("kunde inte hämta profil sida");
    return res.json();
  },
};
*/
