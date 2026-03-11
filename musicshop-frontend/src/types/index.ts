// src/types/index.ts
export interface Product {
    id: number;
    name: string;
    brand: string;
    type: string;
    price: number;
    specs: string;
    desc: string;
    image: string;
    category: string;
}

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
}