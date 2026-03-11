import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole: string;
}

// Interfejs opisujący, co zaszyfrowaliśmy w Spring Boot wewnątrz tokena
interface MyTokenPayload {
    sub: string; // to jest username
    role: string; // to jest nasza rola, np. "ROLE_ADMIN"
    exp: number; // data ważności
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const token = localStorage.getItem('jwt_token');

    // 1. Jeśli nie ma tokena w ogóle -> wyrzuć na stronę logowania
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        // 2. Dekodujemy token, aby wyciągnąć rolę
        const decoded = jwtDecode<MyTokenPayload>(token);

        // 3. Sprawdzamy, czy rola z tokena pasuje do tej wymaganej przez stronę
        if (decoded.role !== requiredRole) {
            alert(`Odmowa dostępu! Wymagana rola: ${requiredRole}. Twoja rola: ${decoded.role}`);
            return <Navigate to="/" replace />;
        }

        // 4. Jeśli wszystko jest ok, wpuszczamy na stronę!
        return <>{children}</>;
        
    } catch (error) {
        // Jeśli token był zepsuty, usuwamy go i każemy się zalogować ponownie
        localStorage.removeItem('jwt_token');
        return <Navigate to="/login" replace />;
    }
}