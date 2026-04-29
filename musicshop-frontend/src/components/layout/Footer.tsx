import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <>
            <footer className="footer-container">
                <div className="footer-content">
                    <p>© 2026 MusicShop</p>
                    <div className="footer-links">
                        <Link to="/about">about</Link>
                        <Link to="/contact">contact</Link>
                        <Link to="/returns">returns policy</Link>
                    </div>
                </div>
            </footer>
            <style>{`
                .footer-container { background: #1c1410; border-top: 0.5px solid #241a10; padding: 1.5rem 2rem; }
                .footer-content { max-width: 1120px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
                .footer-content p { color: #3d2e1e; font-size: 14px; }
                .footer-links { display: flex; gap: 20px; }
                .footer-links a { color: #3d2e1e; font-size: 13px; text-decoration: none; }
                .footer-links a:hover { color: #7a6050; }
            `}</style>
        </>
    );
}
