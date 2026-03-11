// src/components/layout/CategoryNav.tsx
import { NavLink } from 'react-router-dom';

export default function CategoryNav() {
    return (
        <div className="nav-categories">
            <div className="nav-categories-content">
                {/* NavLink automatycznie dodaje klasę 'active', gdy URL do niego pasuje */}
                <NavLink to="/" className={({ isActive }: {isActive: boolean}) => isActive ? "nav-item active" : "nav-item"}>Wszystkie</NavLink>
                <NavLink to="/gitary" className={({ isActive }: {isActive: boolean}) => isActive ? "nav-item active" : "nav-item"}>Gitary</NavLink>
                <NavLink to="/fortepiany" className={({ isActive }: {isActive: boolean}) => isActive ? "nav-item active" : "nav-item"}>Fortepiany</NavLink>
                <NavLink to="/keyboardy" className={({ isActive }: {isActive: boolean}) => isActive ? "nav-item active" : "nav-item"}>Keyboardy</NavLink>
                <NavLink to="/wzmacniacze" className={({ isActive }: {isActive: boolean}) => isActive ? "nav-item active" : "nav-item"}>Wzmacniacze</NavLink>
            </div>
        </div>
    );
}