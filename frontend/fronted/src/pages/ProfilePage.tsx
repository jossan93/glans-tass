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
   // const [message, setMessage] = useState<string | null>(null);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
 //   const [cancelModalOpen, setCancelModalOpen] = useState(false);

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

    /*
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
    };*/

    // öppna modal för visa bokninig
    const handleView = (id: string) => {
        setSelectedBookingId(id);
        setModalOpen(true);
    };

    //avbokning
    const openCancelModal = (id: string) => {
        setSelectedBookingId(id);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedBookingId(null);
        setModalOpen(false);
    };

    //bekräkta avbokning
    const confirmCancel = async () => {
        if (!selectedBookingId) return;

        try {
                const res = await fetch(`${apiUrl}/booking/${selectedBookingId}`, {
                method: "DELETE",
                headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            if (res.ok) {
                setBookings(prev => prev.filter(b => b._id !== selectedBookingId));
            } else {
                console.error("misslyckades att avboka");
            }
        } catch (error) {
            console.error("fel vid avbokning:", error);
        } finally {
            closeModal();
        }
    };

    //hita vald bokning för modal visning
    const selectedBooking = bookings.find(b => b._id === selectedBookingId)
/*
    const handleView = (booking: Booking) => {
        alert(
            `Tjänst: ${booking.service.name}\Pris: ${booking.service.price} kr\nTid: ${new Date(
                booking.date
            ).toLocaleString()}\nStatus: ${booking.status}\nAnteckningar: ${booking.notes || "inga" }`
        );
    }; */

    return (
        <div className="profile-container">
            <h1>Din Profil</h1>
            
            <div className="profile-card">
                <p>Namn: {user?.name}</p>
                
            </div>

            <h2>Mina bokningar</h2>
            
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
                            <button className="view-btn" onClick={() => handleView(b._id)}>Visa</button>
                            <button className="cancel-btn" onClick={() => openCancelModal(b._id)}>Avboka</button>
                        </div>
                        </li>
                    ))}
                </ul>
            )}

            {modalOpen && selectedBooking && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedBooking.service.name}</h2>
                        <p>Pris: {selectedBooking.service.price} kr</p>
                        <p>Tid: {new Date(selectedBooking.date).toLocaleString()}</p>
                        <p>Status: {selectedBooking.status}</p>
                        <p>Anteckningar: {selectedBooking.notes || "inga"}</p>
                        <div className="modal-buttons">
                            <button className="confirm-btn" onClick={confirmCancel}>Avboka</button>
                            <button className="cancel-btn" onClick={closeModal}>Stäng</button>
                        </div>
                    </div>
                    </div>
                 )}
        </div>

    );
}
