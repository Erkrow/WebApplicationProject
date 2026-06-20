import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
    sub: string;   // username
    role: string;  // np. "ROLE_ADMIN" lub "ROLE_USER"
    exp: number;   // timestamp wygasniecia
}

interface AuthUser {
    username: string;
    role: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseToken(token: string): AuthUser | null {
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        // Sprawdz wygasniecie tokena
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('username');
            return null;
        }
        return { username: decoded.sub, role: decoded.role };
    } catch {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('username');
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        const token = localStorage.getItem('jwt_token');
        return token ? parseToken(token) : null;
    });

    // Auto-wylogowanie gdy token wygasnie
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        try {
            const decoded = jwtDecode<TokenPayload>(token);
            const msUntilExpiry = decoded.exp * 1000 - Date.now();
            if (msUntilExpiry <= 0) {
                logout();
                return;
            }
            const timer = setTimeout(() => {
                logout();
            }, msUntilExpiry);
            return () => clearTimeout(timer);
        } catch {
            logout();
        }
    }, [user]);

    const login = (token: string) => {
        localStorage.setItem('jwt_token', token);
        const parsed = parseToken(token);
        if (parsed) {
            localStorage.setItem('username', parsed.username);
            setUser(parsed);
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('username');
        localStorage.removeItem('musicStoreCart');
        setUser(null);
    };

    const isLoggedIn = user !== null;
    const isAdmin = user?.role === 'ROLE_ADMIN';

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth musi byc uzywany wewnatrz AuthProvider');
    }
    return context;
}
