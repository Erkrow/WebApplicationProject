import { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/api';

type View = 'cart' | 'checkout' | 'success';

interface CheckoutForm {
    shippingAddress: string;
    billingAddress: string;
    couponCode: string;
    sameAddress: boolean;
}

export default function CartModal() {
    const cartContext = useContext(CartContext);
    const { isLoggedIn } = useAuth();

    const [view, setView] = useState<View>('cart');
    const [form, setForm] = useState<CheckoutForm>({
        shippingAddress: '',
        billingAddress: '',
        couponCode: '',
        sameAddress: true,
    });
    const [submitting, setSubmitting] = useState(false);
    const [orderError, setOrderError] = useState('');
    const [orderId, setOrderId] = useState<number | null>(null);

    if (!cartContext) return null;
    const { cart, removeFromCartById, getCartTotal, isCartOpen, toggleCart, clearCart } = cartContext;

    if (!isCartOpen) return null;

    const handleClose = () => {
        toggleCart();
        // Reset checkout state when closing
        setTimeout(() => { setView('cart'); setOrderError(''); }, 300);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.shippingAddress.trim()) {
            setOrderError('Podaj adres dostawy.');
            return;
        }
        setSubmitting(true);
        setOrderError('');
        try {
            const payload = {
                shippingAddress: form.shippingAddress.trim(),
                billingAddress: form.sameAddress ? form.shippingAddress.trim() : form.billingAddress.trim(),
                couponCode: form.couponCode.trim() || null,
            };
            const res = await apiClient.post('/orders', payload);
            setOrderId(res.data?.id ?? null);
            await clearCart();
            setView('success');
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 401) {
                setOrderError('Sesja wygasła. Zaloguj się ponownie.');
            } else if (status === 400) {
                setOrderError('Koszyk jest pusty lub dane są nieprawidłowe.');
            } else {
                setOrderError('Nie udało się złożyć zamówienia. Spróbuj ponownie.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="cart-overlay" onClick={handleClose} />
            <div className="cart-panel">

                {/* ── CART VIEW ─────────────────────────────── */}
                {view === 'cart' && (
                    <>
                        <div className="cart-header">
                            <span className="cart-title">twój koszyk</span>
                            <button className="cart-close-btn" onClick={handleClose}>&times;</button>
                        </div>

                        <div className="cart-items-list">
                            {cart.length === 0 ? (
                                <div className="cart-empty">
                                    <span>🎸</span>
                                    <p>Koszyk jest pusty.</p>
                                    <p className="cart-empty-sub">Dodaj produkty z katalogu.</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div className="cart-item" key={item.id}>
                                        <div className="cart-item-image">
                                            <img
                                                src={item.image || `https://placehold.co/60?text=${encodeURIComponent(item.name)}`}
                                                alt={item.name}
                                            />
                                        </div>
                                        <div className="cart-item-info">
                                            <div className="cart-item-name">{item.name}</div>
                                            {item.quantity && item.quantity > 1 && (
                                                <div className="cart-item-qty">× {item.quantity}</div>
                                            )}
                                        </div>
                                        <div className="cart-item-price">
                                            {(item.price * (item.quantity ?? 1)).toLocaleString('pl-PL')} zł
                                        </div>
                                        <button
                                            className="cart-item-remove-btn"
                                            onClick={() => removeFromCartById(item.id)}
                                            aria-label="Usuń"
                                        >&times;</button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-total-row">
                                <span>razem</span>
                                <span>{getCartTotal().toLocaleString('pl-PL')} zł</span>
                            </div>
                            {cart.length > 0 && (
                                isLoggedIn ? (
                                    <button
                                        className="cart-checkout-btn"
                                        onClick={() => { setView('checkout'); setOrderError(''); }}
                                    >
                                        Przejdź do zamówienia →
                                    </button>
                                ) : (
                                    <div className="cart-login-hint">
                                        <p>Aby złożyć zamówienie, musisz być zalogowany.</p>
                                        <a href="/login" className="cart-login-link">Zaloguj się</a>
                                    </div>
                                )
                            )}
                            <p className="cart-shipping-info">darmowa dostawa powyżej 500 zł</p>
                        </div>
                    </>
                )}

                {/* ── CHECKOUT VIEW ─────────────────────────── */}
                {view === 'checkout' && (
                    <>
                        <div className="cart-header">
                            <button className="cart-back-btn" onClick={() => setView('cart')}>← Koszyk</button>
                            <span className="cart-title">zamówienie</span>
                            <button className="cart-close-btn" onClick={handleClose}>&times;</button>
                        </div>

                        <div className="checkout-body">
                            {/* Order summary */}
                            <div className="checkout-summary">
                                {cart.map(item => (
                                    <div key={item.id} className="checkout-summary-row">
                                        <span>{item.name} {item.quantity && item.quantity > 1 ? `× ${item.quantity}` : ''}</span>
                                        <span>{(item.price * (item.quantity ?? 1)).toLocaleString('pl-PL')} zł</span>
                                    </div>
                                ))}
                                <div className="checkout-summary-total">
                                    <span>Suma</span>
                                    <span>{getCartTotal().toLocaleString('pl-PL')} zł</span>
                                </div>
                            </div>

                            <form id="checkout-form" onSubmit={handleCheckout}>
                                <div className="checkout-section-title">Adres dostawy</div>
                                <textarea
                                    id="shipping-address"
                                    name="shippingAddress"
                                    placeholder="ul. Przykładowa 1&#10;00-000 Warszawa"
                                    value={form.shippingAddress}
                                    onChange={handleFormChange}
                                    rows={3}
                                    required
                                />

                                <label className="checkout-checkbox-row">
                                    <input
                                        type="checkbox"
                                        name="sameAddress"
                                        checked={form.sameAddress}
                                        onChange={handleFormChange}
                                    />
                                    <span>Adres rozliczeniowy taki sam jak dostawy</span>
                                </label>

                                {!form.sameAddress && (
                                    <>
                                        <div className="checkout-section-title">Adres rozliczeniowy</div>
                                        <textarea
                                            id="billing-address"
                                            name="billingAddress"
                                            placeholder="ul. Przykładowa 1&#10;00-000 Warszawa"
                                            value={form.billingAddress}
                                            onChange={handleFormChange}
                                            rows={3}
                                            required
                                        />
                                    </>
                                )}

                                <div className="checkout-section-title">Kod promocyjny (opcjonalnie)</div>
                                <input
                                    id="coupon-code"
                                    type="text"
                                    name="couponCode"
                                    placeholder="np. GUITAR10"
                                    value={form.couponCode}
                                    onChange={handleFormChange}
                                />

                                {orderError && (
                                    <div className="checkout-error">{orderError}</div>
                                )}

                                <button
                                    type="submit"
                                    className="cart-checkout-btn"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Składanie zamówienia...' : `Złóż zamówienie · ${getCartTotal().toLocaleString('pl-PL')} zł`}
                                </button>
                            </form>
                        </div>
                    </>
                )}

                {/* ── SUCCESS VIEW ──────────────────────────── */}
                {view === 'success' && (
                    <>
                        <div className="cart-header">
                            <span className="cart-title">zamówiono!</span>
                            <button className="cart-close-btn" onClick={handleClose}>&times;</button>
                        </div>
                        <div className="checkout-success">
                            <div className="success-icon">✅</div>
                            <h2>Zamówienie złożone!</h2>
                            {orderId && <p className="success-id">Numer zamówienia: <strong>#{orderId}</strong></p>}
                            <p>Dziękujemy za zakup. Możesz śledzić status zamówienia w swoim profilu.</p>
                            <button className="cart-checkout-btn" onClick={handleClose}>
                                Zamknij
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .cart-panel { position: fixed; right: 0; top: 0; bottom: 0; width: 440px; background: white; display: flex; flex-direction: column; box-shadow: -4px 0 32px rgba(28,20,16,0.18); z-index: 900; }
                .cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 899; }

                /* Header */
                .cart-header { padding: 1.25rem 1.5rem; border-bottom: 0.5px solid #e8ddd4; display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-shrink: 0; }
                .cart-title { font-family: var(--font-display); font-size: 20px; }
                .cart-close-btn { background: transparent; border: none; color: #7a6050; font-size: 24px; cursor: pointer; padding: 2px 6px; }
                .cart-back-btn { background: none; border: none; color: #7a6050; font-size: 13px; cursor: pointer; padding: 4px 0; }
                .cart-back-btn:hover { color: #1c1410; }

                /* Cart Items */
                .cart-items-list { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 12px; }
                .cart-empty { text-align: center; padding: 2.5rem 1rem; color: #7a6050; }
                .cart-empty span { font-size: 40px; display: block; margin-bottom: 10px; }
                .cart-empty p { font-size: 15px; }
                .cart-empty-sub { font-size: 13px; margin-top: 4px; }
                .cart-item { display: flex; gap: 12px; align-items: center; }
                .cart-item-image { width: 60px; height: 60px; background: #fdf3ec; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .cart-item-image img { max-width: 80%; max-height: 80%; object-fit: contain; }
                .cart-item-info { flex: 1; }
                .cart-item-name { font-size: 13px; font-weight: 500; }
                .cart-item-qty { font-size: 11px; color: #7a6050; margin-top: 2px; }
                .cart-item-price { font-size: 14px; font-weight: 500; color: #c2410c; white-space: nowrap; }
                .cart-item-remove-btn { color: #a89080; background: transparent; border: none; font-size: 20px; cursor: pointer; padding: 5px; }

                /* Footer */
                .cart-footer { padding: 1.25rem 1.5rem; border-top: 0.5px solid #e8ddd4; flex-shrink: 0; }
                .cart-total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                .cart-total-row span:first-child { color: #7a6050; font-size: 13px; }
                .cart-total-row span:last-child { color: #1c1410; font-size: 18px; font-weight: 600; }
                .cart-checkout-btn { width: 100%; background: #c2410c; color: white; border: none; padding: 13px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .cart-checkout-btn:hover:not(:disabled) { background: #9a3412; }
                .cart-checkout-btn:disabled { opacity: 0.65; cursor: not-allowed; }
                .cart-shipping-info { font-size: 12px; color: #a89080; text-align: center; margin-top: 10px; }

                /* Login hint */
                .cart-login-hint { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; }
                .cart-login-hint p { font-size: 13px; color: #92400e; margin-bottom: 8px; }
                .cart-login-link { display: inline-block; background: #c2410c; color: white; padding: 6px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none; }

                /* Checkout */
                .checkout-body { flex: 1; overflow-y: auto; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0; }
                .checkout-summary { background: #faf7f4; border-radius: 8px; padding: 12px 14px; margin-bottom: 1.25rem; }
                .checkout-summary-row { display: flex; justify-content: space-between; font-size: 13px; color: #5c4033; margin-bottom: 5px; }
                .checkout-summary-total { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; color: #1c1410; border-top: 1px solid #e8ddd4; margin-top: 8px; padding-top: 8px; }
                .checkout-section-title { font-size: 11px; font-weight: 600; color: #7a6050; text-transform: uppercase; letter-spacing: 0.7px; margin: 14px 0 6px; }
                .checkout-body textarea, .checkout-body input[type="text"] { width: 100%; background: #faf7f4; border: 0.5px solid #e2d4c8; border-radius: 7px; padding: 9px 12px; font-size: 13px; color: #1c1410; box-sizing: border-box; font-family: inherit; resize: vertical; }
                .checkout-body textarea:focus, .checkout-body input:focus { outline: none; border-color: #c2410c; box-shadow: 0 0 0 2px rgba(194,65,12,0.08); }
                .checkout-checkbox-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #5c4033; cursor: pointer; margin: 10px 0; }
                .checkout-checkbox-row input[type="checkbox"] { width: 15px; height: 15px; accent-color: #c2410c; }
                .checkout-error { background: #fff1f0; border: 1px solid #fecaca; color: #c0392b; border-radius: 7px; padding: 10px 12px; font-size: 13px; margin: 10px 0; }
                #checkout-form button[type="submit"] { margin-top: 14px; }

                /* Success */
                .checkout-success { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 1.5rem; text-align: center; gap: 12px; }
                .success-icon { font-size: 56px; }
                .checkout-success h2 { font-family: var(--font-display); font-size: 22px; color: #1c1410; }
                .success-id { font-size: 14px; color: #5c4033; }
                .checkout-success p { font-size: 13px; color: #7a6050; max-width: 300px; line-height: 1.5; }
                .checkout-success .cart-checkout-btn { margin-top: 8px; }

                @media (max-width: 480px) {
                    .cart-panel { width: 100%; }
                }
            `}</style>
        </>
    );
}
