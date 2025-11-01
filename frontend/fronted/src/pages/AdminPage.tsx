import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../api";
import apiUrl from "../config";
import "../styles/pages/AdminPage.css";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}

export default function AdminPage() {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<"delete" | "makeAdmin" | "removeAdmin" | null>(null);

    const [notification, setNotification] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 600);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await getAllUsers(debouncedSearch);
                setUsers(data);
            } catch (error) {
                console.error("kunde inte hämta användare:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [debouncedSearch]);

    const openModal = (id: string, action: "delete" | "makeAdmin" | "removeAdmin") => {
        setSelectedUserId(id);
        setModalAction(action);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUserId(null);
        setModalAction(null);
        setModalOpen(false);
    };

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    }

    const confirmAction = async () => {
        if (!selectedUserId || !modalAction) return;

        try {
            let url = "";
            let method: "PUT" | "DELETE" = "PUT";

            switch (modalAction) {
                case "delete":
                    url = `${apiUrl}/admin/delete-user/${selectedUserId}`;
                    method = "DELETE";
                    break;
                case "makeAdmin":
                    url = `${apiUrl}/admin/make-admin/${selectedUserId}`;
                    break;
                case "removeAdmin":
                    url = `${apiUrl}/admin/remove-admin/${selectedUserId}`;
                    break;
            }

            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("åtgärden misslyckades");

            setUsers(prev => {
                return prev.map(u => {
                    if (u._id !== selectedUserId) return u;
                    if (modalAction === "delete") return null; //filter senare
                    if (modalAction === "makeAdmin") return { ...u, role: "admin" }
                    if (modalAction === "removeAdmin") return { ...u, role: "user" }
                    return u;
                }).filter(Boolean) as User[];
            });

            if (modalAction === "delete") showNotification("Användare raderad")
            if (modalAction === "makeAdmin") showNotification("Användare är nu admin")
            if (modalAction === "removeAdmin") showNotification("Admin-roll borttagen")
        } catch (error) {
            console.error(error);
        } finally {
            closeModal();
        }
    };

    if (loading) return <p>Laddar användare...</p>

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>

            {notification && <div className="notification">{notification}</div>}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Sök efter användare..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Namn</th>
                        <th>Email</th>
                        <th>Roll</th>
                        <th>Åtgärder</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={4}>Inga användare hittades</td>
                        </tr>
                    ) : (
                        users.map(u => (
                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                                <td className="actions">
                                    {u.role === "user" && (
                                        <button className="btn btn-primary" onClick={() => openModal(u._id, "makeAdmin")}>Gör till admin</button>
                                    )}
                                    {u.role === "admin" && (
                                        <button className="btn btn-secondary" onClick={() => openModal(u._id, "removeAdmin")}>Ta bort admin roll</button>
                                    )}
                                    <button className="btn btn-danger" onClick={() => openModal(u._id, "delete")}>Radera</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Bekräkta åtgärd</h2>
                        <p>
                            {modalAction === "delete" && "Är du säker på att du vill radera användaren?"}
                            {modalAction === "makeAdmin" && "Vill du göra denna användare till admin?"}
                            {modalAction === "removeAdmin" && "Vill du ta bort admin-roll från användaren?"}
                        </p>
                        <div className="modal-buttons">
                            <button className="btn btn-primary" onClick={confirmAction}>Ja</button>
                            <button className="btn btn-secondary" onClick={closeModal}>Nej</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
