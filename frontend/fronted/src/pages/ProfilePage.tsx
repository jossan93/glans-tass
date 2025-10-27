import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"
import "../styles/pages/ProfilePage.css"
import apiUrl from "../config";

interface Booking {
    _id: string;
    date: string;
    status: string;
    notes?: string;
    service: {
        _id: string;
        name: string;
        price: number;
        duration: number;
    };
}

export default function ProfilePage() {
    const { user, token } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch(`${apiUrl}/booking`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setBookings(data);
            } catch (error) {
                console.error("kunde inte hämta bokningar", error);
            } finally {
                setLoading(false)
            }
        };

        fetchBookings();
    }, [token]);

    const handleCancel = async (id: string) => {
        if (!window.confirm("Är du säker på att du vill avboka?")) return;

        try {
            const res = await fetch(`${apiUrl}/booking/${id}`, {
                method: "DELETE",
                headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            if (res.ok) {
                setBookings((prev) => prev.filter((b) => b._id !== id));
                setMessage(" Bokningen har avbokats");
                setTimeout(() => setMessage(null), 3000);
            } else {
                console.error("misslyckades att avboka");
            }
        } catch (error) {
            console.error("fell vid avbokning:", error);
        }
    };

    const handleView = (booking: Booking) => {
        alert(
            `Tjänst: ${booking.service.name}\Pris: ${booking.service.price} kr\nTid: ${new Date(
                booking.date
            ).toLocaleString()}\nStatus: ${booking.status}\nAnteckningar: ${booking.notes || "inga" }`
        );
    };

    return (
        <div className="profile-container">
            <h1>Din Profil</h1>
            
            <div className="profile-card">
                <p>Namn: {user}</p>
                
            </div>

            <h2>Mina bokningar</h2>
            {message && <p className="success-message">{message}</p>}

            {loading ? (
                <p>Laddar bokningar...</p>
            ) : bookings.length === 0 ? (
                <p>Du har inga bokningar ännu.</p>
            ) : (
                <ul className="booking-list">
                    {bookings.map((b) => (
                        <li key={b._id} className="booking-item">
                            <div className="booking-info">
                            <h3>{b.service.name}</h3>
                            <p>
                                {new Date(b.date).toLocaleString()} -{" "}
                                <span className={`status ${b.status}`}>
                                Status: {b.status}   
                                </span>                             
                            </p>
                        </div>
                        <div className="booking-actions">
                            <button className="view-btn" onClick={() => handleView(b)}>

                                Visa
                            </button>
                            <button className="cancel-btn" onClick={() => handleCancel(b._id)}>
                           
                                Avboka
                            </button>
                        </div>
                        </li>
                    ))}
                </ul>
            )}           
        </div>

    );
}

