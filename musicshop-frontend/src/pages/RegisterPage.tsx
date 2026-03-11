// src/pages/RegisterPage.tsx
import { useState } from 'react';
import axios from 'axios';

export default function RegisterPage() {
    // Stany do przechowywania danych z formularza
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // Stan do wyświetlania komunikatów (sukces/błąd)
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); // Zatrzymuje domyślne przeładowanie strony po kliknięciu "Submit"
        
        try {
            // Wysyłamy POST do Spring Boota (upewnij się, że port to 8080)
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username: username,
                password: password
            });

            console.log("Odpowiedź z serwera:", response.data);
            setMessage('Konto zostało pomyślnie utworzone! (Rola: ' + response.data.role + ')');
            setIsError(false);
            
            // Czyszczenie formularza po sukcesie
            setUsername('');
            setPassword('');
            
        } catch (error) {
            console.error("Błąd rejestracji:", error);
            setMessage('Wystąpił błąd podczas rejestracji. Spróbuj innej nazwy użytkownika.');
            setIsError(true);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h2 className="section-title">Rejestracja</h2>
            
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

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                    Zarejestruj się
                </button>
            </form>
        </div>
    );
}