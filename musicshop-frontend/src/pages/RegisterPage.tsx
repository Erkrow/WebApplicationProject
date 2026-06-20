import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const { isLoggedIn } = useAuth();

    // Redirect jesli juz zalogowany
    if (isLoggedIn) return <Navigate to="/" replace />;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/register', { username, password });
            setMessage('Konto zostało utworzone! Możesz się teraz zalogować.');
            setIsError(false);
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error("Registration error:", error);
            setMessage('Błąd podczas rejestracji. Spróbuj innej nazwy użytkownika.');
            setIsError(true);
        }
    };

    return (
        <>
            <div className="auth-page-container">
                <div className="auth-card">
                    <div className="auth-logo">
                        <div className="auth-logo-icon"></div>
                        <span>MusicShop</span>
                    </div>
                    <h1>Create your account</h1>
                    <p className="auth-subtitle">Create your account to get started.</p>

                    {message && (
                        <div className={`auth-message ${isError ? 'error' : 'success'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                        
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        
                        <button type="submit" className="auth-submit-btn">Create Account</button>
                    </form>
                    <p className="auth-bottom-link">
                        Already have an account? <Link to="/login">Log in</Link>
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