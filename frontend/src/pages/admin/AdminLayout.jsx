import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import CommandPalette from '../../components/CommandPalette';

// Fetcher
const fetcher = url => api.get(url).then(res => res.data);

function AdminLayout() {
    const navigate = useNavigate();
    const constraintsRef = useRef(null);

    const [showCmd, setShowCmd] = useState(false);

    // Global Keyboard Shortcut (Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setShowCmd(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const [showShiftModal, setShowShiftModal] = useState(false);
    const [shiftData, setShiftData] = useState({ startCash: '' });
    const { data: currentShift, mutate: mutateShift } = useSWR('/shifts/current', fetcher);
    console.log('AdminLayout Shift:', currentShift);

    // Get User Role
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isStaff = user.role === 'staf';

    // Effects to check shift status
    useEffect(() => {
        // If staff and no active shift (and data loaded), show modal
        // Note: currentShift is null if no shift, but undefined if loading
        if (isStaff && currentShift === null) {
            setShowShiftModal(true);
        } else {
            setShowShiftModal(false);
        }
    }, [isStaff, currentShift]);

    const handleOpenShift = async (e) => {
        e.preventDefault();
        try {
            await api.post('/shifts/open', {
                cashierName: user.name,
                userId: user.id,
                startCash: Number(shiftData.startCash)
            });
            toast.success('Shift berhasil dibuka!');
            mutateShift(); // Refresh shift data
            setShowShiftModal(false);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Gagal membuka shift');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Berhasil keluar');
        navigate('/login');
    };

    return (
        <div
            id="adminPage"
            className="relative h-screen overflow-hidden"
            ref={constraintsRef}
            style={{
                background: 'linear-gradient(135deg, #1E1B4B 0%, #0F0A1F 50%, #1E1B4B 100%)',
            }}
        >
            <div className="flex h-full">
                {/* Sidebar */}
                <Sidebar onLogout={handleLogout} />

                {/* Main Content */}
                <main
                    className="flex-1 ml-12 lg:ml-64 overflow-auto text-white transition-all duration-300 relative"
                    style={{ height: '100vh' }}
                >


                    <div className="p-2 md:p-6 pb-24">
                        {/* Page Content - Rendered by Outlet */}
                        <Outlet />
                    </div>
                </main>

                <CommandPalette isOpen={showCmd} onClose={() => setShowCmd(false)} />

                {/* Draggable Search FAB */}
                <motion.button
                    drag
                    dragConstraints={constraintsRef}
                    dragMomentum={false}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCmd(true)}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-600/40 border-2 border-white/10 cursor-grab active:cursor-grabbing hover:bg-blue-500 transition-colors"
                    title="Cari (Ctrl+K)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </motion.button>
            </div>
            {/* Blocking Shift Modal for Staff */}
            {showShiftModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1E1B4B] p-8 rounded-2xl w-full max-w-md border border-purple-500/30 shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-2">🔐</div>
                            <h2 className="text-2xl font-bold text-white">Buka Shift</h2>
                            <p className="text-gray-400 mt-2">Halo {user.name}, silakan masukkan saldo awal kasir untuk memulai shift.</p>
                        </div>

                        <form onSubmit={handleOpenShift} className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Saldo Awal (Rp)</label>
                                <input
                                    type="number"
                                    value={shiftData.startCash}
                                    onChange={(e) => setShiftData({ startCash: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/30 text-white text-lg focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="0"
                                    required
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-1"
                            >
                                🚀 Mulai Shift
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminLayout;
