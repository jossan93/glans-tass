import { useAuth } from "../context/AuthContext"
import "../styles/pages/ProfilePage.css"

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="profile-container">
            <h1>Din Profil</h1>
            
            <div className="profile-card">
                <p>Namn: {user}</p>
                
            </div>            
        </div>

    );
}