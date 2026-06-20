import { useState, useEffect } from 'react';
import apiClient from '../services/api';

interface AdminStats {
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    totalRevenue: number;
    ordersByStatus: Record<string, number>;
    productsByCategory: Record<string, number>;
    lowStockProducts: number;
}

const STATUS_COLORS: Record<string, string> = {
    PENDING:   '#f59e0b',
    CONFIRMED: '#3b82f6',
    SHIPPED:   '#8b5cf6',
    DELIVERED: '#10b981',
    CANCELLED: '#ef4444',
    UNKNOWN:   '#6b7280',
};

const STATUS_LABELS: Record<string, string> = {
    PENDING:   'Oczekujące',
    CONFIRMED: 'Potwierdzone',
    SHIPPED:   'Wysłane',
    DELIVERED: 'Dostarczone',
    CANCELLED: 'Anulowane',
};

function formatCurrency(n: number) {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(n);
}

// ── Mini bar chart using only CSS / divs ────────────────
function BarChart({ data, colors }: { data: Record<string, number>; colors?: Record<string, string> }) {
    const entries = Object.entries(data);
    const max = Math.max(...entries.map(([, v]) => v), 1);
    return (
        <div className="bar-chart">
            {entries.map(([key, value]) => (
                <div key={key} className="bar-row">
                    <span className="bar-label">{STATUS_LABELS[key] ?? key}</span>
                    <div className="bar-track">
                        <div
                            className="bar-fill"
                            style={{
                                width: `${(value / max) * 100}%`,
                                background: colors?.[key] ?? '#c2410c',
                            }}
                        />
                    </div>
                    <span className="bar-value">{value}</span>
                </div>
            ))}
        </div>
    );
}

