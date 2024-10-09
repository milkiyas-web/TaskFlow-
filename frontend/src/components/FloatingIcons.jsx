import React from 'react';

const icons = [
    { icon: '📁', top: '10%', left: '5%' },
    { icon: '👥', top: '30%', left: '10%' },
    { icon: '📈', top: '70%', left: '5%' },
    { icon: '📅', top: '15%', right: '5%' },
    { icon: '📊', top: '45%', right: '10%' },
    { icon: '⏱️', top: '75%', right: '5%' },
];

const FloatingIcons = () => {
    return (
        <>
            {icons.map((item, index) => (
                <div
                    key={index}
                    className="absolute z-0 opacity-40 animate-float"
                    style={{
                        top: item.top,
                        left: item.left,
                        right: item.right,
                        animationDelay: `${index * 0.5}s`,
                    }}
                >
                    <div className="p-3 shadow-lg">
                        <span className="text-2xl">{item.icon}</span>
                    </div>
                </div>
            ))}
        </>
    );
};

export default FloatingIcons;