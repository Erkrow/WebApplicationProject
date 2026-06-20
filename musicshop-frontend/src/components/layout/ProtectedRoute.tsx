import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isLoggedIn, user } = useAuth();

    // Niezalogowany — przekieruj do logowania
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Zalogowany ale nie ma wymaganej roli — przekieruj na glowna
    if (user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    // Wszystko OK
    return <>{children}</>;
}