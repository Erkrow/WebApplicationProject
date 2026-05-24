import { useContext } from 'react';
import type { Product } from '../../types';
import { CartContext } from '../../context/CartContext';
import elektryczkaImg from '../../assets/elektryczka.jpg';
interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const cartContext = useContext(CartContext);
    
    if (!cartContext) return null;
    const { addToCart } = cartContext;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
    };

    const isDiscounted = product.price < 1000; // Example discount logic
    const oldPrice = isDiscounted ? (product.price * 1.2).toFixed(2) : null;
    const discountPercentage = isDiscounted ? Math.round(((parseFloat(oldPrice!) - product.price) / parseFloat(oldPrice!)) * 100) : 0;


    return (
        <>
            <div className="pcard-container">
                <div className="pcard-image-area">
                    {isDiscounted && <div className="pcard-sale-tag">-{discountPercentage}%</div>}
                    <button className="pcard-wishlist-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="#a89080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>

                    {product.image ? (
                        <img src={product.image} alt={product.name} />
                    ) : (
                        // <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 18.25C10 18.25 10 18.9424 10.375 19.3125C10.75 19.6826 11.3375 19.75 11.3375 19.75H12.65C12.65 19.75 13.2375 19.6826 13.6125 19.3125C13.9875 18.9424 14 18.25 14 18.25V17.75H10V18.25Z" stroke="#b45309" stroke-width="1.2"/><path d="M12 2.5V3.5" stroke="#b45309" stroke-width="1.2"/><path d="M15.5 12C15.9125 11.9158 16.31 11.7519 16.68 11.515C17.775 10.825 18.5 9.6125 18.5 8.25C18.5 5.7625 16.5 4.5 12 4.5C7.5 4.5 5.5 5.7625 5.5 8.25C5.5 9.6125 6.225 10.825 7.32 11.515C7.68997 11.7519 8.08751 11.9158 8.5 12H15.5Z" stroke="#b45309" stroke-width="1.2"/><path d="M8.5 12V17.75H15.5V12" stroke="#b45309" stroke-width="1.2"/></svg>
                        <img src={elektryczkaImg} alt={product.name} />
                    )}
                </div>
                <div className="pcard-body">
                    <div className="pcard-brand">{product.brand}</div>
                    <div className="pcard-name">{product.name}</div>
                    <div className="pcard-footer">
                        <div className="pcard-price-wrapper">
                            <span className="pcard-price">{product.price.toLocaleString()} zł</span>
                            {oldPrice && <span className="pcard-old-price">{parseFloat(oldPrice).toLocaleString()} zł</span>}
                        </div>
                        <button className="pcard-add-btn" onClick={handleAddToCart}>add to cart</button>
                    </div>
                </div>
            </div>
            <style>{`
                .pcard-container { background: white; border: 0.5px solid #e8ddd4; border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.15s; }
                .pcard-container:hover { border-color: #c4a882; box-shadow: 0 4px 12px rgba(28,20,16,0.10); }
                .pcard-image-area { background: #fdf3ec; height: 155px; position: relative; display: flex; align-items: center; justify-content: center; }
                .pcard-image-area img { max-height: 80%; max-width: 80%; }
                .pcard-sale-tag { position: absolute; top: 10px; left: 10px; background: #c2410c; color: white; font-size: 10px; font-weight: 600; padding: 3px 7px; border-radius: 4px; }
                .pcard-wishlist-btn { position: absolute; top: 8px; right: 8px; background: white; border: 0.5px solid #e2d4c8; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                .pcard-wishlist-btn:hover { background: #faf7f4; border-color: #c4a882; }
                .pcard-body { padding: 12px 14px 14px; }
                .pcard-brand { font-size: 11px; color: #a89080; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 3px; }
                .pcard-name { font-size: 14px; font-weight: 500; color: #1c1410; line-height: 1.3; margin-bottom: 10px; }
                .pcard-footer { display: flex; justify-content: space-between; align-items: center; }
                .pcard-price-wrapper { display: flex; align-items: baseline; }
                .pcard-price { font-size: 16px; font-weight: 500; color: #c2410c; }
                .pcard-old-price { font-size: 12px; color: #a89080; text-decoration: line-through; margin-left: 5px; }
                .pcard-add-btn { background: #7c2d12; color: white; border: none; border-radius: 6px; padding: 6px 13px; font-size: 12px; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
                .pcard-add-btn:hover { background: #c2410c; }
            `}</style>
        </>
    );
}
