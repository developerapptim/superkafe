import { useState, useEffect } from 'react';
import { shiftAPI } from '../../services/api';

function Shift() {
    const [shifts, setShifts] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]); // NEW: Activity Logs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        matched: 0,
        variance: 0
    });

    useEffect(() => {
        fetchShiftHistory();
        fetchActivities(); // NEW
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await shiftAPI.getActivities();
            setActivityLogs(res.data);
        } catch (err) {
            console.error('Error fetching activities:', err);
        }
    };

    const fetchShiftHistory = async () => {
        try {
            setLoading(true);
            // Try to get shift history - fallback to empty array if endpoint doesn't exist
            let data = [];
            try {
                const res = await shiftAPI.getCurrent();
                if (res.data && Array.isArray(res.data.history)) {
                    data = res.data.history;
                } else if (Array.isArray(res.data)) {
                    data = res.data;
                }
            } catch (e) {
                // Endpoint might not exist yet
                console.log('Shift history endpoint not available');
            }

            setShifts(data);

            // Calculate stats
            const matched = data.filter(s => Math.abs(s.variance || 0) <= 5000).length;
            const totalVariance = data.reduce((sum, s) => sum + Math.abs(s.variance || 0), 0);

            setStats({
                total: data.length,
                matched,
                variance: totalVariance
            });

            setError(null);
        } catch (err) {
            console.error('Error fetching shift history:', err);
            setError('Gagal memuat riwayat shift');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (variance) => {
        const v = Math.abs(variance || 0);
        if (v === 0) {
            return <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">KLOP</span>;
        } else if (v <= 5000) {
            return <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">TOLERANSI</span>;
        } else {
            return <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">SELISIH</span>;
        }
    };

    if (loading) {
        return (
            <section className="p-4 md:p-6 space-y-6">
                <h2 className="text-2xl font-bold">🔐 Laporan Shift & Audit Kas</h2>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">🔐 Laporan Shift & Audit Kas</h2>
                <button
                    onClick={fetchShiftHistory}
                    className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 flex items-center gap-2"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4">
                    <p className="text-xs text-gray-400">Total Shift</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.total}</p>
                </div>
                <div className="glass rounded-xl p-4">
                    <p className="text-xs text-gray-400">Shift KLOP/Toleransi</p>
                    <p className="text-2xl font-bold text-green-400">{stats.matched}</p>
                </div>
                <div className="glass rounded-xl p-4">
                    <p className="text-xs text-gray-400">Total Selisih</p>
                    <p className="text-2xl font-bold text-red-400">{formatCurrency(stats.variance)}</p>
                </div>
            </div>

            {/* Shift Table */}
            <div className="glass rounded-xl overflow-hidden">
                <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
                    <h3 className="font-bold">📋 Riwayat Shift</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 text-sm">
                            📥 Excel Shift
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-purple-500/10">
                            <tr>
                                <th className="px-4 py-3 text-left">Mulai</th>
                                <th className="px-4 py-3 text-left">Selesai</th>
                                <th className="px-4 py-3 text-left">Kasir</th>
                                <th className="px-4 py-3 text-right">Modal</th>
                                <th className="px-4 py-3 text-right">+ Penjualan</th>
                                <th className="px-4 py-3 text-right">- Kas Keluar</th>
                                <th className="px-4 py-3 text-right">Expected</th>
                                <th className="px-4 py-3 text-right">Selisih</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-purple-500/10">
                            {shifts.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                                        <div className="text-4xl mb-2">📋</div>
                                        <p>Belum ada data shift</p>
                                        <p className="text-xs mt-1">Data shift akan muncul setelah kasir menutup shift</p>
                                    </td>
                                </tr>
                            ) : (
                                shifts.map((s, idx) => (
                                    <tr key={s.id || idx} className="hover:bg-white/5">
                                        <td className="px-4 py-3">
                                            <div>{formatDate(s.startTime)}</div>
                                            <div className="text-xs text-gray-400">{formatTime(s.startTime)}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>{formatDate(s.endTime)}</div>
                                            <div className="text-xs text-gray-400">{formatTime(s.endTime)}</div>
                                        </td>
                                        <td className="px-4 py-3">{s.cashierName || '-'}</td>
                                        <td className="px-4 py-3 text-right">{formatCurrency(s.openingCash)}</td>
                                        <td className="px-4 py-3 text-right text-green-400">+{formatCurrency(s.totalSales)}</td>
                                        <td className="px-4 py-3 text-right text-red-400">-{formatCurrency(s.cashOut)}</td>
                                        <td className="px-4 py-3 text-right">{formatCurrency(s.expectedCash)}</td>
                                        <td className={`px-4 py-3 text-right font-bold ${(s.variance || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {formatCurrency(s.variance)}
                                        </td>
                                        <td className="px-4 py-3 text-center">{getStatusBadge(s.variance)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Active Legend */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-green-500/50"></span>
                    <span>KLOP = Uang pas</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-yellow-500/50"></span>
                    <span>TOLERANSI = Selisih ±Rp 5.000</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-red-500/50"></span>
                    <span>SELISIH = Melebihi toleransi (Perlu ditinjau)</span>
                </div>
            </div>

            {/* Activity Log (CCTV) */}
            <div className="glass rounded-xl overflow-hidden mt-6">
                <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                        📷 Aktivitas (CCTV Log)
                        <span className="text-xs font-normal text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">Coming Live</span>
                    </h3>
                </div>
                <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm">
                        <thead className="bg-purple-500/10 sticky top-0 backdrop-blur-sm">
                            <tr>
                                <th className="px-4 py-3 text-left w-32">Waktu</th>
                                <th className="px-4 py-3 text-left w-32">User</th>
                                <th className="px-4 py-3 text-left w-24">Role</th>
                                <th className="px-4 py-3 text-left w-24">Modul</th>
                                <th className="px-4 py-3 text-left w-24">Aksi</th>
                                <th className="px-4 py-3 text-left">Deskripsi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-purple-500/10">
                            {activityLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                        <div className="text-3xl mb-2">🕵️</div>
                                        <p>Belum ada aktivitas tercatat</p>
                                    </td>
                                </tr>
                            ) : (
                                activityLogs.map((log) => (
                                    <tr key={log._id} className="hover:bg-white/5 font-mono text-xs">
                                        <td className="px-4 py-2 text-gray-400">
                                            {new Date(log.timestamp).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-4 py-2 font-bold text-white">
                                            {log.user?.name || 'System'}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300">
                                                {log.user?.role || 'sys'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-blue-300">
                                            {log.module}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-0.5 rounded ${log.action.includes('DELETE') ? 'bg-red-500/20 text-red-400' :
                                                    log.action.includes('UPDATE') ? 'bg-yellow-500/20 text-yellow-400' :
                                                        log.action.includes('ADD') || log.action.includes('CREATE') ? 'bg-green-500/20 text-green-400' :
                                                            'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-gray-300">
                                            {log.description}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default Shift;
