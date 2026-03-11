// src/components/ui/ProductCard.tsx
import { useContext } from 'react';
import type { Product } from '../../types';
import { CartContext } from '../../context/CartContext';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const cartContext = useContext(CartContext);
    
    if (!cartContext) return null;
    const { addToCart } = cartContext;

    // Funkcja wywoływana po kliknięciu "Dodaj do koszyka"
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Zapobiega przeładowaniu/przejściu do linku
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
    };

    return (
        <div className="product-card">
            {/* Placeholder dla linku do detali - na razie prowadzi do pustego href */}
            <a href={`/produkt/${product.id}`} className="product-card-link">
                <div className="product-image-container">
                    {/* Używamy placeholdera w razie braku poprawnego linku do obrazka */}
                    <img 
                        src={product.image || `https://placehold.co/200?text=${product.name}`} 
                        alt={product.name} 
                        loading="lazy" 
                    />
                    {product.price < 1000 && <div className="badge">Okazja</div>}
                </div>
                <div className="product-info-top">
                    <div className="product-name">{product.name}</div>
                    <div className="product-description">{product.brand} - {product.type}</div>
                </div>
            </a>
            <div className="product-footer">
                <span className="product-price">{product.price.toLocaleString()} zł</span>
                <button className="btn-add" onClick={handleAddToCart}>
                    Dodaj do koszyka
                </button>
            </div>
        </div>
    );
}