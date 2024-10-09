import React from 'react';

const GradientBackground = ({ children }) => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70"></div>
            {/* Blue glow effect */}
            <div className="absolute inset-0 bg-blue-900 blur-[100px]"></div>
            {/* Bottom fade-out gradient */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black to-transparent z-10"></div>
            {children}
        </div>
    );
};

export default GradientBackground;