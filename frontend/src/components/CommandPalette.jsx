import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CommandPalette = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const inputRef = useRef(null);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setSearch(''); // Reset search on close
        }
    }, [isOpen]);

    // Handle Esc key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            // TODO: Add Arrow Up/Down navigation here
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Get User Role
    let user = {};
    try {
        user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (err) {
        console.error('Error parsing user data:', err);
    }
    const userRole = user?.role || 'staf';
    const userRoleAccess = user?.role_access || [];

    // Unified Menu Actions with Role Access
    const allActions = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊', url: '/admin/dashboard', access: 'Dashboard', keywords: ['home', 'utama', 'statistik', 'ringkasan'] },
        { id: 'menu', name: 'Manajemen Menu', icon: '🍽️', url: '/admin/menu', access: 'Menu', keywords: ['makanan', 'minuman', 'produk', 'harga', 'stok'] },
        { id: 'kasir', name: 'Kasir (POS)', icon: '🧾', url: '/admin/kasir', access: 'POS', keywords: ['jual', 'bayar', 'transaksi', 'pos', 'scan'] },
        { id: 'gramasi', name: 'Gramasi & HPP', icon: '⚖️', url: '/admin/gramasi', access: 'Gramasi', keywords: ['resep', 'bahan baku', 'komposisi', 'modal'] },
        { id: 'inventaris', name: 'Inventaris', icon: '📦', url: '/admin/inventaris', access: 'Inventori', keywords: ['stok', 'gudang', 'opname', 'barang', 'suplier'] },
        { id: 'keuangan', name: 'Keuangan & Kas', icon: '💰', url: '/admin/keuangan', access: 'Keuangan', roles: ['admin', 'owner'], keywords: ['laba', 'rugi', 'cash flow', 'pengeluaran', 'pemasukan'] },
        { id: 'pegawai', name: 'Pegawai', icon: '👥', url: '/admin/pegawai', access: 'Pegawai', roles: ['admin', 'owner'], keywords: ['karyawan', 'staff', 'gaji', 'absensi', 'user'] },
        { id: 'meja', name: 'Meja & Reservasi', icon: '🪑', url: '/admin/meja', access: 'Meja', keywords: ['booking', 'denah', 'tempat duduk'] },
        { id: 'pelanggan', name: 'Pelanggan & Loyalti', icon: '❤️', url: '/admin/pelanggan', access: 'Pelanggan', keywords: ['member', 'diskon', 'poin', 'crm'] },
        { id: 'laporan', name: 'Laporan & Analitik', icon: '📈', url: '/admin/laporan', access: 'Laporan', roles: ['admin', 'owner'], keywords: ['audit', 'export', 'pdf', 'excel', 'penjualan'] },
        { id: 'shift', name: 'Laporan Shift', icon: '🔐', url: '/admin/shift', access: 'Laporan', roles: ['admin', 'owner'], keywords: ['tutup kasir', 'rekap shift', 'handover', 'uang fisIk'] },
        { id: 'pengaturan', name: 'Pengaturan Umum', icon: '⚙️', url: '/admin/pengaturan', access: 'Settings', roles: ['admin', 'owner'], keywords: ['toko', 'printer', 'pajak', 'struk', 'sistem'] },
        { id: 'datacenter', name: 'Pusat Data', icon: '🗄️', url: '/admin/data-center', access: 'Settings', roles: ['admin', 'owner'], keywords: ['backup', 'restore', 'database', 'log', 'server'] }
    ];

    const filteredActions = allActions.filter(action => {
        // 1. Role Logic (Same as Sidebar)
        let hasAccess = false;

        // Admin/Owner Bypass
        if (userRole === 'admin' || userRole === 'owner' || userRoleAccess?.includes('*')) {
            hasAccess = true;
        }
        // Granular Access Check
        else if (action.access && userRoleAccess?.includes(action.access)) {
            hasAccess = true;
        }
        // Role Restriction
        else if (action.roles && !action.roles.includes(userRole)) {
            hasAccess = false;
        }
        // Default Access (Public)
        else if (!action.roles && !action.access) {
            hasAccess = true;
        }

        if (!hasAccess) return false;

        // 2. Search Logic
        if (!search) return true;
        const term = search.toLowerCase();
        return (
            action.name.toLowerCase().includes(term) ||
            action.keywords?.some(k => k.includes(term))
        );
    });

    const handleSelect = (action) => {
        navigate(action.url);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[10vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-[#1E1B4B] border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
                        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 p-4 border-b border-white/10">
                            <span className="text-xl">🔍</span>
                            <input
                                ref={inputRef}
                                type="text"
                                className="flex-1 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none"
                                placeholder="Cari fitur, menu, atau laporan... (Ctrl + K)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button onClick={onClose} className="px-2 py-1 text-xs bg-white/10 rounded text-gray-400">Esc</button>
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto p-2 scrollbar-hide">
                            {filteredActions.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <div className="text-4xl mb-2">🤔</div>
                                    <p>Tidak ada hasil ditemukan</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredActions.map((action, index) => (
                                        <motion.button
                                            key={action.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            onClick={() => handleSelect(action)}
                                            className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 hover:border-l-4 hover:border-purple-500 text-left transition-all group"
                                        >
                                            <div className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
                                                {action.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-white group-hover:text-purple-300 transition-colors">
                                                    {action.name}
                                                </div>
                                                {action.keywords && (
                                                    <div className="text-xs text-gray-500 line-clamp-1">
                                                        {action.keywords.join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-gray-600 text-xs">Selection ↵</div>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
