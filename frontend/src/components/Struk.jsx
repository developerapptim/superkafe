
import React from 'react';

const Struk = ({ order, settings }) => {
    if (!order) return null;

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(val || 0);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div id="printable-struk" className="bg-white text-black font-mono p-4 w-full max-w-[300px] mx-auto text-xs leading-tight shadow-lg printable-area">
            {/* Header */}
            <div className="text-center mb-4 pb-4 border-b border-black border-dashed">
                {settings?.logo && (
                    <div className="flex justify-center mb-2">
                        <img src={settings.logo} alt="Logo" className="h-12 object-contain filter grayscale contrast-125" />
                    </div>
                )}
                <h1 className="text-lg font-bold uppercase mb-1">{settings?.businessName || 'WARKOP SANTAI'}</h1>
                <p className="text-[10px]">{settings?.address || 'Jl. Contoh No. 123'}</p>
                <p className="text-[10px]">{settings?.phone ? `Telp: ${settings.phone}` : ''}</p>
            </div>

            {/* Info */}
            <div className="mb-4 pb-2 border-b border-black border-dashed space-y-1">
                <div className="flex justify-between">
                    <span>No. Order:</span>
                    <span className="font-bold">#{order.id?.slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tgl:</span>
                    <span>{formatDate(order.createdAt || order.date)} {order.time}</span>
                </div>
                <div className="flex justify-between">
                    <span>Pelanggan:</span>
                    <span>{order.customerName || 'Pelanggan'}</span>
                </div>
                {order.tableNumber && (
                    <div className="flex justify-between">
                        <span>Meja:</span>
                        <span className="font-bold">{order.tableNumber}</span>
                    </div>
                )}
                {order.source && (
                    <div className="flex justify-between">
                        <span>Via:</span>
                        <span>{order.source === 'customer-app' ? 'App' : 'Kasir'}</span>
                    </div>
                )}
            </div>

            {/* Items */}
            <div className="mb-4 pb-2 border-b border-black border-dashed space-y-2">
                {(order.items || []).map((item, idx) => (
                    <div key={idx}>
                        <div className="font-bold truncate">{item.name || item.menuName}</div>
                        <div className="flex justify-between pl-2">
                            <span>{item.qty || item.quantity}x @{formatCurrency(item.price)}</span>
                            <span>{formatCurrency((item.price) * (item.qty || item.quantity))}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="mb-4 pb-4 border-b border-black border-dashed space-y-1">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.total)}</span>
                </div>
                {order.tax > 0 && (
                    <div className="flex justify-between text-[10px]">
                        <span>Pajak</span>
                        <span>{formatCurrency(order.tax)}</span>
                    </div>
                )}
                {order.discount > 0 && (
                    <div className="flex justify-between text-[10px]">
                        <span>Diskon</span>
                        <span>-{formatCurrency(order.discount)}</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-black border-dashed">
                    <span>TOTAL</span>
                    <span>{formatCurrency(order.total)}</span>
                </div>
                <div className="flex justify-between mt-2 text-[10px]">
                    <span>Status Bayar:</span>
                    <span className={`font-bold uppercase ${order.paymentStatus === 'paid' ? '' : 'italic'}`}>
                        {order.paymentStatus === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
                    </span>
                </div>
            </div>

            {/* Wi-Fi Info */}
            {settings?.wifiName && (
                <div className="mb-4 text-center pb-2 border-b border-black border-dashed">
                    <div className="flex justify-center items-center gap-1 mb-1">
                        <span className="text-sm">📶</span>
                        <span className="font-bold">Free Wi-Fi</span>
                    </div>
                    <p>SSID: {settings.wifiName}</p>
                    {settings.wifiPassword && <p>Pass: {settings.wifiPassword}</p>}
                </div>
            )}

            {/* Footer */}
            <div className="text-center text-[10px] space-y-1">
                <p>{settings?.tagline || 'Terima kasih atas kunjungan Anda'}</p>
                <div className="pt-2">
                    <p className="text-[8px] text-gray-500">Powered by MarosTech</p>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx="true">{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-struk, #printable-struk * {
                        visibility: visible;
                    }
                    #printable-struk {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 10px;
                        box-shadow: none;
                        border: none;
                    }
                    /* Hide scrollbars during print */
                    ::-webkit-scrollbar { display: none; }
                }
            `}</style>
        </div>
    );
};

export default Struk;
