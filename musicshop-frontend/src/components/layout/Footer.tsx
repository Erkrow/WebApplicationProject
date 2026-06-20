import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <>
            <footer className="footer-container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="footer-logo">GuitarShop</span>
                        <p>© 2026 GuitarShop. Wszystkie prawa zastrzeżone.</p>
                    </div>
                    <div className="footer-links">
                        <Link to="/products/all">Wszystkie gitary</Link>
                        <Link to="/products/elektryczne">Elektryczne</Link>
                        <Link to="/products/akustyczne">Akustyczne</Link>
                        <Link to="/register">Rejestracja</Link>
                        <Link to="/login">Logowanie</Link>
                    </div>
                </div>
            </footer>
            <style>{`
                .footer-container { background: #1c1410; border-top: 0.5px solid #2c2018; padding: 2rem 2rem; }
                .footer-content { max-width: 1120px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap; }
                .footer-brand { display: flex; flex-direction: column; gap: 4px; }
                .footer-logo { color: #f5f0eb; font-size: 15px; font-weight: 600; }
                .footer-content p { color: #4a3828; font-size: 12px; }
                .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
                .footer-links a { color: #4a3828; font-size: 13px; text-decoration: none; transition: color 0.2s; }
                .footer-links a:hover { color: #7a6050; }
            `}</style>
        </>
    );
}
