// src/data/products.ts
import type { Product } from '../types';

export const productsData: Product[] = [
    // Keyboardy
    { id: 1, name: 'Yamaha PSR E283', brand: 'Yamaha', type: 'Bez dynamiki', price: 550, specs: 'Model: PSR E283', desc: 'Keyboard przeznaczony dla dzieci.', image: 'images/yamaha-psr-e283.jpg', category: 'keyboardy' },
    { id: 3, name: 'Yamaha PSR SX600', brand: 'Yamaha', type: 'Dynamiczna', price: 2899, specs: 'Model: PSR SX600', desc: 'Profesjonalny keyboard.', image: 'images/yamaha-psr-sx600.jpg', category: 'keyboardy' },
    { id: 4, name: 'Korg EK 50', brand: 'Korg', type: 'Dynamiczna', price: 1600, specs: 'Model: EK 50', desc: 'Przystępny cenowo aranżer.', image: 'images/korg-ek-50.jpg', category: 'keyboardy' },
    
    // Fortepiany
    { id: 101, name: 'Yamaha GB1K PE', brand: 'Yamaha', type: 'Pianino', price: 52000, specs: 'Długość: 151 cm', desc: 'Akustyczny fortepian typu baby grand.', image: 'images/yamaha-gb1k-pe.jpg', category: 'fortepiany' },
    { id: 102, name: 'Kawai GL10 WH', brand: 'Kawai', type: 'Pianino', price: 51000, specs: 'Długość: 150 cm', desc: 'Przystępny cenowo fortepian.', image: 'images/kawai-gl-10-wh.jpg', category: 'fortepiany' },

    // Gitary
    { id: 201, name: 'Telecaster Standard', brand: 'Fender', type: 'Telecaster', price: 2499, specs: 'Model: Standard', desc: 'Klasyczna Telecaster.', image: 'images/telecaster_fender.jpg', category: 'gitary' },
];