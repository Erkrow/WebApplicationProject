// src/services/api.ts
import axios from 'axios';
import type { Product } from '../types';

// Set up the base URL for your Spring Boot server (default is usually 8080)
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to fetch products from the database via Spring Boot
export const fetchProductsFromDB = async (): Promise<Product[]> => {
    try {
        const response = await apiClient.get('/products');

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

// Function to send an order (requires JWT token later)
export const submitOrderToDB = async (orderData: any) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
};