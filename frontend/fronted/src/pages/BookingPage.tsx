import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiUrl from "../config";
import "../styles/pages/BookingPage.css";

interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    animalType: string;
}

const BookingPage: React.FC = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const [service, setService] = useState<Service | null>(null);
    const [date, setDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");
    const [notes, setNotes] = useState("");
   // const [loading, setLoading] = useState(true);
    //const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const navigate = useNavigate();
    //const apiUrl = import.meta.env.VITE_API_URL;

    // Redirect till /service om serviceId saknas
    useEffect(() => {
        if (!serviceId) {
            navigate("/service");
        }
    }, [serviceId, navigate]);

    // hämta tjänstinfo
    useEffect(() => {
        if (!serviceId) return;

        const fetchServices = async () => {
            try {
                const res = await fetch(`${apiUrl}/service/${serviceId}`);
                const data = await res.json();
                setService(data);
            } catch (err) {
                setMessage("kunde inte hämta tjänstinfo");
            }
        };
        fetchServices();
    }, [serviceId]);    
    
    /*
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${apiUrl}/service/${serviceId}`);
                const data = await res.json();
                setService(data);
            } catch (err) {
                setMessage("kunde inte hämta tjänstinfo");
            }
        };
        fetchServices();
    }, [serviceId]); */

    // hämta lediga tider
    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        //const token = localStorage.getItem("token")?.trim();
       /* if (!token) {
            setMessage("du måste vara inloggad för att se lediga tider");
            return;
        }*/

        const selectedDate = e.target.value;
        setDate(selectedDate);
        setSelectedTime("");
        setAvailableSlots([]);

        if (!serviceId) return;

        const token = localStorage.getItem("token")?.trim(); // trimma token

        if (!token) {
            setMessage("du måste vara inloggad för att boka online")
            return;
        }


        setLoadingSlots(true);
        try {
        //    console.log(`${apiUrl}/booking`);
          //  console.log(token);
            const res = await fetch(
                `${apiUrl}/booking/available?date=${selectedDate}&serviceId=${serviceId}` ,
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                } 
            );

            console.log("GET /available response status", res.status);

            if( !res.ok) throw new Error("kunde inte hämta tider");
            const data = await res.json();
            setAvailableSlots(data.availableSlots || []);
        } catch {
            setAvailableSlots([]);
            setMessage("kunde inte hämta lediga tider");
        } finally {
            setLoadingSlots(false);
        }

    };

    // skapa bokning
    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token")?.trim(); // trimma token

        if (!token) {
            setMessage("du måste vara inloggad för att boka online")
            return;
        }

        if (!date || !selectedTime) {
            setMessage("välj datum och tid innan du bokar");
            return;
        }

        try {
            console.log("POST URL", `${apiUrl}/booking`);
            console.log("Token", token);
            const res = await fetch(`${apiUrl}/booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    service: serviceId,
                    date: `${date}T${selectedTime}:00Z`,
                    notes,
                }),
            });

            console.log("GET /available response status", res.status);

            const data = await res.json();

            if (res.ok) {
                setMessage("bokning skapad");
                setTimeout(() => navigate("/profile"), 1500);
            } else if (res.status === 403) {
                setMessage("du har inte behörighet. du behöver logga in");
            } else {
              setMessage(data.message || "något gick fel vid bokning");  
            }
        } catch (err) {
            setMessage("kunde inte ansluta till servern");
        }
    };

    if (!service) return <p className="status-text">Laddar tjänst...</p>

    return (
        <div className="booking-page">
            <h1 className="page-title">Boka {service.name}</h1>
            <div className="service-summary">

                <p><strong>Beskrivning:</strong> {service.description} kr</p>
                <p><strong>Pris:</strong> {service.price} kr</p>
                <p><strong>Tid:</strong> {service.duration} min</p>
            </div>

            {message && <div className="message-box">{message}</div>}

            <form onSubmit={handleBooking} className="booking-form">
                <label htmlFor="date">Datum:</label>
                <input
                type="date"
                id="date"
                value={date}
                onChange={handleDateChange}
                required
                />

                {loadingSlots ?  (
                    <p>Laddar lediga tider...</p>
                ) : (
                    availableSlots.length > 0 && (
                        <>
                        <label htmlFor="time">Välj tid:</label>
                        <select
                        id="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        required
                        >
                        <option value="">Välj en tid</option>
                        {availableSlots.map((slot) => {
                            const time = slot.split(" ")[1]; // "09:00"
                            return (
                                <option key={slot} value={time}>
                                    {time}
                                </option>
                            );
                        })}
                    </select>
                    </>
                    )
                )}

                <label htmlFor="notes">Anteckningar (valfritt)</label>
                <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Vill ha extra kort skägg"
                />

                <button type="submit" className="submit-btn">
                    Sicka bokning
                </button>
            </form>
        </div>
    );
};

export default BookingPage;
