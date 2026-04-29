import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProductsFromDB } from '../services/api';
import type { Product } from '../types';
import ProductCard from '../components/ui/ProductCard';

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            const fetchedProducts = await fetchProductsFromDB();
            setProducts(fetchedProducts);
        };
        loadProducts();
    }, []);

    return (
        <>
            <div className="home-hero-bg">
                <div className="home-hero-content">
                    <div className="home-hero-left">
                        <div className="home-hero-tag">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.06894 1.13563L6.99998 0.20459L7.93103 1.13563L10.0383 1.48782L10.635 2.5861L12.0838 3.12593L12.2359 4.3496L13.5186 5.10959L13.3361 6.35622L13.7954 7.5L13.3361 8.64378L13.5186 9.89041L12.2359 10.6504L12.0838 11.8741L10.635 12.4139L10.0383 13.5122L7.93103 13.8644L6.99998 14.7954L6.06894 13.8644L3.96169 13.5122L3.36501 12.4139L1.91622 11.8741L1.76406 10.6504L0.481397 9.89041L0.663857 8.64378L0.20459 7.5L0.663857 6.35622L0.481397 5.10959L1.76406 4.3496L1.91622 3.12593L3.36501 2.5861L3.96169 1.48782L6.06894 1.13563Z" fill="#f97316"/></svg>
                            <span>spring sale — up to 30% off</span>
                        </div>
                        <h1>The right instrument,<br/><em style={{color:'#f97316',fontStyle:'normal'}}>ready to buy.</em></h1>
                        <p>Premium guitars, pianos, and keyboards. Fast checkout, free shipping over 500 zł, and 30-day returns.</p>
                        <div className="home-hero-buttons">
                            <Link to="/products/all" className="home-hero-btn-primary">shop now</Link>
                            <Link to="/products/sale" className="home-hero-btn-secondary">view sale items</Link>
                        </div>
                        <div className="home-hero-stats">
                            <div className="home-hero-stat"><span>2,400+</span><span>products</span></div>
                            <div className="home-hero-stat"><span>48h</span><span>avg. delivery</span></div>
                            <div className="home-hero-stat"><span>4.9★</span><span>customer rating</span></div>
                        </div>
                    </div>
                    <div className="home-deal-card">
                        <div className="home-deal-image">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 18.25C10 18.25 10 18.9424 10.375 19.3125C10.75 19.6826 11.3375 19.75 11.3375 19.75H12.65C12.65 19.75 13.2375 19.6826 13.6125 19.3125C13.9875 18.9424 14 18.25 14 18.25V17.75H10V18.25Z" stroke="#6b5744" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2.5V3.5" stroke="#6b5744" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.5 12C15.9125 11.9158 16.31 11.7519 16.68 11.515C17.775 10.825 18.5 9.6125 18.5 8.25C18.5 5.7625 16.5 4.5 12 4.5C7.5 4.5 5.5 5.7625 5.5 8.25C5.5 9.6125 6.225 10.825 7.32 11.515C7.68997 11.7519 8.08751 11.9158 8.5 12H15.5Z" stroke="#6b5744" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.5 12V17.75H15.5V12" stroke="#6b5744" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div className="home-deal-tag">deal of the day</div>
                        <div className="home-deal-name">Fender Stratocaster</div>
                        <div className="home-deal-desc">American Professional II · Sunburst</div>
                        <div className="home-deal-footer">
                            <div className="home-deal-price">7 499 zł</div>
                            <button className="home-deal-btn">buy now</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <section className="home-trust-bar">
                    <div className="home-trust-item">
                         <div className="home-trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21C12 21 16.5 17.8571 16.5 12.4286C16.5 7 12 4 12 4C12 4 7.5 7 7.5 12.4286C7.5 17.8571 12 21 12 21Z" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.5 12H20.5" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                        <div>
                            <div className="home-trust-title">free shipping</div>
                            <div className="home-trust-desc">orders over 500 zł</div>
                        </div>
                    </div>
                    <div className="home-trust-item">
                        <div className="home-trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5L12 3L21 9.5V20.5H3V9.5Z" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 16H14" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                        <div>
                            <div className="home-trust-title">30-day returns</div>
                            <div className="home-trust-desc">no questions asked</div>
                        </div>
                    </div>
                    <div className="home-trust-item">
                         <div className="home-trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.6455C12 21.6455 4 18.6455 4 12.6455V5.64551L12 2.64551L20 5.64551V12.6455C20 18.6455 12 21.6455 12 21.6455Z" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                        <div>
                            <div className="home-trust-title">secure checkout</div>
                            <div className="home-trust-desc">SSL encrypted payments</div>
                        </div>
                    </div>
                </section>

                <section className="home-featured-products">
                    <div className="home-section-header">
                        <h2>featured instruments</h2>
                        <Link to="/products/all">view all →</Link>
                    </div>
                    <div className="home-filters">
                        <span className="home-filter-label">filter:</span>
                        <div className="home-filter-chips">
                            <button className="home-chip active">all</button>
                            <button className="home-chip">in stock</button>
                            <button className="home-chip">on sale</button>
                            <button className="home-chip">under 3 000 zł</button>
                        </div>
                        <select className="home-sort-select">
                            <option>sort: featured</option>
                            <option>price low–high</option>
                            <option>price high–low</option>
                        </select>
                    </div>
                    <div className="home-products-grid">
                        {products.slice(0, 8).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                <section className="home-custom-order-banner">
                    <div>
                        <h2>Can't find what you're looking for?</h2>
                        <p>We source custom instruments on request — usually within 2 weeks.</p>
                    </div>
                    <button>request a custom order</button>
                </section>
            </div>
            <style>{`
                .home-hero-bg { background-color: #1c1410; padding: 3rem 2rem; }
                .home-hero-content { display: flex; flex-direction: row; gap: 2rem; max-width: 1120px; margin: 0 auto; }
                .home-hero-left { flex: 1; }
                .home-hero-tag { display: inline-flex; align-items: center; gap: 8px; background-color: rgba(194,65,12,0.15); border: 0.5px solid rgba(249,115,22,0.3); color: #fb923c; padding: 5px 12px; border-radius: 50px; font-size: 13px; font-weight: 500; }
                .home-hero-left h1 { color: #f5f0eb; font-family: var(--font-display); font-size: 34px; font-weight: 500; line-height: 1.2; margin-top: 1rem; margin-bottom: 0.75rem; }
                .home-hero-left p { color: #6b5744; font-size: 14px; line-height: 1.7; max-width: 380px; margin-bottom: 1.5rem; }
                .home-hero-buttons { display: flex; gap: 12px; }
                .home-hero-btn-primary { background-color: #c2410c; color: white; padding: 11px 28px; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none; }
                .home-hero-btn-secondary { background-color: transparent; border: 0.5px solid #3d2e1e; color: #a89080; padding: 11px 22px; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none; }
                .home-hero-stats { display: flex; gap: 2rem; margin-top: 2rem; }
                .home-hero-stat { display: flex; flex-direction: column; }
                .home-hero-stat span:first-child { color: #f5f0eb; font-size: 22px; font-weight: 500; }
                .home-hero-stat span:last-child { color: #6b5744; font-size: 12px; }

                .home-deal-card { background-color: #241a10; border: 0.5px solid #3d2e1e; border-radius: 16px; padding: 1.5rem; width: 260px; flex-shrink: 0; display: flex; flex-direction: column; gap: 10px; }
                .home-deal-image { background-color: #2c2018; border-radius: 10px; height: 140px; display: grid; place-items: center; }
                .home-deal-tag { background-color: rgba(194,65,12,0.2); color: #fb923c; padding: 4px 10px; border-radius: 50px; font-size: 11px; font-weight: 500; width: max-content; }
                .home-deal-name { color: #f5f0eb; font-size: 15px; font-weight: 500; }
                .home-deal-desc { color: #6b5744; font-size: 12px; margin-top: -5px; }
                .home-deal-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 5px; }
                .home-deal-price { color: #f97316; font-size: 20px; font-weight: 500; }
                .home-deal-btn { background-color: #c2410c; color: white; border: none; border-radius: 6px; padding: 8px 14px; font-size: 13px; font-weight: 500; cursor: pointer; }

                .main-content { padding-top: 0; } /* Reset padding from App.css */
                .home-trust-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 2rem; }
                .home-trust-item { background: white; border: 0.5px solid #e8ddd4; border-radius: 10px; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 12px; }
                .home-trust-icon { width: 36px; height: 36px; background: #fdf3ec; border-radius: 8px; display: grid; place-items: center; flex-shrink: 0; }
                .home-trust-title { font-size: 13px; font-weight: 500; color: #1c1410; }
                .home-trust-desc { font-size: 12px; color: #7a6050; }

                .home-featured-products { padding: 2rem; }
                .home-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .home-section-header h2 { font-size: 16px; font-weight: 500; }
                .home-section-header a { color: #c2410c; font-size: 13px; font-weight: 500; text-decoration: none; }
                .home-filters { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
                .home-filter-label { font-size: 13px; color: #7a6050; }
                .home-filter-chips { display: flex; gap: 8px; flex: 1; }
                .home-chip { background-color: white; border: 0.5px solid #e2d4c8; color: #5c4033; border-radius: 20px; padding: 5px 13px; font-size: 12px; cursor: pointer; }
                .home-chip.active { background-color: #7c2d12; color: #fed7aa; border-color: #7c2d12; }
                .home-sort-select { background-color: white; border: 0.5px solid #e2d4c8; color: #5c4033; font-size: 12px; padding: 5px 12px; border-radius: 6px; }
                .home-products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }

                .home-custom-order-banner { background-color: #7c2d12; border-radius: 12px; padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center; margin: 2rem}
                .home-custom-order-banner h2 { color: white; font-size: 18px; font-weight: 500; margin: 0 0 4px 0; }
                .home-custom-order-banner p { color: #fca882; font-size: 13px; margin: 0; max-width: 320px; }
                .home-custom-order-banner button { background-color: white; color: #7c2d12; border: none; padding: 10px 22px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; }
            `}</style>
        </>
    );
}