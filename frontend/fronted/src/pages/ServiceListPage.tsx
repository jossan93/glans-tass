import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiUrl from "../config";
import "../styles/pages/ServiceListPage.css";

interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    animalType: string;
}

const ServiceListPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const navigate = useNavigate();
    //const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${apiUrl}/service`);
                const data = await res.json();
                setServices(data);
            } catch (err) {
                setError("kunde inte hämta tjänster");
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleBookingClick = (serviceId: string) => {
        //kolla om användaren är inloggad
        const token = localStorage.getItem("token");

        if (token) {
            navigate(`/booking/${serviceId}`);
        } else {
            setMessage("Vänligen logga in eller skapa ett konto för att boka en tid online.");
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (loading) return <p className="status-text">Laddar tjänster...</p>;
    if (error) return <p className="status-text error">{error}</p>;

    const dogServices = services.filter((s) => s.animalType === "hund");
    const catServices = services.filter((s) => s.animalType === "katt");

    return (
        <div className="service-page">
            <h1 className="page-title">Våra tjänster</h1>
            <p className="info-box">
                Alla priser gäller för tovfri, lätthanterlig hund eller katt. Vid tovor/tovutredning kan extra kostnad tillkomma.
            </p>

            {message && <div className="login-warning">{message}</div>}

            <div className="service-section">
                <h2>Hundtjänster</h2>
                <div className="service-grid">
                    {dogServices.map((service) => (
                        <div key={service._id} className="service-card">
                            <h3>{service.name}</h3>
                            <p>{service.description}</p>
                            <p><strong>Pris:</strong> {service.price} kr</p>
                            <p><strong>Tid:</strong> {service.duration} min</p>
                            <button 
                            className="book-btn"
                            onClick={() => handleBookingClick(service._id)}
                            >
                            Boka</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="service-section">
                <h2>Katttjänster</h2>
                <div className="service-grid">
                    {catServices.map((service) => (
                        <div key={service._id} className="service-card">
                            <h3>{service.name}</h3>
                            <p>{service.description}</p>
                            <p><strong>Pris:</strong> {service.price} kr</p>
                            <p><strong>Tid:</strong> {service.duration} min</p>
                            <button 
                            className="book-btn"
                            onClick={() => handleBookingClick(service._id)}
                            >
                            Boka</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceListPage;
