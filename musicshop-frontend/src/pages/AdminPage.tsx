import { useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
    const [formData, setFormData] = useState({
        name: '', 
        brand: '', 
        type: '', 
        price: '', 
        specs: '', 
        desc: '', 
        image: '', 
        category: '',
        stockQuantity: 10, // Domyślna wartość
    });
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt_token');
        try {
            const productData = {
                ...formData,
                description: formData.desc,
                imageUrl: formData.image,
            };
            await axios.post('http://localhost:8080/api/products', productData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage('✅ Product added successfully!');
            setFormData({ 
                name: '', 
                brand: '', 
                type: '', 
                price: '', 
                specs: '', 
                desc: '', 
                image: '', 
                category: '', 
                stockQuantity: 10 
            });
        } catch (error) {
            console.error(error);
            setMessage('❌ Error adding product.');
        }
    };

    return (
        <>
            <div className="admin-page-container">
                <div className="admin-content">
                    <h1>Admin Panel</h1>
                    <p className="admin-subtitle">Add a new product to the store catalog.</p>

                    <form onSubmit={handleSubmit} className="admin-form-card">
                        {message && <div className="admin-message">{message}</div>}

                        <div className="admin-form-section">
                            <div className="admin-section-header">Core Information</div>
                            <div className="admin-grid-2-col">
                                <div>
                                    <label htmlFor="name">Product Name</label>
                                    <input type="text" name="name" id="name" placeholder="e.g., Stratocaster" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label htmlFor="brand">Brand</label>
                                    <input type="text" name="brand" id="brand" placeholder="e.g., Fender" value={formData.brand} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="admin-grid-3-col">
                               <div>
                                    <label htmlFor="price">Price (zł)</label>
                                    <input type="number" name="price" id="price" placeholder="e.g., 3500" value={formData.price} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label htmlFor="category">Category</label>
                                    <select name="category" id="category" value={formData.category} onChange={handleChange} required>
                                        <option value="guitars">Guitars</option>
                                        <option value="pianos">Pianos</option>
                                        <option value="keyboards">Keyboards</option>
                                        <option value="accessories">Accessories</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="type">Type</label>
                                    <input type="text" name="type" id="type" placeholder="e.g., Electric Guitar" value={formData.type} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="admin-form-section">
                            <div className="admin-section-header">Details & Media</div>
                            <div>
                                <label htmlFor="desc">Description</label>
                                <textarea name="desc" id="desc" placeholder="Product description..." value={formData.desc} onChange={handleChange} required rows={4} />
                            </div>
                             <div>
                                <label htmlFor="specs">Specifications</label>
                                <input type="text" name="specs" id="specs" placeholder="e.g., SSS pickup configuration" value={formData.specs} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor="image">Image URL</label>
                                <input type="text" name="image" id="image" placeholder="e.g., /images/strat.jpg" value={formData.image} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor="stockQuantity">Stock Quantity</label>
                                <input type="number" name="stockQuantity" id="stockQuantity" placeholder="e.g., 10" value={formData.stockQuantity} onChange={handleChange} required />
                            </div>
                        </div>

                        <button type="submit" className="admin-submit-btn">Add Product</button>
                    </form>
                </div>
            </div>
            <style>{`
                .admin-page-container { background-color: #faf7f4; padding: 2rem; }
                .admin-content { max-width: 700px; margin: 0 auto; }
                .admin-content h1 { font-family: var(--font-display); font-size: 28px; font-weight: 500; color: #1c1410; margin-bottom: 0.5rem; }
                .admin-subtitle { font-size: 14px; color: #7a6050; margin-bottom: 2rem; }
                .admin-form-card { background: white; border: 0.5px solid #e8ddd4; border-radius: 14px; padding: 2rem; }
                .admin-message { margin-bottom: 1rem; text-align: center; font-weight: 500; }
                .admin-form-section { margin-bottom: 1.5rem; }
                .admin-section-header { font-size: 13px; font-weight: 600; color: #7a6050; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 1rem; margin-top: 1.5rem; border-top: 1px solid #e8ddd4; padding-top: 1.5rem; }
                .admin-form-section:first-of-type .admin-section-header { border-top: none; padding-top: 0; margin-top: 0; }
                .admin-grid-2-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                .admin-grid-3-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-top: 14px; }
                form label { font-size: 13px; font-weight: 500; color: #5c4033; margin-bottom: 5px; display: block; }
                form input, form select, form textarea { width: 100%; background: #faf7f4; border: 0.5px solid #e2d4c8; border-radius: 8px; padding: 10px 14px; font-size: 14px; color: #1c1410; margin-bottom: 14px; }
                form input:focus, form select:focus, form textarea:focus { outline: none; border-color: #c2410c; }
                .admin-submit-btn { width: 100%; background: #c2410c; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: 500; margin-top: 6px; cursor: pointer; }
            `}</style>
        </>
    );
}
