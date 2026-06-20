import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const cartContext = useContext(CartContext);
    const { user, isLoggedIn, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    if (!cartContext) return null;
    const { cart, toggleCart } = cartContext;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products/all?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <header className="header-container">
                <div className="header-content">
                    {/* Logo */}
                    <Link to="/" className="header-logo">
                        <svg className="header-logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.5 3.5L18 5M18 5L15.5 7.5M18 5L20.5 7.5M18 5L16.5 3.5M9 10.5C9 12.433 7.433 14 5.5 14C3.567 14 2 12.433 2 10.5C2 8.567 3.567 7 5.5 7C7.433 7 9 8.567 9 10.5Z" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 10.5L20.5 21L22 19.5L10.5 8" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>GuitarShop</span>
                    </Link>

                    {/* Wyszukiwarka */}
                    <form className="header-search" onSubmit={handleSearch}>
                        <button type="submit" className="header-search-icon-btn">
                            <svg className="header-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            placeholder="szukaj gitar, marek, modeli..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {/* Akcje */}
                    <div className="header-actions">
                        {isLoggedIn ? (
                            <>
                                {/* Linki admina — tylko dla ROLE_ADMIN */}
                                {isAdmin && (
                                    <>
                                        <Link to="/admin/dashboard" className="header-admin-btn">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                <rect x="3" y="12" width="4" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                                                <rect x="10" y="7" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                                                <rect x="17" y="3" width="4" height="18" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                                            </svg>
                                            dashboard
                                        </Link>
                                        <Link to="/admin" className="header-admin-btn">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5"/>
                                                <path d="M19.4 15C19.1277 15.6171 19.2584 16.3378 19.73 16.82L19.79 16.88C20.1689 17.2585 20.3818 17.7708 20.3818 18.305C20.3818 18.8392 20.1689 19.3515 19.79 19.73C19.4115 20.1089 18.8992 20.3218 18.365 20.3218C17.8308 20.3218 17.3185 20.1089 16.94 19.73L16.88 19.67C16.3978 19.1984 15.6771 19.0677 15.06 19.34C14.4557 19.6005 14.0577 20.1945 14.05 20.86V21C14.05 22.1046 13.1546 23 12.05 23C10.9454 23 10.05 22.1046 10.05 21V20.93C10.0322 20.2477 9.60047 19.6402 8.96999 19.4C8.35294 19.1277 7.63218 19.2584 7.14999 19.73L7.08999 19.79C6.71148 20.1689 6.19921 20.3818 5.66499 20.3818C5.13078 20.3818 4.6185 20.1689 4.23999 19.79C3.86108 19.4115 3.64817 18.8992 3.64817 18.365C3.64817 17.8308 3.86108 17.3185 4.23999 16.94L4.29999 16.88C4.77158 16.3978 4.90226 15.6771 4.62999 15.06C4.36945 14.4557 3.77546 14.0577 3.10999 14.05H3C1.89543 14.05 1 13.1546 1 12.05C1 10.9454 1.89543 10.05 3 10.05H3.06999C3.75225 10.0322 4.35979 9.60047 4.59999 8.97C4.87226 8.35294 4.74158 7.63218 4.26999 7.15L4.20999 7.09C3.83108 6.71149 3.61817 6.19921 3.61817 5.665C3.61817 5.13078 3.83108 4.6185 4.20999 4.24C4.5885 3.86109 5.10078 3.64818 5.63499 3.64818C6.16921 3.64818 6.68148 3.86109 7.05999 4.24L7.11999 4.3C7.60218 4.77159 8.32294 4.90227 8.93999 4.63H8.99999C9.60432 4.36946 10.0023 3.77547 10.01 3.11V3C10.01 1.89543 10.9054 1 12.01 1C13.1146 1 14.01 1.89543 14.01 3V3.06C14.0177 3.72547 14.4157 4.31946 15.02 4.58C15.637 4.85227 16.3578 4.72159 16.84 4.25L16.9 4.19C17.2785 3.81109 17.7908 3.59818 18.325 3.59818C18.8592 3.59818 19.3715 3.81109 19.75 4.19C20.1289 4.5685 20.3418 5.08078 20.3418 5.615C20.3418 6.14921 20.1289 6.66149 19.75 7.04L19.69 7.1C19.2184 7.58219 19.0877 8.30294 19.36 8.92V8.98C19.6205 9.58432 20.2145 9.98232 20.88 9.99H21C22.1046 9.99 23 10.8854 23 11.99C23 13.0946 22.1046 13.99 21 13.99H20.93C20.2645 13.9977 19.6705 14.3957 19.41 15L19.4 15Z" stroke="currentColor" strokeWidth="1.5"/>
                                            </svg>
                                            admin
                                        </Link>
                                    </>
                                )}
                                {/* Profil użytkownika */}
                                <div className="header-user-info">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    <span>{user?.username}</span>
                                </div>
                                <button className="header-logout-btn" onClick={handleLogout}>
                                    wyloguj
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="header-login-btn">zaloguj</Link>
                                <Link to="/register" className="header-register-btn">rejestracja</Link>
                            </>
                        )}

                        {/* Koszyk */}
                        <button className="header-cart-btn" onClick={toggleCart}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span>koszyk</span>
                            {cart.length > 0 && <div className="header-cart-badge">{cart.length}</div>}
                        </button>
                    </div>
                </div>
            </header>
            <style>{`
                .header-container {
                    background-color: #1c1410;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    padding: 0 1.5rem;
                    border-bottom: 1px solid #2c2018;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                .header-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    max-width: 1120px;
                    margin: 0 auto;
                    gap: 16px;
                }
                .header-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #f5f0eb;
                    font-size: 17px;
                    font-weight: 600;
                    text-decoration: none;
                    white-space: nowrap;
                    letter-spacing: -0.3px;
                }
                .header-logo-icon {
                    width: 24px;
                    height: 24px;
                    flex-shrink: 0;
                }
                .header-search {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }
                .header-search-icon-btn {
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
                .header-search-icon {
                    width: 15px;
                    height: 15px;
                    color: #7a6050;
                }
                .header-search input {
                    background-color: #2c2018;
                    border: 1px solid #3d2e1e;
                    color: #e8ddd4;
                    border-radius: 8px;
                    padding: 8px 12px 8px 34px;
                    width: 100%;
                    font-size: 13px;
                    transition: border-color 0.2s;
                }
                .header-search input::placeholder { color: #6b5744; }
                .header-search input:focus { outline: none; border-color: #c2410c; }
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-shrink: 0;
                }
                .header-login-btn, .header-register-btn {
                    padding: 7px 14px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                .header-login-btn {
                    border: 1px solid #3d2e1e;
                    color: #a89080;
                    background-color: transparent;
                }
                .header-login-btn:hover { border-color: #7a6050; color: #f5f0eb; }
                .header-register-btn {
                    background-color: #c2410c;
                    color: white;
                    border: none;
                }
                .header-register-btn:hover { background-color: #9a3412; }
                .header-admin-btn {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 6px 12px;
                    border: 1px solid #7c2d12;
                    color: #fb923c;
                    background: rgba(124,45,18,0.2);
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                .header-admin-btn:hover { background: rgba(124,45,18,0.4); }
                .header-user-info {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #c4a882;
                    font-size: 13px;
                    padding: 6px 10px;
                    background: #2c2018;
                    border-radius: 6px;
                    border: 1px solid #3d2e1e;
                    white-space: nowrap;
                }
                .header-logout-btn {
                    border: 1px solid #3d2e1e;
                    color: #7a6050;
                    background-color: transparent;
                    padding: 7px 14px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                .header-logout-btn:hover { border-color: #c2410c; color: #fb923c; }
                .header-cart-btn {
                    background-color: #c2410c;
                    color: white;
                    border-radius: 6px;
                    padding: 8px 14px;
                    border: none;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    position: relative;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    white-space: nowrap;
                }
                .header-cart-btn:hover { background-color: #9a3412; }
                .header-cart-btn svg { width: 16px; height: 16px; }
                .header-cart-badge {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background-color: white;
                    color: #c2410c;
                    border-radius: 50px;
                    font-size: 10px;
                    font-weight: 700;
                    min-width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 4px;
                }
            `}</style>
        </>
    );
}