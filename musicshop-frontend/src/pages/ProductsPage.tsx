import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProductsFromDB } from '../services/api';
import type { Product } from '../types';
import ProductCard from '../components/ui/ProductCard';

interface ProductsPageProps {
    category: string;
}

export default function ProductsPage({ category }: ProductsPageProps) {
    const [dbProducts, setDbProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('featured');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    // Przeladowuje produkty gdy zmienia sie kategoria lub wyszukiwanie
    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            try {
                const data = await fetchProductsFromDB(
                    category !== 'all' ? category : undefined,
                    searchQuery || undefined
                );
                setDbProducts(data);
            } catch (err) {
                console.error('Blad pobierania produktow:', err);
                setDbProducts([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadProducts();
    }, [category, searchQuery]); // Reaguje na zmiane kategorii i wyszukiwania

    const displayedProducts = useMemo(() => {
        let products = [...dbProducts];

        // Filtr: tylko dostepne w magazynie
        if (inStockOnly) {
            products = products.filter(p => p.stockQuantity && p.stockQuantity > 0);
        }

        // Sortowanie
        if (sortOrder === 'price-asc') products.sort((a, b) => a.price - b.price);
        if (sortOrder === 'price-desc') products.sort((a, b) => b.price - a.price);

        return products;
    }, [dbProducts, sortOrder, inStockOnly]);

    const categoryTitle = () => {
        if (searchQuery) return `Wyniki wyszukiwania: "${searchQuery}"`;
        if (category === 'all') return 'Wszystkie gitary';
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    return (
        <>
            <div className="products-page-wrapper">
                <div className="products-header-bar">
                    <div className="products-header-left">
                        <h1>{categoryTitle()}</h1>
                        <span>{displayedProducts.length} {displayedProducts.length === 1 ? 'produkt' : 'produktów'}</span>
                    </div>
                    <div className="products-filters">
                        <div className="products-filter-chips">
                            <button
                                className={`products-chip ${!inStockOnly ? 'active' : ''}`}
                                onClick={() => setInStockOnly(false)}
                            >
                                wszystkie
                            </button>
                            <button
                                className={`products-chip ${inStockOnly ? 'active' : ''}`}
                                onClick={() => setInStockOnly(true)}
                            >
                                w magazynie
                            </button>
                        </div>
                        <select
                            className="products-sort-select"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="featured">sortuj: polecane</option>
                            <option value="price-asc">cena: rosnąco</option>
                            <option value="price-desc">cena: malejąco</option>
                        </select>
                    </div>
                </div>

                <main className="products-grid-container">
                    {isLoading ? (
                        <div className="products-loader"></div>
                    ) : displayedProducts.length > 0 ? (
                        <div className="products-grid">
                            {displayedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="products-empty-state">
                            <span className="products-empty-icon">🎸</span>
                            <h2>Brak wyników</h2>
                            <p>
                                {searchQuery
                                    ? `Nie znaleziono gitar dla frazy "${searchQuery}".`
                                    : 'Brak gitar w tej kategorii.'}
                            </p>
                        </div>
                    )}
                </main>
            </div>
            <style>{`
                .products-page-wrapper { background: #faf7f4; padding-top: 0; min-height: calc(100vh - 120px); }
                .products-header-bar { background: white; border-bottom: 0.5px solid #e8ddd4; padding: 1.25rem 1.5rem; max-width: 1120px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
                .products-header-left { display: flex; align-items: baseline; gap: 10px; }
                .products-header-left h1 { font-family: var(--font-display); font-size: 22px; font-weight: 500; }
                .products-header-left span { color: #7a6050; font-size: 14px; }
                .products-filters { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
                .products-filter-chips { display: flex; gap: 8px; }
                .products-chip { background-color: white; border: 0.5px solid #e2d4c8; color: #5c4033; border-radius: 20px; padding: 5px 13px; font-size: 12px; cursor: pointer; transition: all 0.15s; }
                .products-chip:hover { border-color: #c2410c; color: #c2410c; }
                .products-chip.active { background-color: #7c2d12; color: #fed7aa; border-color: #7c2d12; }
                .products-sort-select { background-color: white; border: 0.5px solid #e2d4c8; color: #5c4033; font-size: 12px; padding: 5px 12px; border-radius: 6px; cursor: pointer; }
                .products-grid-container { max-width: 1120px; margin: 0 auto; padding: 1.5rem; }
                .products-loader { margin: 4rem auto; width: 36px; height: 36px; border: 3px solid #e8ddd4; border-top-color: #c2410c; border-radius: 50%; animation: spin 0.7s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
                .products-empty-state { text-align: center; padding: 4rem 1rem; color: #7a6050; }
                .products-empty-icon { font-size: 48px; display: block; margin-bottom: 1rem; }
                .products-empty-state h2 { font-size: 20px; color: #3d2e1e; margin-bottom: 8px; }
                .products-empty-state p { font-size: 15px; }
            `}</style>
        </>
    );
}
