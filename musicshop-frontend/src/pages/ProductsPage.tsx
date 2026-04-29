import { useState, useEffect, useMemo } from 'react';
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

    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            const data = await fetchProductsFromDB();
            setDbProducts(data);
            setIsLoading(false);
        };
        loadProducts();
    }, []);

    const categoryProducts = useMemo(() => {
        if (category === 'all') return dbProducts;
        return dbProducts.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    }, [dbProducts, category]);

    const displayedProducts = useMemo(() => {
        const sorted = [...categoryProducts];
        if (sortOrder === 'price-asc') sorted.sort((a, b) => a.price - b.price);
        if (sortOrder === 'price-desc') sorted.sort((a, b) => b.price - a.price);
        return sorted;
    }, [categoryProducts, sortOrder]);

    const categoryTitle = category === 'all' ? 'All Instruments' : `${category.charAt(0).toUpperCase() + category.slice(1)}`;

    return (
        <>
            <div className="products-page-wrapper">
                <div className="products-header-bar">
                    <div className="products-header-left">
                        <h1>{categoryTitle}</h1>
                        <span>{displayedProducts.length} products</span>
                    </div>
                    <div className="products-filters">
                         <div className="products-filter-chips">
                            <button className="products-chip active">all</button>
                            <button className="products-chip">in stock</button>
                            <button className="products-chip">on sale</button>
                        </div>
                        <select className="products-sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="featured">sort: featured</option>
                            <option value="price-asc">price low–high</option>
                            <option value="price-desc">price high–low</option>
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
                        <p className="products-empty-message">No products found in this category.</p>
                    )}
                </main>
            </div>
            <style>{`
                .products-page-wrapper { background: #faf7f4; padding-top: 0; }
                .products-header-bar { background: white; border-bottom: 0.5px solid #e8ddd4; padding: 1.25rem 1.5rem; max-width: 1120px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
                .products-header-left { display: flex; align-items: baseline; gap: 10px; }
                .products-header-left h1 { font-family: var(--font-display); font-size: 22px; font-weight: 500; }
                .products-header-left span { color: #7a6050; font-size: 14px; }
                .products-filters { display: flex; align-items: center; gap: 10px; }
                .products-filter-chips { display: flex; gap: 8px; }
                .products-chip { background-color: white; border: 0.5px solid #e2d4c8; color: #5c4033; border-radius: 20px; padding: 5px 13px; font-size: 12px; cursor: pointer; }
                .products-chip.active { background-color: #7c2d12; color: #fed7aa; border-color: #7c2d12; }
                .products-sort-select { background-color: white; border: 0.5px solid #e2d4c8; color: #5c4033; font-size: 12px; padding: 5px 12px; border-radius: 6px; }
                
                .products-grid-container { max-width: 1120px; margin: 0 auto; padding: 1.5rem; }
                .products-loader {
                    margin: 4rem auto;
                    width: 36px; height: 36px;
                    border: 3px solid #e8ddd4; 
                    border-top-color: #c2410c; 
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                
                .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
                .products-empty-message { text-align: center; font-size: 15px; color: #7a6050; margin-top: 4rem; }
            `}</style>
        </>
    );
}
