import React from 'react';

interface LoadingModalProps {
    show: boolean;    
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ show }) => {
    if (!show) return null;

    // Animación de opacidad para el borde usando Tailwind + style inline
    // Tailwind no soporta animaciones de border-color ni border-opacity por defecto, así que usamos keyframes personalizados
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-200 bg-opacity-70 backdrop-blur-sm">
            <div className="rounded-xl border-4 border-blue-500 p-1 max-w-xs w-full">
                <div className="bg-white/90 rounded-lg shadow-2xl px-6 py-4 w-full flex flex-col items-center transition-all duration-300">
                    <div className="w-16 h-16 flex items-center justify-center mb-4">
                        <svg className="animate-spin w-16 h-16 text-blue-500" viewBox="0 0 50 50">
                            <circle className="opacity-25" cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="6" />
                            <path className="opacity-75" fill="currentColor" d="M25 5a20 20 0 0 1 20 20h-6a14 14 0 1 0-14 14v6A20 20 0 0 1 25 5z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-blue-600 animate-pulse">Loading...</span>
                </div>
            </div>
        </div>
    );
};
