import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

export default function Header() {
    const cartContext = useContext(CartContext);

    if (!cartContext) return null;

    const { cart, toggleCart } = cartContext;

    return (
        <>
            <header className="header-container">
                <div className="header-content">
                    <Link to="/" className="header-logo">
                        <div className="header-logo-icon"></div>
                        <span>MusicShop</span>
                    </Link>

                    <div className="header-search">
                        <svg className="header-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                        </svg>
                        <input type="text" placeholder="search instruments, brands..." />
                    </div>

                    <div className="header-actions">
                        <Link to="/login" className="header-login-btn">log in</Link>
                        <button className="header-cart-btn" onClick={toggleCart}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span>cart</span>
                            {cart.length > 0 && <div className="header-cart-badge">{cart.length}</div>}
                        </button>
                    </div>
                </div>
            </header>
            <style>{`
                .header-container {
                    background-color: #1c1410;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    padding: 0 1.5rem;
                }
                .header-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    max-width: 1120px;
                    margin: 0 auto;
                }
                .header-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #f5f0eb;
                    font-size: 18px;
                    font-weight: 500;
                    text-decoration: none;
                }
                .header-logo-icon {
                    width: 16px;
                    height: 16px;
                    background-color: #f97316;
                    border-radius: 4px;
                }
                .header-search {
                    position: relative;
                    width: 100%;
                    max-width: 420px;
                }
                .header-search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 16px;
                    height: 16px;
                    color: #7a6050;
                }
                .header-search input {
                    background-color: #2c2018;
                    border: 0.5px solid #3d2e1e;
                    color: #e8ddd4;
                    border-radius: 8px;
                    padding: 8px 14px 8px 36px;
                    width: 100%;
                    font-size: 14px;
                }
                .header-search input::placeholder {
                    color: #7a6050;
                }
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .header-login-btn {
                    border: 0.5px solid #3d2e1e;
                    color: #a89080;
                    background-color: transparent;
                    padding: 7px 16px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                }
                .header-login-btn:hover {
                    border-color: #7a6050;
                    color: #f5f0eb;
                }
                .header-cart-btn {
                    background-color: #c2410c;
                    color: white;
                    border-radius: 6px;
                    padding: 8px 12px;
                    border: none;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    position: relative;
                    font-size: 14px;
                    font-weight: 500;
                }
                .header-cart-btn:hover {
                    background-color: #9a3412;
                }
                .header-cart-btn svg {
                    width: 18px;
                    height: 18px;
                }
                .header-cart-badge {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background-color: white;
                    color: #c2410c;
                    border-radius: 50px;
                    font-size: 11px;
                    font-weight: 600;
                    min-width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 5px;
                }
            `}</style>
        </>
    );
}