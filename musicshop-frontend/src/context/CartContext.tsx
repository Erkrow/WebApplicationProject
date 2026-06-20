import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type CartItem } from '../types';
import apiClient from '../services/api';

interface BackendCartItem {
    id: number;
    product: {
        id: number;
        name: string;
        price: number;
        image: string;
        brand: string;
        category: string;
    };
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (index: number) => void;
    removeFromCartById: (productId: number) => void;
    getCartTotal: () => number;
    isCartOpen: boolean;
    toggleCart: () => void;
    clearCart: () => void;
    reloadCart: () => void;
    cartItemCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

function isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt_token');
}

// Konwertuje odpowiedź backendu (Cart entity) na CartItem[]
function mapBackendCart(data: { cartItems?: BackendCartItem[] }): CartItem[] {
    if (!data?.cartItems) return [];
    return data.cartItems.map((ci: BackendCartItem) => ({
        id: ci.product.id,
        name: ci.product.name,
        price: ci.product.price,
        image: ci.product.image,
        quantity: ci.quantity,
    }));
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (isLoggedIn()) return []; // backend is source of truth when logged in
        const saved = localStorage.getItem('musicStoreCart');
        return saved ? JSON.parse(saved) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    // Zapis do localStorage tylko dla gości (niezalogowanych)
    useEffect(() => {
        if (!isLoggedIn()) {
            localStorage.setItem('musicStoreCart', JSON.stringify(cart));
        }
    }, [cart]);

    // Auto-ukrycie toastu po 2.5 sekundy
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2500);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Załaduj koszyk z backendu gdy zalogowany
    const reloadCart = useCallback(async () => {
        if (!isLoggedIn()) return;
        try {
            const res = await apiClient.get('/cart');
            setCart(mapBackendCart(res.data));
        } catch {
            // Brak tokena lub błąd — zostaw pusty
        }
    }, []);

    // Ładuj przy starcie jeśli zalogowany
    useEffect(() => {
        reloadCart();
    }, [reloadCart]);

    const addToCart = useCallback(async (item: CartItem) => {
        if (isLoggedIn()) {
            try {
                const res = await apiClient.post(`/cart/add?productId=${item.id}&quantity=1`);
                setCart(mapBackendCart(res.data));
                setToast(`✅ Dodano do koszyka: ${item.name}`);
            } catch {
                setToast('❌ Nie udało się dodać do koszyka. Spróbuj ponownie.');
            }
        } else {
            setCart(prev => [...prev, item]);
            setToast(`✅ Dodano do koszyka: ${item.name}`);
        }
    }, []);

    const removeFromCartById = useCallback(async (productId: number) => {
        if (isLoggedIn()) {
            try {
                const res = await apiClient.delete(`/cart/remove/${productId}`);
                setCart(mapBackendCart(res.data));
            } catch {
                setToast('❌ Nie udało się usunąć produktu.');
            }
        } else {
            setCart(prev => {
                const idx = prev.findIndex(i => i.id === productId);
                if (idx === -1) return prev;
                return prev.filter((_, i) => i !== idx);
            });
        }
    }, []);

    // Usuwa po indeksie (używane przez starszy kod, mapuje do removeFromCartById)
    const removeFromCart = useCallback((index: number) => {
        setCart(prev => {
            const item = prev[index];
            if (!item) return prev;
            removeFromCartById(item.id);
            return prev.filter((_, i) => i !== index);
        });
    }, [removeFromCartById]);

    const getCartTotal = () => cart.reduce((sum, item) => sum + (item.price * (item.quantity ?? 1)), 0);

    const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

    const toggleCart = () => setIsCartOpen(prev => !prev);

    const clearCart = useCallback(async () => {
        setCart([]);
        if (isLoggedIn()) {
            try { await apiClient.delete('/cart/clear'); } catch { /* ignore */ }
        } else {
            localStorage.removeItem('musicStoreCart');
        }
    }, []);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, removeFromCartById,
            getCartTotal, isCartOpen, toggleCart, clearCart,
            reloadCart, cartItemCount,
        }}>
            {children}
            {/* Toast notification */}
            {toast && (
                <>
                    <div className="cart-toast">{toast}</div>
                    <style>{`
                        .cart-toast {
                            position: fixed;
                            bottom: 24px;
                            right: 24px;
                            background: #1c1410;
                            color: #f5f0eb;
                            border: 1px solid #3d2e1e;
                            border-left: 3px solid #c2410c;
                            padding: 12px 18px;
                            border-radius: 8px;
                            font-size: 14px;
                            z-index: 9999;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                            animation: toast-in 0.25s ease;
                        }
                        @keyframes toast-in {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                </>
            )}
        </CartContext.Provider>
    );
}
