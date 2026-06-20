import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import type { Product } from '../types';

const EMPTY_FORM = {
    name: '', brand: '', type: '', price: '', specs: '',
    desc: '', image: '', category: '', stockQuantity: 10,
};

type Tab = 'add' | 'manage';

// ── Edit Modal ───────────────────────────────────────────
interface EditModalProps {
    product: Product;
    categories: string[];
    onClose: () => void;
    onSaved: (updated: Product) => void;
}

function EditModal({ product, categories, onClose, onSaved }: EditModalProps) {
    const [form, setForm] = useState({
        name: product.name ?? '',
        brand: product.brand ?? '',
        type: product.type ?? '',
        price: String(product.price ?? ''),
        specs: product.specs ?? '',
        desc: (product as unknown as { desc?: string }).desc ?? '',
        image: product.image ?? '',
        category: product.category ?? '',
        stockQuantity: product.stockQuantity ?? 0,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = {
                name: form.name, brand: form.brand, type: form.type,
                price: Number(form.price), specs: form.specs,
                description: form.desc, imageUrl: form.image,
                category: form.category,
                stockQuantity: Number(form.stockQuantity),
            };
            const res = await apiClient.put(`/products/${product.id}`, payload);
            onSaved(res.data);
        } catch {
            setError('Błąd zapisu. Spróbuj ponownie.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edytuj gitarę</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Zamknij">✕</button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSave} className="modal-form">
                    <div className="modal-grid-2">
                        <div>
                            <label htmlFor="edit-name">Nazwa</label>
                            <input id="edit-name" name="name" value={form.name} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="edit-brand">Marka</label>
                            <input id="edit-brand" name="brand" value={form.brand} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="modal-grid-3">
                        <div>
                            <label htmlFor="edit-price">Cena (zł)</label>
                            <input id="edit-price" name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="0.01" />
                        </div>
                        <div>
                            <label htmlFor="edit-category">Kategoria</label>
                            <select id="edit-category" name="category" value={form.category} onChange={handleChange} required>
                                <option value="" disabled>-- Wybierz --</option>
                                {categories.map(c => (
                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="edit-stock">Stan magazynowy</label>
                            <input id="edit-stock" name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} min="0" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="edit-type">Typ</label>
                        <input id="edit-type" name="type" value={form.type} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="edit-desc">Opis</label>
                        <textarea id="edit-desc" name="desc" value={form.desc} onChange={handleChange} rows={3} />
                    </div>
                    <div>
                        <label htmlFor="edit-specs">Specyfikacja</label>
                        <input id="edit-specs" name="specs" value={form.specs} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="edit-image">URL zdjęcia</label>
                        <input id="edit-image" name="image" value={form.image} onChange={handleChange} />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Anuluj</button>
                        <button type="submit" className="btn-save" disabled={saving}>
                            {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Delete confirmation ──────────────────────────────────
interface DeleteModalProps {
    productName: string;
    onConfirm: () => void;
    onCancel: () => void;
}
function DeleteModal({ productName, onConfirm, onCancel }: DeleteModalProps) {
    return (
        <div className="modal-backdrop" onClick={onCancel}>
            <div className="modal-box modal-box--sm" onClick={e => e.stopPropagation()}>
                <h2>Usuń produkt</h2>
                <p>Czy na pewno chcesz usunąć <strong>{productName}</strong>? Tej operacji nie można cofnąć.</p>
                <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                    <button className="btn-cancel" onClick={onCancel}>Anuluj</button>
                    <button className="btn-delete-confirm" onClick={onConfirm}>Usuń</button>
                </div>
            </div>
        </div>
    );
}

// ── Main AdminPage ───────────────────────────────────────
export default function AdminPage() {
    const [tab, setTab] = useState<Tab>('add');

    // --- Add product state ---
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [addMsg, setAddMsg] = useState('');
    const [addError, setAddError] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [loadingCats, setLoadingCats] = useState(true);

    // --- Manage products state ---
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const [editTarget, setEditTarget] = useState<Product | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [toast, setToast] = useState('');

    // Load categories once
    useEffect(() => {
        apiClient.get('/categories').then(r => {
            const cats: string[] = r.data;
            setCategories(cats);
            if (cats.length > 0) setFormData(prev => ({ ...prev, category: cats[0] }));
        }).catch(() => {}).finally(() => setLoadingCats(false));
    }, []);

    // Load products when "Manage" tab is active
    useEffect(() => {
        if (tab === 'manage') {
            setLoadingProducts(true);
            apiClient.get('/products').then(r => setProducts(r.data))
                .catch(() => {})
                .finally(() => setLoadingProducts(false));
        }
    }, [tab]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    // Add product
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category) { setAddMsg('Wybierz kategorię.'); setAddError(true); return; }
        try {
            await apiClient.post('/products', {
                name: formData.name, brand: formData.brand, type: formData.type,
                price: Number(formData.price), specs: formData.specs,
                description: formData.desc, imageUrl: formData.image,
                category: formData.category, stockQuantity: Number(formData.stockQuantity),
            });
            setAddMsg(`✅ Dodano: "${formData.name}" (${formData.category})`);
            setAddError(false);
            setFormData({ ...EMPTY_FORM, category: formData.category });
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            setAddMsg(`❌ ${msg ?? 'Błąd dodawania produktu.'}`);
            setAddError(true);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // Edit save
    const handleEditSaved = (updated: Product) => {
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        setEditTarget(null);
        showToast(`✅ Zapisano: ${updated.name}`);
    };

    // Delete
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await apiClient.delete(`/products/${deleteTarget.id}`);
            setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
            showToast(`🗑 Usunięto: ${deleteTarget.name}`);
        } catch {
            showToast('❌ Błąd usuwania produktu.');
        } finally {
            setDeleteTarget(null);
        }
    };

    const filtered = products.filter(p =>
        !searchFilter ||
        p.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchFilter.toLowerCase())
    );

    return (
        <>
            <div className="adm-page">
                <div className="adm-inner">

                    {/* Page header */}
                    <div className="adm-title-bar">
                        <div>
                            <h1>Panel Administratora</h1>
                            <p className="adm-sub">Zarządzanie produktami sklepu GuitarShop</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="adm-tabs">
                        <button className={`adm-tab ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>
                            <span>➕</span> Dodaj gitarę
                        </button>
                        <button className={`adm-tab ${tab === 'manage' ? 'active' : ''}`} onClick={() => setTab('manage')}>
                            <span>📋</span> Zarządzaj produktami
                        </button>
                    </div>

                    {/* ── TAB: ADD ─────────────────────────────────── */}
                    {tab === 'add' && (
                        <form onSubmit={handleAdd} className="adm-card">
                            {addMsg && (
                                <div className={`adm-msg ${addError ? 'error' : 'success'}`}>{addMsg}</div>
                            )}

                            <div className="adm-section-title">Podstawowe informacje</div>
                            <div className="adm-grid-2">
                                <div>
                                    <label htmlFor="add-name">Nazwa produktu</label>
                                    <input id="add-name" name="name" placeholder="np. Fender Stratocaster" value={formData.name} onChange={handleFormChange} required />
                                </div>
                                <div>
                                    <label htmlFor="add-brand">Marka</label>
                                    <input id="add-brand" name="brand" placeholder="np. Fender" value={formData.brand} onChange={handleFormChange} required />
                                </div>
                            </div>
                            <div className="adm-grid-3">
                                <div>
                                    <label htmlFor="add-price">Cena (zł)</label>
                                    <input id="add-price" name="price" type="number" placeholder="3500" value={formData.price} onChange={handleFormChange} required min="0" step="0.01" />
                                </div>
                                <div>
                                    <label htmlFor="add-category">Kategoria</label>
                                    <select id="add-category" name="category" value={formData.category} onChange={handleFormChange} required disabled={loadingCats}>
                                        {loadingCats
                                            ? <option>Ładowanie...</option>
                                            : categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)
                                        }
                                    </select>
                                    {formData.category && <span className="adm-cat-badge">✓ {formData.category}</span>}
                                </div>
                                <div>
                                    <label htmlFor="add-stock">Stan magazynowy</label>
                                    <input id="add-stock" name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleFormChange} min="0" required />
                                </div>
                            </div>

                            <div className="adm-section-title" style={{ marginTop: '1.5rem' }}>Szczegóły i media</div>
                            <div>
                                <label htmlFor="add-type">Typ</label>
                                <input id="add-type" name="type" placeholder="np. Gitara elektryczna" value={formData.type} onChange={handleFormChange} required />
                            </div>
                            <div>
                                <label htmlFor="add-desc">Opis</label>
                                <textarea id="add-desc" name="desc" placeholder="Opis produktu..." value={formData.desc} onChange={handleFormChange} required rows={3} />
                            </div>
                            <div>
                                <label htmlFor="add-specs">Specyfikacja</label>
                                <input id="add-specs" name="specs" placeholder="np. Przetworniki SSS, korpus Alder" value={formData.specs} onChange={handleFormChange} required />
                            </div>
                            <div>
                                <label htmlFor="add-image">URL zdjęcia</label>
                                <input id="add-image" name="image" placeholder="np. /images/strat.jpg" value={formData.image} onChange={handleFormChange} required />
                            </div>

                            <button type="submit" id="admin-submit-btn" className="adm-submit">Dodaj gitarę</button>
                        </form>
                    )}

                    {/* ── TAB: MANAGE ──────────────────────────────── */}
                    {tab === 'manage' && (
                        <div className="adm-card">
                            <div className="adm-manage-toolbar">
                                <input
                                    className="adm-search"
                                    placeholder="🔍  Szukaj po nazwie, marce lub kategorii..."
                                    value={searchFilter}
                                    onChange={e => setSearchFilter(e.target.value)}
                                />
                                <span className="adm-count">{filtered.length} produktów</span>
                            </div>

                            {loadingProducts ? (
                                <div className="adm-spinner-wrap"><div className="adm-spinner" /></div>
                            ) : filtered.length === 0 ? (
                                <div className="adm-empty">
                                    <span>🎸</span>
                                    <p>Brak produktów{searchFilter ? ` dla frazy "${searchFilter}"` : ' w bazie'}.</p>
                                </div>
                            ) : (
                                <div className="adm-product-table-wrap">
                                    <table className="adm-product-table">
                                        <thead>
                                            <tr>
                                                <th>Produkt</th>
                                                <th>Kategoria</th>
                                                <th>Cena</th>
                                                <th>Stan</th>
                                                <th>Akcje</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map(p => (
                                                <tr key={p.id}>
                                                    <td>
                                                        <div className="adm-prod-name">{p.name}</div>
                                                        <div className="adm-prod-brand">{p.brand}</div>
                                                    </td>
                                                    <td>
                                                        <span className="adm-cat-tag">{p.category ?? '—'}</span>
                                                    </td>
                                                    <td className="adm-price">
                                                        {p.price != null
                                                            ? new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(Number(p.price))
                                                            : '—'
                                                        }
                                                    </td>
                                                    <td>
                                                        <span className={`adm-stock-badge ${(p.stockQuantity ?? 0) <= 3 ? 'low' : 'ok'}`}>
                                                            {p.stockQuantity ?? 0} szt.
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="adm-actions">
                                                            <button className="adm-btn-edit" onClick={() => setEditTarget(p)}>✏️ Edytuj</button>
                                                            <button className="adm-btn-delete" onClick={() => setDeleteTarget(p)}>🗑</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {editTarget && (
                <EditModal
                    product={editTarget}
                    categories={categories}
                    onClose={() => setEditTarget(null)}
                    onSaved={handleEditSaved}
                />
            )}
            {deleteTarget && (
                <DeleteModal
                    productName={deleteTarget.name}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* Toast */}
            {toast && <div className="adm-toast">{toast}</div>}

            <style>{`
                /* ── Page layout ── */
                .adm-page { background: #faf7f4; min-height: calc(100vh - 120px); padding: 2rem; }
                .adm-inner { max-width: 900px; margin: 0 auto; }
                .adm-title-bar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; }
                .adm-title-bar h1 { font-family: var(--font-display); font-size: 26px; font-weight: 500; color: #1c1410; }
                .adm-sub { font-size: 13px; color: #7a6050; margin-top: 3px; }

                /* ── Tabs ── */
                .adm-tabs { display: flex; gap: 4px; margin-bottom: 1.25rem; background: white; border: 0.5px solid #e8ddd4; border-radius: 10px; padding: 4px; width: fit-content; }
                .adm-tab { background: transparent; border: none; padding: 8px 18px; border-radius: 7px; font-size: 13px; font-weight: 500; color: #7a6050; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s; }
                .adm-tab:hover { color: #3d2e1e; }
                .adm-tab.active { background: #c2410c; color: white; }

                /* ── Card ── */
                .adm-card { background: white; border: 0.5px solid #e8ddd4; border-radius: 12px; padding: 1.75rem; }
                .adm-msg { margin-bottom: 1.25rem; padding: 11px 15px; border-radius: 8px; font-size: 13px; font-weight: 500; }
                .adm-msg.error { background: #fff1f0; color: #c0392b; border: 1px solid #f5c6cb; }
                .adm-msg.success { background: #f0fff4; color: #1a7340; border: 1px solid #b7e4c7; }

                /* ── Section title ── */
                .adm-section-title { font-size: 11px; font-weight: 600; color: #7a6050; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 1rem; padding-top: 1.25rem; border-top: 1px solid #e8ddd4; }
                .adm-card > .adm-section-title:first-child { border-top: none; padding-top: 0; }

                /* ── Form fields ── */
                .adm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .adm-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 12px; }
                .adm-card label { font-size: 12px; font-weight: 500; color: #5c4033; margin-bottom: 4px; display: block; }
                .adm-card input, .adm-card select, .adm-card textarea { width: 100%; background: #faf7f4; border: 0.5px solid #e2d4c8; border-radius: 7px; padding: 9px 12px; font-size: 13px; color: #1c1410; margin-bottom: 12px; box-sizing: border-box; font-family: inherit; }
                .adm-card input:focus, .adm-card select:focus, .adm-card textarea:focus { outline: none; border-color: #c2410c; box-shadow: 0 0 0 2px rgba(194,65,12,.08); }
                .adm-cat-badge { font-size: 11px; color: #c2410c; font-weight: 600; display: block; margin: -8px 0 8px; }
                .adm-submit { width: 100%; background: #c2410c; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-top: 4px; }
                .adm-submit:hover { background: #9a3412; }

                /* ── Manage toolbar ── */
                .adm-manage-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; gap: 12px; }
                .adm-search { flex: 1; background: #faf7f4; border: 0.5px solid #e2d4c8; border-radius: 8px; padding: 9px 14px; font-size: 13px; color: #1c1410; }
                .adm-search:focus { outline: none; border-color: #c2410c; }
                .adm-count { font-size: 12px; color: #7a6050; white-space: nowrap; }
                .adm-spinner-wrap { display: flex; justify-content: center; padding: 2.5rem; }
                .adm-spinner { width: 30px; height: 30px; border: 3px solid #e8ddd4; border-top-color: #c2410c; border-radius: 50%; animation: aspin 0.7s linear infinite; }
                @keyframes aspin { to { transform: rotate(360deg); } }
                .adm-empty { text-align: center; padding: 3rem 1rem; color: #7a6050; }
                .adm-empty span { font-size: 40px; display: block; margin-bottom: 0.75rem; }

                /* ── Product table ── */
                .adm-product-table-wrap { overflow-x: auto; }
                .adm-product-table { width: 100%; border-collapse: collapse; font-size: 13px; }
                .adm-product-table th { text-align: left; font-size: 11px; font-weight: 600; color: #7a6050; text-transform: uppercase; letter-spacing: 0.5px; padding: 0 12px 10px; border-bottom: 1px solid #e8ddd4; }
                .adm-product-table td { padding: 12px; border-bottom: 1px solid #f0e8e0; vertical-align: middle; }
                .adm-product-table tr:last-child td { border-bottom: none; }
                .adm-product-table tr:hover td { background: #fdf9f6; }
                .adm-prod-name { font-weight: 600; color: #1c1410; }
                .adm-prod-brand { font-size: 11px; color: #7a6050; margin-top: 2px; }
                .adm-cat-tag { background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
                .adm-price { font-weight: 600; color: #1c1410; }
                .adm-stock-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
                .adm-stock-badge.ok { background: #d1fae5; color: #065f46; }
                .adm-stock-badge.low { background: #fee2e2; color: #991b1b; }
                .adm-actions { display: flex; gap: 6px; }
                .adm-btn-edit { background: #eff6ff; color: #1d4ed8; border: 0.5px solid #bfdbfe; border-radius: 6px; padding: 5px 10px; font-size: 12px; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
                .adm-btn-edit:hover { background: #dbeafe; }
                .adm-btn-delete { background: #fff1f0; color: #c0392b; border: 0.5px solid #fecaca; border-radius: 6px; padding: 5px 8px; font-size: 13px; cursor: pointer; transition: all 0.15s; }
                .adm-btn-delete:hover { background: #fee2e2; }

                /* ── Modal ── */
                .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
                .modal-box { background: white; border-radius: 14px; padding: 1.75rem; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,.3); }
                .modal-box--sm { max-width: 400px; }
                .modal-box--sm h2 { font-size: 16px; font-weight: 600; color: #1c1410; margin-bottom: 10px; }
                .modal-box--sm p { font-size: 14px; color: #5c4033; line-height: 1.5; }
                .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
                .modal-header h2 { font-family: var(--font-display); font-size: 18px; font-weight: 500; color: #1c1410; }
                .modal-close { background: none; border: none; font-size: 18px; color: #7a6050; cursor: pointer; padding: 4px; line-height: 1; }
                .modal-close:hover { color: #1c1410; }
                .modal-error { background: #fff1f0; color: #c0392b; border: 1px solid #f5c6cb; border-radius: 7px; padding: 10px 14px; margin-bottom: 1rem; font-size: 13px; }
                .modal-form label { font-size: 12px; font-weight: 500; color: #5c4033; margin-bottom: 4px; display: block; }
                .modal-form input, .modal-form select, .modal-form textarea { width: 100%; background: #faf7f4; border: 0.5px solid #e2d4c8; border-radius: 7px; padding: 9px 12px; font-size: 13px; color: #1c1410; margin-bottom: 12px; box-sizing: border-box; font-family: inherit; }
                .modal-form input:focus, .modal-form select:focus, .modal-form textarea:focus { outline: none; border-color: #c2410c; box-shadow: 0 0 0 2px rgba(194,65,12,.08); }
                .modal-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .modal-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
                .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 0.5rem; }
                .btn-cancel { background: #f5f0eb; border: 0.5px solid #e2d4c8; color: #5c4033; border-radius: 7px; padding: 9px 18px; font-size: 13px; cursor: pointer; }
                .btn-cancel:hover { background: #ede5dc; }
                .btn-save { background: #c2410c; color: white; border: none; border-radius: 7px; padding: 9px 20px; font-size: 13px; font-weight: 600; cursor: pointer; }
                .btn-save:hover { background: #9a3412; }
                .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
                .btn-delete-confirm { background: #dc2626; color: white; border: none; border-radius: 7px; padding: 9px 20px; font-size: 13px; font-weight: 600; cursor: pointer; }
                .btn-delete-confirm:hover { background: #b91c1c; }

                /* ── Toast ── */
                .adm-toast { position: fixed; bottom: 24px; right: 24px; background: #1c1410; color: #f5f0eb; border: 1px solid #3d2e1e; border-left: 3px solid #c2410c; padding: 12px 18px; border-radius: 8px; font-size: 13px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,.3); animation: toastin 0.25s ease; }
                @keyframes toastin { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </>
    );
}
