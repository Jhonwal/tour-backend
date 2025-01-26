import React from 'react';

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
            {/* Outer spinning border with gradient and shadow */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-80 lg:h-80 
                border-8 border-transparent 
                animate-spin
                rounded-full 
                bg-gradient-to-tr from-orange-500 to-red-500 
                shadow-2xl 
                flex items-center justify-center">
                
                {/* Inner spinning border with different gradient */}
                <div className="absolute w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-88 lg:h-88 
                    border-8 border-transparent 
                    animate-spin-slow 
                    rounded-full 
                    bg-gradient-to-bl from-red-400 to-yellow-500 
                    shadow-lg">
                </div>
                
                {/* Static logo/image with pulse animation */}
            </div>
                <img
                    src={`/images/waguer.png`}
                    alt="Loading"
                    className="absolute z-10 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 
                    object-contain 
                    animate-pulse 
                    transform hover:scale-110 
                    transition-transform duration-300 
                    shadow-md rounded-full"
                />

            {/* Subtle background particles/dots */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute bg-white/50 rounded-full animate-float"
                        style={{
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Loading;