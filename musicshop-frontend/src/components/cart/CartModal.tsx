// src/components/cart/CartModal.tsx
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

export default function CartModal() {
    const cartContext = useContext(CartContext);

    if (!cartContext) return null;
    const { cart, removeFromCart, getCartTotal, isCartOpen, toggleCart, clearCart } = cartContext;

    // Jeśli koszyk jest zamknięty, nie renderujemy niczego
    if (!isCartOpen) return null;

    // Funkcja obsługująca zatwierdzenie formularza
    const handleConfirmOrder = (e: React.FormEvent) => {
        e.preventDefault(); // Zapobiega przeładowaniu strony
        
        if (cart.length === 0) {
            alert("Twój koszyk jest pusty!");
            return;
        }

        alert(`Dziękujemy za zamówienie na kwotę ${getCartTotal()} zł!`);
        clearCart(); // Czyścimy koszyk
        toggleCart(); // Zamykamy modal
    };

    return (
        <div className="modal show" onClick={toggleCart}>
            {/* Zatrzymujemy propagację kliknięcia, aby kliknięcie w sam modal go nie zamknęło */}
            <div className="modal-content cart-modal-content" onClick={e => e.stopPropagation()}>
                <span className="close-cross" onClick={toggleCart}>&times;</span>

                <div className="cart-layout">
                    {/* LEWA KOLUMNA: Lista produktów */}
                    <div className="cart-left-column">
                        <h2 className="cart-column-title">Twój Koszyk</h2>
                        <div className="cart-items-scroll">
                            {cart.length === 0 ? (
                                <p className="empty-msg">Twój koszyk jest pusty.</p>
                            ) : (
                                cart.map((item, index) => (
                                    <div className="cart-item-row" key={`${item.id}-${index}`}>
                                        <img 
                                            src={item.image || `https://placehold.co/50?text=Foto`} 
                                            alt={item.name} 
                                            className="cart-item-img" 
                                        />
                                        <div className="cart-item-info">
                                            <div className="cart-item-name">{item.name}</div>
                                            <div className="cart-item-price">{item.price} zł</div>
                                        </div>
                                        <button 
                                            className="btn-remove-small" 
                                            onClick={() => removeFromCart(index)}
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="cart-total-section">
                            Suma: <span className="total-price">{getCartTotal()} zł</span>
                        </div>
                    </div>

                    {/* PRAWA KOLUMNA: Formularz zamówienia */}
                    <div className="cart-right-column">
                        <h2 className="cart-column-title">📦 Dane do wysyłki</h2>
                        <form id="orderForm" className="checkout-form" onSubmit={handleConfirmOrder}>
                            <div className="form-group">
                                <input type="text" placeholder="Imię i nazwisko *" required />
                            </div>
                            <div className="form-group">
                                <input type="email" placeholder="Email *" required />
                            </div>
                            <div className="form-group">
                                <input type="text" placeholder="Adres (ulica, nr) *" required />
                            </div>
                            <div className="form-row-split">
                                <input type="text" placeholder="Kod pocztowy *" required />
                                <input type="text" placeholder="Miasto *" required />
                            </div>

                            <h2 className="cart-column-title mt-4">💳 Metoda płatności</h2>
                            <div className="payment-options">
                                <label className="payment-option">
                                    <input type="radio" name="payment" value="blik" defaultChecked />
                                    <span>BLIK</span>
                                </label>
                                <label className="payment-option">
                                    <input type="radio" name="payment" value="card" />
                                    <span>Karta płatnicza</span>
                                </label>
                                <label className="payment-option">
                                    <input type="radio" name="payment" value="transfer" />
                                    <span>Przelew bankowy</span>
                                </label>
                                <label className="payment-option">
                                    <input type="radio" name="payment" value="cod" />
                                    <span>Przy odbiorze</span>
                                </label>
                            </div>

                            <div className="checkout-actions">
                                <button type="submit" className="btn-checkout-confirm">✅ Zamawiam</button>
                                <button type="button" className="btn-checkout-back" onClick={toggleCart}>
                                    Wróć do sklepu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}