// ── Donut-style pie chart using conic-gradient ──────────
function DonutChart({ data }: { data: Record<string, number> }) {
    const entries = Object.entries(data);
    const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
    const palette = ['#c2410c', '#d97706', '#16a34a', '#2563eb', '#7c3aed', '#db2777', '#0891b2'];

    let cum = 0;
    const gradient = entries.map(([, v], i) => {
        const start = (cum / total) * 360;
        cum += v;
        const end = (cum / total) * 360;
        return `${palette[i % palette.length]} ${start}deg ${end}deg`;
    }).join(', ');

    return (
        <div className="donut-wrapper">
            <div className="donut" style={{ background: `conic-gradient(${gradient})` }}>
                <div className="donut-hole">
                    <span className="donut-total">{total}</span>
                    <span className="donut-label">produktów</span>
                </div>
            </div>
            <ul className="donut-legend">
                {entries.map(([key, value], i) => (
                    <li key={key}>
                        <span className="legend-dot" style={{ background: palette[i % palette.length] }} />
                        <span className="legend-key">{key}</span>
                        <span className="legend-val">{value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function DashboardPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await apiClient.get('/admin/stats');
                setStats(res.data);
            } catch {
                setError('Nie udało się pobrać statystyk. Sprawdź czy backend jest uruchomiony.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return (
        <div className="dash-loading">
            <div className="dash-spinner" />
            <p>Ładowanie dashboardu...</p>
        </div>
    );

    if (error) return (
        <div className="dash-error">
            <span>⚠️</span>
            <p>{error}</p>
        </div>
    );

    if (!stats) return null;

    const kpis = [
        { label: 'Zamówienia', value: stats.totalOrders, icon: '📦', color: '#3b82f6' },
        { label: 'Przychód', value: formatCurrency(stats.totalRevenue), icon: '💰', color: '#10b981' },
        { label: 'Użytkownicy', value: stats.totalUsers, icon: '👤', color: '#8b5cf6' },
        { label: 'Produkty', value: stats.totalProducts, icon: '🎸', color: '#f59e0b' },
    ];

    return (
        <>
            <div className="dash-page">
                <div className="dash-header">
                    <h1>Dashboard</h1>
                    <p className="dash-subtitle">Podsumowanie sklepu GuitarShop w czasie rzeczywistym</p>
                </div>

                {/* KPI Cards */}
                <section className="dash-kpi-grid">
                    {kpis.map(kpi => (
                        <div key={kpi.label} className="kpi-card">
                            <div className="kpi-icon" style={{ background: kpi.color + '18', color: kpi.color }}>
                                {kpi.icon}
                            </div>
                            <div className="kpi-body">
                                <span className="kpi-value">{kpi.value}</span>
                                <span className="kpi-label">{kpi.label}</span>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Low stock alert */}
                {stats.lowStockProducts > 0 && (
                    <div className="dash-alert">
                        ⚠️ <strong>{stats.lowStockProducts} {stats.lowStockProducts === 1 ? 'produkt ma' : 'produkty mają'} niski stan magazynowy</strong> (≤ 3 szt.)
                    </div>
                )}

                {/* Charts row */}
                <section className="dash-charts-row">
                    <div className="dash-card">
                        <h2>Zamówienia według statusu</h2>
                        {Object.keys(stats.ordersByStatus).length > 0
                            ? <BarChart data={stats.ordersByStatus} colors={STATUS_COLORS} />
                            : <p className="dash-empty">Brak zamówień.</p>
                        }
                    </div>

                    <div className="dash-card">
                        <h2>Produkty według kategorii</h2>
                        {Object.keys(stats.productsByCategory).length > 0
                            ? <DonutChart data={stats.productsByCategory} />
                            : <p className="dash-empty">Brak produktów.</p>
                        }
                    </div>
                </section>

                {/* Summary table */}
                <div className="dash-card">
                    <h2>Szczegóły zamówień per status</h2>
                    <table className="dash-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Liczba zamówień</th>
                                <th>Udział</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(stats.ordersByStatus).map(([status, count]) => {
                                const pct = stats.totalOrders > 0
                                    ? ((count / stats.totalOrders) * 100).toFixed(1)
                                    : '0';
                                return (
                                    <tr key={status}>
                                        <td>
                                            <span
                                                className="status-pill"
                                                style={{ background: (STATUS_COLORS[status] ?? '#666') + '22', color: STATUS_COLORS[status] ?? '#666' }}
                                            >
                                                {STATUS_LABELS[status] ?? status}
                                            </span>
                                        </td>
                                        <td className="dash-num">{count}</td>
                                        <td>
                                            <div className="pct-bar-track">
                                                <div
                                                    className="pct-bar-fill"
                                                    style={{ width: `${pct}%`, background: STATUS_COLORS[status] ?? '#666' }}
                                                />
                                            </div>
                                            <span className="pct-label">{pct}%</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .dash-page { background: #faf7f4; min-height: calc(100vh - 120px); padding: 2rem; }
                .dash-header { max-width: 1100px; margin: 0 auto 1.5rem; }
                .dash-header h1 { font-family: var(--font-display); font-size: 26px; font-weight: 500; color: #1c1410; }
                .dash-subtitle { font-size: 13px; color: #7a6050; margin-top: 4px; }

                /* KPI grid */
                .dash-kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 14px; max-width: 1100px; margin: 0 auto 1.5rem; }
                .kpi-card { background: white; border: 0.5px solid #e8ddd4; border-radius: 12px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 16px; }
                .kpi-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
                .kpi-body { display: flex; flex-direction: column; }
                .kpi-value { font-size: 22px; font-weight: 700; color: #1c1410; line-height: 1.2; }
                .kpi-label { font-size: 12px; color: #7a6050; margin-top: 2px; }

                /* Alert */
                .dash-alert { max-width: 1100px; margin: 0 auto 1.25rem; background: #fff7ed; border: 1px solid #fed7aa; border-left: 3px solid #f59e0b; color: #92400e; border-radius: 8px; padding: 12px 16px; font-size: 13px; }

                /* Charts */
                .dash-charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; max-width: 1100px; margin: 0 auto 1.5rem; }
                @media (max-width: 700px) { .dash-charts-row { grid-template-columns: 1fr; } }
                .dash-card { background: white; border: 0.5px solid #e8ddd4; border-radius: 12px; padding: 1.5rem; max-width: 1100px; margin: 0 auto 14px; }
                .dash-card h2 { font-size: 14px; font-weight: 600; color: #3d2e1e; margin-bottom: 1.25rem; }
                .dash-empty { font-size: 13px; color: #7a6050; text-align: center; padding: 1.5rem 0; }

                /* Bar chart */
                .bar-chart { display: flex; flex-direction: column; gap: 10px; }
                .bar-row { display: grid; grid-template-columns: 110px 1fr 32px; align-items: center; gap: 10px; }
                .bar-label { font-size: 12px; color: #5c4033; text-align: right; }
                .bar-track { background: #f0e8e0; border-radius: 4px; height: 10px; overflow: hidden; }
                .bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
                .bar-value { font-size: 12px; font-weight: 600; color: #3d2e1e; }

                /* Donut */
                .donut-wrapper { display: flex; align-items: center; gap: 28px; flex-wrap: wrap; }
                .donut { width: 140px; height: 140px; border-radius: 50%; position: relative; flex-shrink: 0; }
                .donut-hole { position: absolute; inset: 22px; background: white; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .donut-total { font-size: 22px; font-weight: 700; color: #1c1410; }
                .donut-label { font-size: 10px; color: #7a6050; }
                .donut-legend { list-style: none; display: flex; flex-direction: column; gap: 7px; }
                .donut-legend li { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #3d2e1e; }
                .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
                .legend-key { flex: 1; }
                .legend-val { font-weight: 600; }

                /* Table */
                .dash-table { width: 100%; border-collapse: collapse; font-size: 13px; }
                .dash-table th { text-align: left; font-size: 11px; font-weight: 600; color: #7a6050; text-transform: uppercase; letter-spacing: 0.5px; padding: 0 12px 10px; }
                .dash-table td { padding: 10px 12px; border-top: 1px solid #f0e8e0; vertical-align: middle; }
                .dash-table tr:hover td { background: #faf7f4; }
                .dash-num { font-weight: 600; color: #1c1410; }
                .status-pill { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
                .pct-bar-track { display: inline-block; width: 80px; height: 6px; background: #f0e8e0; border-radius: 3px; overflow: hidden; vertical-align: middle; margin-right: 8px; }
                .pct-bar-fill { height: 100%; border-radius: 3px; }
                .pct-label { font-size: 12px; color: #7a6050; }

                /* Loading / error */
                .dash-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 16px; color: #7a6050; }
                .dash-spinner { width: 36px; height: 36px; border: 3px solid #e8ddd4; border-top-color: #c2410c; border-radius: 50%; animation: dspin 0.7s linear infinite; }
                @keyframes dspin { to { transform: rotate(360deg); } }
                .dash-error { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; gap: 10px; color: #c0392b; font-size: 14px; }
            `}</style>
        </>
    );
}
