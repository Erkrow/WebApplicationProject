import { useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
    // Stan przechowujący dane nowego produktu
    const [formData, setFormData] = useState({
        name: '', brand: '', type: '', price: '', 
        specs: '', desc: '', image: '', category: 'gitary' // Domyślna kategoria
    });
    const [message, setMessage] = useState('');

    // Funkcja aktualizująca stan podczas wpisywania
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Funkcja wysyłająca dane do Spring Boota
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Pobieramy nasz token z pamięci przeglądarki
        const token = localStorage.getItem('jwt_token');

        try {
            await axios.post('http://localhost:8080/api/products', formData, {
                headers: {
                    // To jest kluczowe! Pokazujemy backendowi naszą przepustkę.
                    'Authorization': `Bearer ${token}` 
                }
            });
            
            setMessage('✅ Produkt został pomyślnie dodany do bazy!');
            // Czyszczenie formularza
            setFormData({ name: '', brand: '', type: '', price: '', specs: '', desc: '', image: '', category: 'gitary' });
            
        } catch (error) {
            console.error(error);
            setMessage('❌ Wystąpił błąd podczas dodawania produktu.');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '50px auto' }}>
            <h2 style={{ textAlign: 'center' }}>👑 Panel Administratora</h2>
            <p style={{ textAlign: 'center', marginBottom: '30px' }}>Dodaj nowy produkt do sklepu</p>

            {message && <div style={{ padding: '10px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>{message}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" name="name" placeholder="Nazwa produktu (np. Stratocaster)" value={formData.name} onChange={handleChange} required />
                <input type="text" name="brand" placeholder="Marka (np. Fender)" value={formData.brand} onChange={handleChange} required />
                <input type="text" name="type" placeholder="Typ (np. Elektryczna)" value={formData.type} onChange={handleChange} required />
                <input type="number" name="price" placeholder="Cena (np. 3500)" value={formData.price} onChange={handleChange} required />
                <input type="text" name="specs" placeholder="Specyfikacja (np. Układ SSS)" value={formData.specs} onChange={handleChange} required />
                
                <textarea name="desc" placeholder="Opis produktu..." value={formData.desc} onChange={handleChange} required rows={4} />
                
                <input type="text" name="image" placeholder="Ścieżka do zdjęcia (np. /images/gitara1.jpg lub URL)" value={formData.image} onChange={handleChange} required />
                
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="gitary">Gitary</option>
                    <option value="fortepiany">Pianina i Fortepiany</option>
                    <option value="keyboardy">Keyboardy</option>
                </select>

                <button type="submit" style={{ padding: '12px', backgroundColor: '#d32f2f', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Dodaj produkt do bazy
                </button>
            </form>
        </div>
    );
}