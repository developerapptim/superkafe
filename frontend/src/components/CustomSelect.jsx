

import { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ label, value, onChange, options = [], placeholder = "Pilih...", required = false, disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when opened and reset search when closed
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        } else {
            // Optional: Delay clearing to avoid UI flicker if needed, but immediate is usually fine
            const timer = setTimeout(() => setSearchTerm(''), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Find selected label
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    // Filter and Sort options
    const filteredOptions = options
        .filter(opt =>
            opt.label.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) =>
            a.label.toString().localeCompare(b.label.toString())
        );

    return (
        <div className="relative" ref={containerRef}>
            {label && <label className="block text-sm text-gray-400 mb-1">{label} {required && '*'}</label>}

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full px-4 py-2 rounded-lg bg-white/5 border text-left flex justify-between items-center transition-colors
                    ${disabled ? 'opacity-50 cursor-not-allowed border-white/5' : 'hover:bg-white/10 cursor-pointer'}
                    ${isOpen ? 'border-purple-500 ring-1 ring-purple-500' : 'border-purple-500/30'}
                `}
            >
                <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-white'}`}>
                    {displayValue}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-[#1f2937] border border-purple-500/30 rounded-lg shadow-xl max-h-60 flex flex-col animate-in fade-in zoom-in-95 duration-100 overflow-hidden">

                    {/* Search Input Sticky Header */}
                    <div className="p-2 border-b border-white/10 bg-[#1f2937]/95 backdrop-blur-sm sticky top-0 z-10">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm rounded bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                            placeholder="🔍 Cari..."
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center italic">
                                {searchTerm ? 'Tidak ditemukan' : 'Tidak ada opsi'}
                            </div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between
                                    ${value === opt.value ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:bg-white/5 hover:text-white'}
                                `}
                                >
                                    <span>{opt.label}</span>
                                    {value === opt.value && (
                                        <span>✓</span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
