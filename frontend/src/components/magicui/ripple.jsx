import React from "react";

import { cn } from "@/lib/utils";

const Ripple = React.memo(function Ripple({ className }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-blue-700/10 to-transparent" />
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-ripple"
          style={{
            width: `${190 + i * 90}px`,
            height: `${190 + i * 90}px`,
            border: '1px solid rgba(59, 130, 246, 0.27)',
            boxShadow: '0 0 20px 10px rgba(59, 130, 246, 0.1)',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
            animationDelay: `${i * 2}s`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
});

Ripple.displayName = "Ripple";

export default Ripple;
