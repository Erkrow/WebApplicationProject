// src/pages/LoginPage.tsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Pozwoli nam przenieść użytkownika po zalogowaniu

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Wysyłamy POST z loginem i hasłem do naszego backendu
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username: username,
                password: password
            });

            // 1. Odbieramy token z odpowiedzi serwera
            const token = response.data.token;
            
            // 2. Zapisujemy token w pamięci przeglądarki (localStorage)
            localStorage.setItem('jwt_token', token);
            localStorage.setItem('username', username); // Zapiszemy też nazwę, żeby móc ją wyświetlić
            
            setMessage('Zalogowano pomyślnie!');
            setIsError(false);
            
            // 3. Po 2 sekundach przenosimy użytkownika na stronę główną
            setTimeout(() => {
                navigate('/');
            }, 2000);
            
        } catch (error) {
            console.error("Błąd logowania:", error);
            setMessage('Błędny login lub hasło!');
            setIsError(true);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h2 className="section-title">Logowanie</h2>
            
            {message && (
                <div style={{ 
                    padding: '10px', 
                    marginBottom: '15px', 
                    backgroundColor: isError ? '#ffebee' : '#e8f5e9', 
                    color: isError ? '#c62828' : '#2e7d32',
                    borderRadius: '4px'
                }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Nazwa użytkownika" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                
                <input 
                    type="password" 
                    placeholder="Hasło" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                
                <button 
                    type="submit" 
                    style={{ 
                        padding: '12px', 
                        fontSize: '16px', 
                        backgroundColor: '#333', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Zaloguj się
                </button>
            </form>
        </div>
    );
}