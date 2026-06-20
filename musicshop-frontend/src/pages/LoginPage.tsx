import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const { login, isLoggedIn } = useAuth();

    // Redirect jesli juz zalogowany
    if (isLoggedIn) return <Navigate to="/" replace />;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
            login(response.data.token); // Uzywa AuthContext — reaktywnie aktualizuje caly app
            setMessage('Zalogowano pomyślnie!');
            setIsError(false);
            navigate('/');
        } catch (error) {
            console.error("Login error:", error);
            setMessage('Nieprawidłowa nazwa użytkownika lub hasło.');
            setIsError(true);
        }
    };

    return (
        <>
            <div className="auth-page-container">
                <div className="auth-card">
                    <div className="auth-logo">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M19.5 3.5L18 5M18 5L15.5 7.5M18 5L20.5 7.5M18 5L16.5 3.5M9 10.5C9 12.433 7.433 14 5.5 14C3.567 14 2 12.433 2 10.5C2 8.567 3.567 7 5.5 7C7.433 7 9 8.567 9 10.5Z" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 10.5L20.5 21L22 19.5L10.5 8" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>GuitarShop</span>
                    </div>
                    <h1>Witaj z powrotem</h1>
                    <p className="auth-subtitle">Zaloguj się do swojego konta.</p>
                    
                    {message && (
                        <div className={`auth-message ${isError ? 'error' : 'success'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <label htmlFor="login-username">Nazwa użytkownika</label>
                        <input 
                            type="text" 
                            id="login-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                        
                        <label htmlFor="login-password">Hasło</label>
                        <input 
                            type="password" 
                            id="login-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        
                        <button type="submit" id="login-submit-btn" className="auth-submit-btn">Zaloguj się</button>
                    </form>
                    <p className="auth-bottom-link">
                        Nie masz konta? <Link to="/register">Zarejestruj się</Link>
                    </p>
                </div>
            </div>
            <style>{`
                .auth-page-container { min-height: 100vh; background: #faf7f4; display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .auth-card { background: white; border: 0.5px solid #e8ddd4; border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 420px; box-shadow: 0 1px 3px rgba(28,20,16,0.06); }
                .auth-logo { display: flex; align-items: center; justify-content: center; gap: 10px; color: #1c1410; font-size: 18px; font-weight: 500; text-decoration: none; margin-bottom: 1.75rem; }
                .auth-logo-icon { width: 16px; height: 16px; background-color: #f97316; border-radius: 4px; }
                .auth-card h1 { font-family: var(--font-display); font-size: 24px; font-weight: 500; color: #1c1410; margin-bottom: 6px; text-align: center; }
                .auth-subtitle { font-size: 14px; color: #7a6050; margin-bottom: 1.75rem; text-align: center; }
                .auth-message { padding: 10px; margin-bottom: 1rem; border-radius: 8px; font-size: 14px; text-align: center; }
                .auth-message.error { background-color: #ffebee; color: #c62828; }
                .auth-message.success { background-color: #e8f5e9; color: #2e7d32; }
                form label { font-size: 13px; font-weight: 500; color: #5c4033; margin-bottom: 5px; display: block; }
                form input { width: 100%; background: #faf7f4; border: 0.5px solid #e2d4c8; border-radius: 8px; padding: 10px 14px; font-size: 14px; color: #1c1410; margin-bottom: 14px; }
                form input:focus { outline: none; border-color: #c2410c; }
                .auth-submit-btn { width: 100%; background: #c2410c; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: 500; margin-top: 6px; cursor: pointer; }
                .auth-bottom-link { font-size: 13px; color: #7a6050; text-align: center; margin-top: 1.25rem; }
                .auth-bottom-link a { color: #c2410c; text-decoration: none; font-weight: 500; }
            `}</style>
        </>
    );
}