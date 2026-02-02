import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ordersAPI } from '../../services/api';

function PesananSaya() {
    const { tableId } = useOutletContext();
    const [orders, setOrders] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // activeOrderId from localStorage
    const [activeOrderId, setActiveOrderId] = useState(localStorage.getItem('currentOrderId'));

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, [activeOrderId, tableId]);

    const fetchData = async () => {
        try {
            // 1. Fetch Active Order if exists
            if (activeOrderId) {
                try {
                    const res = await ordersAPI.getById(activeOrderId);
                    if (res.data) {
                        setActiveOrder(res.data);
                        // Optional: Clear if done? User asked for logic to clear manually or conditionally.
                        // We'll keep it for now so they can see "Selesai".
                    }
                } catch (err) {
                    console.error("Error fetching active order", err);
                    // If not found (deleted?), maybe clear localStorage?
                    if (err.response && err.response.status === 404) {
                        localStorage.removeItem('currentOrderId');
                        setActiveOrderId(null);
                        setActiveOrder(null);
                    }
                }
            }

            // 2. Fetch History (Today's orders)
            const res = await ordersAPI.getToday();
            const allOrders = Array.isArray(res.data) ? res.data : [];
            let filteredOrders = allOrders;

            if (tableId) {
                filteredOrders = allOrders.filter(o => o.tableId === tableId);
            } else {
                filteredOrders = allOrders.filter(o => o.source === 'customer-app');
            }

            // Sort by newest
            filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(filteredOrders.slice(0, 10));

        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const clearActiveSession = () => {
        localStorage.removeItem('currentOrderId');
        setActiveOrderId(null);
        setActiveOrder(null);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusStep = (status) => {
        // Steps: 1. pending/new -> 2. process/preparing -> 3. ready/served -> 4. done/completed
        switch (status) {
            case 'new': return 1;
            case 'pending': return 1;
            case 'process': return 2;
            case 'preparing': return 2;
            case 'served': return 3;
            case 'ready': return 3;
            case 'done': return 4;
            case 'completed': return 4;
            default: return 0;
        }
    };

    const renderActiveOrder = () => {
        if (!activeOrder) return null;

        const currentStep = getStatusStep(activeOrder.status);
        const steps = [
            { label: 'Diterima', icon: '📝', step: 1 },
            { label: 'Diproses', icon: '👨‍🍳', step: 2 },
            { label: 'Diantar', icon: '🍽️', step: 3 },
            { label: 'Selesai', icon: '✅', step: 4 },
        ];

        return (
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-6 border border-purple-500/50 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 text-9xl transform translate-x-1/4 -translate-y-1/4">
                    {steps[currentStep - 1]?.icon || '📋'}
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                Pesanan Aktif
                            </h3>
                            <p className="text-purple-300">#{activeOrder.id?.slice(-6)} • {activeOrder.tableNumber ? `Meja ${activeOrder.tableNumber}` : 'Take Away'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Total</p>
                            <p className="text-xl font-bold text-green-400">{formatCurrency(activeOrder.total)}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between relative">
                            {/* Line Base */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-0"></div>
                            {/* Line Active */}
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-purple-500 -z-0 transition-all duration-1000"
                                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            ></div>

                            {steps.map((s, idx) => {
                                const isActive = currentStep >= s.step;
                                const isCurrent = currentStep === s.step;
                                return (
                                    <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${isActive ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-gray-800 text-gray-500 border border-white/10'
                                            } ${isCurrent ? 'scale-125 ring-2 ring-purple-400 ring-offset-2 ring-offset-[#1E1B4B]' : ''}`}>
                                            {isActive ? '✓' : idx + 1}
                                        </div>
                                        <span className={`text-xs font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Details Preview */}
                    <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/5">
                        <p className="text-sm text-gray-400 mb-2">Item Pesanan:</p>
                        <ul className="space-y-1 text-sm">
                            {(activeOrder.items || []).slice(0, 3).map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                    <span>{item.qty}x {item.name}</span>
                                    <span className="text-gray-400">{formatCurrency(item.subtotal || item.price * item.qty)}</span>
                                </li>
                            ))}
                            {(activeOrder.items?.length > 3) && (
                                <li className="text-xs text-gray-500 pt-1">+{activeOrder.items.length - 3} item lainnya...</li>
                            )}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={fetchData}
                            className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                        >
                            🔄 Cek Status
                        </button>
                        {(activeOrder.status === 'done' || activeOrder.status === 'completed' || activeOrder.status === 'cancelled') && (
                            <button
                                onClick={clearActiveSession}
                                className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg"
                            >
                                ✨ Pesan Lagi
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            new: { label: 'Menunggu', color: 'bg-yellow-500/20 text-yellow-400', icon: '⏳' },
            pending: { label: 'Menunggu', color: 'bg-yellow-500/20 text-yellow-400', icon: '⏳' },
            process: { label: 'Diproses', color: 'bg-blue-500/20 text-blue-400', icon: '👨‍🍳' },
            done: { label: 'Selesai', color: 'bg-green-500/20 text-green-400', icon: '✅' },
            cancelled: { label: 'Dibatalkan', color: 'bg-red-500/20 text-red-400', icon: '❌' }
        };
        const info = statusMap[status] || statusMap.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs ${info.color}`}>
                {info.icon} {info.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="px-4 py-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">📋 Pesanan Saya</h2>
            </div>

            {/* Active Order Section */}
            {renderActiveOrder()}

            {/* History List */}
            <h3 className="font-bold text-gray-400 text-sm uppercase tracking-wider mb-3">
                Riwayat Hari Ini
            </h3>

            {orders.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-gray-500 text-sm">Belum ada riwayat pesanan hari ini.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map(order => (
                        <div key={order.id} className={`bg-white/5 rounded-xl border overflow-hidden ${order.id === activeOrderId ? 'border-purple-500/50 ring-1 ring-purple-500/20' : 'border-white/10'}`}>
                            {/* Header */}
                            <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/20">
                                <div>
                                    <p className="text-xs text-gray-400">#{order.id?.slice(-6)}</p>
                                    <p className="text-xs text-gray-500">{formatTime(order.createdAt || order.timestamp)}</p>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>

                            {/* Items */}
                            <div className="p-3">
                                <div className="space-y-1 text-sm">
                                    {(order.items || []).slice(0, 2).map((item, idx) => (
                                        <div key={idx} className="flex justify-between">
                                            <span className="text-gray-300">{item.qty}x {item.name}</span>
                                            <span className="text-gray-400">{formatCurrency(item.subtotal || item.price * item.qty)}</span>
                                        </div>
                                    ))}
                                    {(order.items || []).length > 2 && (
                                        <p className="text-gray-500 text-xs">+{order.items.length - 2} item lainnya</p>
                                    )}
                                </div>
                                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between font-bold text-sm">
                                    <span>Total</span>
                                    <span className="text-green-400">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PesananSaya;
