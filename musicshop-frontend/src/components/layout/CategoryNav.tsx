import { NavLink } from 'react-router-dom';

const categories = [
    { name: 'wszystkie', path: '/products/all' },
    { name: 'elektryczne', path: '/products/elektryczne' },
    { name: 'akustyczne', path: '/products/akustyczne' },
    { name: 'klasyczne', path: '/products/klasyczne' },
    { name: 'basowe', path: '/products/basowe' },
    { name: 'akcesoria', path: '/products/akcesoria' },
];

export default function CategoryNav() {
    return (
        <>
            <nav className="catnav-container">
                <div className="catnav-content">
                    {categories.map((category) => (
                        <NavLink
                            key={category.name}
                            to={category.path}
                            className={({ isActive }) => 
                                `catnav-btn ${isActive ? 'active' : ''}`
                            }
                            end={category.path === '/'}
                        >
                            {category.name}
                        </NavLink>
                    ))}
                </div>
            </nav>
            <style>{`
                .catnav-container {
                    background-color: #241a10;
                    border-bottom: 0.5px solid #3d2e1e;
                }
                .catnav-content {
                    max-width: 1120px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    padding: 0 1.5rem;
                }
                .catnav-btn {
                    color: #7a6050;
                    padding: 13px 18px;
                    font-size: 13px;
                    border: none;
                    background-color: transparent;
                    cursor: pointer;
                    text-decoration: none;
                    text-transform: capitalize;
                    transition: color 0.2s;
                    border-bottom: 2px solid transparent;
                    margin-bottom: -1px; /* Overlap the container border */
                }
                .catnav-btn:hover {
                    color: #c4a882;
                }
                .catnav-btn.active {
                    color: #f97316;
                    border-bottom-color: #f97316;
                    font-weight: 500;
                }
            `}</style>
        </>
    );
}
