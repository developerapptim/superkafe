
import { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ label, value, onChange, options = [], placeholder = "Pilih...", required = false, disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

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

    // Find selected label
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    // Sort options alphabetically (user requirement)
    // We create a copy to avoid mutating the original prop if it's state
    const sortedOptions = [...options].sort((a, b) =>
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
                <div className="absolute z-50 w-full mt-1 bg-[#1f2937] border border-purple-500/30 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    {sortedOptions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center italic">Tidak ada opsi</div>
                    ) : (
                        sortedOptions.map((opt) => (
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
            )}
        </div>
    );
}
