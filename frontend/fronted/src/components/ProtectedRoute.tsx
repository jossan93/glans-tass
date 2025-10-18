import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
/*
interface Props {
    children: JSX.Element;
}
*/
export default function ProtectedRoute({ children }: { children: JSX.Element}) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}