// src/components/layout/Header.tsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

export default function Header() {
    const cartContext = useContext(CartContext);

    // Zabezpieczenie na wypadek braku contextu
    if (!cartContext) return null;

    const { cart, toggleCart } = cartContext;

    // TODO: Zastąpienie logiki z accessibility.js i theme.js
    const cycleFontSize = () => document.body.classList.toggle('fs-large'); 
    const toggleDarkMode = () => document.body.classList.toggle('dark-mode');

    return (
        <div className="header">
            <div className="header-content">
                {/* Zastępujemy tag <a> komponentem Link z React Routera */}
                <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="logo-icon" viewBox="0 0 16 16">
                        <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2" />
                        <path fillRule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z" />
                        <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z" />
                    </svg>
                    <span className="logo-text">NovaMarket</span>
                </Link>

                <div className="nav-buttons">
                    <button className="btn-icon" onClick={cycleFontSize} title="Zmień rozmiar tekstu">A+</button>
                    {/* Ten przycisk jest teraz "podłączony" do Reacta! */}
                    <button className="btn-icon-cart" onClick={toggleCart}>
                        🛒 Koszyk ({cart.length})
                    </button>
                    <button className="btn-icon" onClick={toggleDarkMode}>🌙</button>
                </div>
            </div>
        </div>
    );
}