function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-[#0F0A1F] z-50 fixed inset-0">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 text-sm animate-pulse">Memuat halaman...</p>
            </div>
        </div>
    );
}

export default Loading;
