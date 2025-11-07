import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../api";
import "../styles/pages/AdminPage.css";
import { apiFetch } from "../api/ClientsApi";

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
  const [modalAction, setModalAction] = useState<
    "delete" | "makeAdmin" | "removeAdmin" | null
  >(null);

  const [notification, setNotification] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiFetch("/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("kunde inte hämta bokningar");
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const openModal = (
    id: string,
    action: "delete" | "makeAdmin" | "removeAdmin"
  ) => {
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
  };

  const confirmAction = async () => {
    if (!selectedUserId || !modalAction) return;

    try {
      let url = "";
      let method: "PUT" | "DELETE" = "PUT";

      switch (modalAction) {
        case "delete":
          url = `/admin/delete-user/${selectedUserId}`;
          method = "DELETE";
          break;
        case "makeAdmin":
          url = `/admin/make-admin/${selectedUserId}`;
          break;
        case "removeAdmin":
          url = `/admin/remove-admin/${selectedUserId}`;
          break;
      }

      const res = await apiFetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("åtgärden misslyckades");

      setUsers((prev) => {
        return prev
          .map((u) => {
            if (u._id !== selectedUserId) return u;
            if (modalAction === "delete") return null; //filter senare
            if (modalAction === "makeAdmin") return { ...u, role: "admin" };
            if (modalAction === "removeAdmin") return { ...u, role: "user" };
            return u;
          })
          .filter(Boolean) as User[];
      });

      if (modalAction === "delete") showNotification("Användare raderad");
      if (modalAction === "makeAdmin")
        showNotification("Användare är nu admin");
      if (modalAction === "removeAdmin")
        showNotification("Admin-roll borttagen");
    } catch (error) {
      console.error(error);
    } finally {
      closeModal();
    }
  };

  if (loading) return <p>Laddar användare...</p>;

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      {notification && <div className="notification">{notification}</div>}

      <div className="create-user-container">
        <h2>Skapa ny användare</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name");
            const email = formData.get("email");
            const password = formData.get("password");

            try {
              const res = await apiFetch(`/admin/users`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email, password }),
              });

              if (!res.ok) throw new Error("kunde inte skapa användare");
              const data = await res.json();

              setUsers((prev) => [...prev, data.user]);
              showNotification(`Användare ${data.user.name} skapades`);
              (e.target as HTMLFormElement).reset();
            } catch (err) {
              console.error(err);
              showNotification("fel vid skapande av användare");
            }
          }}
          className="create-user-form"
        >
          <input type="text" name="name" placeholder="Namnn" required></input>
          <input
            type="email"
            name="email"
            placeholder="E-post"
            required
          ></input>
          <input
            type="password"
            name="password"
            placeholder="Lösenord"
            required
          ></input>
          <button type="submit" className="btn btn-primary">
            Skapa
          </button>
        </form>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Sök efter användare..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="admin-table-wrapper">
        <h2>Användare</h2>
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
              users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td className="actions">
                    {u.role === "user" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => openModal(u._id, "makeAdmin")}
                      >
                        Gör till admin
                      </button>
                    )}
                    {u.role === "admin" && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => openModal(u._id, "removeAdmin")}
                      >
                        Ta bort admin roll
                      </button>
                    )}
                    <button
                      className="btn btn-danger"
                      onClick={() => openModal(u._id, "delete")}
                    >
                      Radera
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Bekräkta åtgärd</h2>
            <p>
              {modalAction === "delete" &&
                "Är du säker på att du vill radera användaren?"}
              {modalAction === "makeAdmin" &&
                "Vill du göra denna användare till admin?"}
              {modalAction === "removeAdmin" &&
                "Vill du ta bort admin-roll från användaren?"}
            </p>
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={confirmAction}>
                Ja
              </button>
              <button className="btn btn-secondary" onClick={closeModal}>
                Nej
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-bookings-section">
        <h2>Alla bokningar</h2>
        {bookingsLoading ? (
          <p>Laddar bokningar...</p>
        ) : bookings.length === 0 ? (
          <p>Inga bokningar hittades</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Användare</th>
                <th>Tjänst</th>
                <th>Datum</th>
                <th>Status</th>
                <th>Anteckningar</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.user?.name || "okänd"}</td>
                  <td>{b.service?.name || "okänd"}</td>
                  <td>{new Date(b.date).toLocaleString("sv-SE")}</td>
                  <td>
                    <select
                      value={b.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          const res = await apiFetch(`/admin/bookings/${b._id}/status`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ status: newStatus }),
                          });

                          if (!res.ok) throw new Error("kunde inte uppdatera status");
                          const data = await res.json();

                          // uppdatera state lokalt så ändringen syns direkt
                          setBookings((prev) => 
                            prev.map((bk) =>
                          bk._id === b._id ? data.booking : bk
                        )
                      );
                        } catch (err) {
                          console.error(err);
                          alert("kunde inte ändra status");
                        }
                      }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        </select>
                  </td>
                  <td>{b.notes || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
