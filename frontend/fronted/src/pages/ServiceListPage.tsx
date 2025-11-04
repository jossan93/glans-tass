import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiUrl from "../config";
import "../styles/pages/ServiceListPage.css";

interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    animalType: string;
    order: number;
}

const ServiceListPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);


    //   const navigate = useNavigate();
    //const apiUrl = import.meta.env.VITE_API_URL;

    const fetchServices = async (term = "") => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/service?search=${encodeURIComponent(term)}`);
            const data = await res.json();
            setServices(data);
        } catch (err) {
            setError("kunde inte hämta tjänster");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 600);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetchServices(debouncedSearch);
    }, [debouncedSearch]);

    const handlelinkClick = (e: React.MouseEvent, _serviceId?: string) => {
        //kolla om användaren är inloggad
        const token = localStorage.getItem("token");

        if (!token) {
            e.preventDefault();
            setMessage("Vänligen logga in eller skapa ett konto för att boka en tid online.");
            setTimeout(() => setMessage(null), 100000);
        }
    };

    if (loading) return <p className="status-text">Laddar tjänster...</p>;
    if (error) return <p className="status-text error">{error}</p>;

    const dogServices = services.filter((s) => s.animalType === "hund");
    const catServices = services.filter((s) => s.animalType === "katt");

    const noResults = services.length === 0 && search.trim() !== "";

    return (
        <div className="service-page">
            <h1 className="page-title">Våra tjänster</h1>
            <p className="info-box">
                Alla priser gäller för tovfri, lätthanterlig hund eller katt. Vid tovor/tovutredning kan extra kostnad tillkomma.
            </p>

            {message && <div className="login-warning">{message}</div>}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Sök tjänst..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            {noResults ? (
                <p className="no-results">Inga tjänster hittades för "{search}".</p>
            ) : (
                <>
                    <div className="service-section">
                        <h2>Hundtjänster</h2>

                        <div className="dog-size-info">
                            <p><strong>Liten hund:</strong> upp till 10 kg</p>
                            <p><strong>Mellan hund:</strong>10-25 kg</p>
                            <p><strong>Stror hund:</strong>över 25 kg</p>
                        </div>
                        <div className="service-grid">
                            {dogServices.map((service) => (
                                <div key={service._id} className="service-card">
                                    <h3>{service.name}</h3>
                                    <p>{service.description}</p>
                                    <p><strong>Pris:</strong> {service.price} kr</p>
                                    <p><strong>Tid:</strong> {service.duration} min</p>
                                    <Link
                                        to={`/booking/${service._id}`}
                                        className="book-btn"
                                        onClick={(e) => handlelinkClick(e, service._id)}
                                    >
                                        Boka
                                    </Link>
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
                                    <Link
                                        to={`/booking/${service._id}`}
                                        className="book-btn"
                                        onClick={(e) => handlelinkClick(e, service._id)}
                                    >
                                        Boka
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ServiceListPage;
