const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

// hämta alla användare
export async function getAllUsers() {
    const res = await fetch(`${API_URL}/admin/users`, {
        headers: getAuthHeaders(),
    });
    if(!res.ok) throw new Error("kunde inte hämta users");
    return res.json();
}

// gör användare till admin
export async function makeAdmin(userId: string) {
    const res = await fetch(`${API_URL}/admin/make-admin/${userId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
    });
    if(!res.ok) throw new Error("kunde inte göra användare till admin");
    return res.json();
}

// ta bort adminroll
export async function removeAdmin(userId: string) {
    const res = await fetch(`${API_URL}/admin/remove-admin/${userId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
    });
    if(!res.ok) throw new Error("kunde inte göra användare till user/ta bort admin");
    return res.json();
}

// ta bort användare
export async function deleteUser(userId: string) {
    const res = await fetch(`${API_URL}/admin/delete-user/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if(!res.ok) throw new Error("kunde inte ta bort användare");
    return res.json();
}
