// src/pages/ProductsPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { fetchProductsFromDB } from '../services/api'; // <-- Import our new API service
import type { Product } from '../types';
import ProductCard from '../components/ui/ProductCard';

interface ProductsPageProps {
    category: string;
    title: string;
}

export default function ProductsPage({ category, title }: ProductsPageProps) {
    const [dbProducts, setDbProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('');

    // 1. Fetch data from the database (via API) when the component mounts
    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            const data = await fetchProductsFromDB();
            setDbProducts(data);
            setIsLoading(false);
        };
        
        loadProducts();
    }, []); // The empty array means this runs only once when the page loads

    // 2. Filter products by category
    const categoryProducts = dbProducts.filter(p => p.category === category || category === 'wszystkie');

    // 3. Sort products
    const displayedProducts = useMemo(() => {
        const sorted = [...categoryProducts];
        if (sortOrder === 'asc') sorted.sort((a, b) => a.price - b.price);
        if (sortOrder === 'desc') sorted.sort((a, b) => b.price - a.price);
        return sorted;
    }, [categoryProducts, sortOrder]);

    if (isLoading) {
        return <div className="container"><h2 className="section-title">Ładowanie produktów z bazy danych... ⏳</h2></div>;
    }

    return (
        <div className="products-container">
            {/* ... Your existing sidebar code ... */}
            <aside className="filters-sidebar">
                <div className="filters-header"><h3>🔍 Filtry</h3></div>
            </aside>

            <main className="content-area">
                <div className="content-header">
                    <h1 className="section-title">🎹 {title}</h1>
                    <div className="sort-bar">
                        <label htmlFor="sortPrice">Sortuj wg ceny:</label>
                        <select id="sortPrice" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="">Domyślnie</option>
                            <option value="asc">Cena rosnąco</option>
                            <option value="desc">Cena malejąco</option>
                        </select>
                    </div>
                    <p className="result-count">Wyników: <span>{displayedProducts.length}</span></p>
                </div>

                <div className="products-list" style={{ display: 'grid', gap: '16px' }}>
                    {displayedProducts.length > 0 ? (
                        displayedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p>Brak produktów w tej kategorii w bazie danych.</p>
                    )}
                </div>
            </main>
        </div>
    );
}