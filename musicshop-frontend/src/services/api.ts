import axios from 'axios';
import type { Product } from '../types';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor — automatycznie dolacza JWT token do kazdego zadania
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Pobieranie produktow z opcjonalnym filtrowaniem po stronie backendu
export const fetchProductsFromDB = async (
    category?: string,
    search?: string
): Promise<Product[]> => {
    try {
        const params: Record<string, string> = {};
        if (category) params.category = category;
        if (search) params.search = search;

        const response = await apiClient.get('/products', { params });

        if (!Array.isArray(response.data)) {
            console.error("Expected array, got:", response.data);
            return [];
        }

        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

// Pobieranie pojedynczego produktu
export const fetchProductById = async (id: number): Promise<Product | null> => {
    try {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
};

// ADMIN — dodawanie produktu
export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post('/products', productData);
    return response.data;
};

// ADMIN — edycja produktu
export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
};

// ADMIN — usuniecie produktu
export const deleteProduct = async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
};

// Pobieranie kategorii
export const fetchCategories = async (): Promise<string[]> => {
    try {
        const response = await apiClient.get('/categories');
        return response.data;
    } catch {
        return [];
    }
};

// Skladanie zamowienia
export const submitOrderToDB = async (orderData: unknown) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
};

export default apiClient;