import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

export default function CartModal() {
    const cartContext = useContext(CartContext);

    if (!cartContext) return null;
    const { cart, removeFromCart, getCartTotal, isCartOpen, toggleCart } = cartContext;

    if (!isCartOpen) return null;

    return (
        <>
            <div className="cart-overlay" onClick={toggleCart}></div>
            <div className="cart-panel">
                <div className="cart-header">
                    <span className="cart-title">your cart</span>
                    <button className="cart-close-btn" onClick={toggleCart}>&times;</button>
                </div>
                
                <div className="cart-items-list">
                    {cart.length === 0 ? (
                        <p className="cart-empty-message">Your cart is empty.</p>
                    ) : (
                        cart.map((item, index) => (
                            <div className="cart-item" key={`${item.id}-${index}`}>
                                <div className="cart-item-image">
                                    <img src={item.image || `https://placehold.co/60?text=${item.name}`} alt={item.name} />
                                </div>
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.name}</div>
                                </div>
                                <div className="cart-item-price">{item.price.toLocaleString()} zł</div>
                                <button className="cart-item-remove-btn" onClick={() => removeFromCart(index)}>&times;</button>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-total-row">
                        <span>total</span>
                        <span>{getCartTotal().toLocaleString()} zł</span>
                    </div>
                    <button className="cart-checkout-btn">go to checkout</button>
                    <p className="cart-shipping-info">free shipping on orders over 500 zł</p>
                </div>
            </div>
            <style>{`
                .cart-overlay { position: fixed; inset: 0; background: rgba(28,20,16,0.6); backdrop-filter: blur(2px); z-index: 1000; }
                .cart-panel { position: fixed; right: 0; top: 0; bottom: 0; width: 420px; background: white; display: flex; flex-direction: column; box-shadow: -4px 0 24px rgba(28,20,16,0.15); }
                .cart-header { padding: 1.25rem 1.5rem; border-bottom: 0.5px solid #e8ddd4; display: flex; justify-content: space-between; align-items: center; }
                .cart-title { font-family: var(--font-display); font-size: 20px; }
                .cart-close-btn { background: transparent; border: none; color: #7a6050; font-size: 24px; cursor: pointer; }
                .cart-items-list { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 12px; }
                .cart-empty-message { text-align: center; color: #7a6050; margin-top: 2rem; }
                .cart-item { display: flex; gap: 12px; align-items: center; }
                .cart-item-image { width: 60px; height: 60px; background: #fdf3ec; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .cart-item-image img { max-width: 80%; max-height: 80%; }
                .cart-item-info { flex: 1; }
                .cart-item-name { font-size: 14px; font-weight: 500; }
                .cart-item-brand { font-size: 12px; color: #7a6050; }
                .cart-item-price { font-size: 15px; font-weight: 500; color: #c2410c; }
                .cart-item-remove-btn { color: #a89080; background: transparent; border: none; font-size: 20px; cursor: pointer; padding: 5px; }
                .cart-footer { padding: 1.25rem 1.5rem; border-top: 0.5px solid #e8ddd4; }
                .cart-total-row { display: flex; justify-content: space-between; align-items: center; }
                .cart-total-row span:first-child { color: #7a6050; font-size: 14px; }
                .cart-total-row span:last-child { color: #1c1410; font-size: 18px; font-weight: 500; }
                .cart-checkout-btn { width: 100%; background: #c2410c; color: white; border: none; padding: 13px; border-radius: 8px; font-size: 15px; font-weight: 500; margin-top: 12px; cursor: pointer; }
                .cart-shipping-info { font-size: 12px; color: #a89080; text-align: center; margin-top: 10px; }
            `}</style>
        </>
    );
}
