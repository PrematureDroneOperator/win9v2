'use client';

import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    className = '',
    type = 'button'
}) => {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const springX = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.3 });
    const springY = useSpring(my, { stiffness: 220, damping: 18, mass: 0.3 });

    const baseClasses =
        'group relative overflow-hidden font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center border border-transparent will-change-transform';

    const variantClasses = {
        primary:
            'bg-metro-red/95 text-white shadow-[0_10px_30px_rgba(230,57,70,0.28),inset_0_1px_0_rgba(255,255,255,0.18)]',
        secondary:
            'bg-metro-teal/95 text-white shadow-[0_10px_30px_rgba(6,214,160,0.26),inset_0_1px_0_rgba(255,255,255,0.2)]',
        outline:
            'border border-metro-red/70 text-metro-red bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(230,57,70,0.2)]'
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            style={{ x: springX, y: springY }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                mx.set(x * 0.06);
                my.set(y * 0.06);
            }}
            onMouseLeave={() => {
                mx.set(0);
                my.set(0);
            }}
            whileHover={{
                scale: 1.03,
                boxShadow:
                    variant === 'secondary'
                        ? '0 0 0 1px rgba(6,214,160,0.35), 0 16px 38px rgba(6,214,160,0.32)'
                        : variant === 'primary'
                            ? '0 0 0 1px rgba(230,57,70,0.35), 0 16px 38px rgba(230,57,70,0.34)'
                            : '0 0 0 1px rgba(230,57,70,0.42), 0 12px 30px rgba(230,57,70,0.2)',
                transition: { duration: 0.35, ease: 'easeOut' }
            }}
            whileTap={{ scale: 0.95 }}
        >
            <span
                aria-hidden
                className={`pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 ${variant === 'secondary' ? 'bg-gradient-to-r from-metro-teal/0 via-metro-teal/20 to-metro-teal/0 group-hover:opacity-100' : 'bg-gradient-to-r from-metro-red/0 via-metro-red/20 to-metro-red/0 group-hover:opacity-100'}`}
            />
            {children}
        </motion.button>
    );
};

export default Button;
