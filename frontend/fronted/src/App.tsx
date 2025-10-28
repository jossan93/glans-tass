import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import "./styles/Global.css"
import RegisterPage from "./pages/RegisterPage";
import ServiceListPage from "./pages/ServiceListPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main style={{ minHeight: "80vh", padding: "1rem"}}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/service" element={<ServiceListPage />} />

            {/* fångar /booking utan serviceId och redirectar */}
            <Route path="/booking" element={<Navigate to="/service" replace />}  />

            {/* Route för booking med serviceID */}
            <Route path="/booking/:serviceId" element={<BookingPage />} />
            
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route 
              path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
                />

              <Route 
              path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPage/>
                  </ProtectedRoute>
                }
                />


          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App
