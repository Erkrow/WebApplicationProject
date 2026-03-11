// src/context/CartContext.tsx
import { createContext, useState, useEffect, type ReactNode } from 'react';
import { type CartItem } from '../types';

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (index: number) => void;
    getCartTotal: () => number;
    isCartOpen: boolean;
    toggleCart: () => void;
    clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    // Odczyt z localStorage zgodny z Twoim starym kodem
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('musicStoreCart');
        return saved ? JSON.parse(saved) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Zapis do localStorage przy każdej zmianie
    useEffect(() => {
        localStorage.setItem('musicStoreCart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prev) => [...prev, item]);
        alert(`✅ Dodano: ${item.name}`); // Tymczasowe powiadomienie
    };

    const removeFromCart = (index: number) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };

    const getCartTotal = () => cart.reduce((sum, item) => sum + item.price, 0); // Obliczanie sumy
    
    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, getCartTotal, isCartOpen, toggleCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}