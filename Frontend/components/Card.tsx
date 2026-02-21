'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glass?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = true,
    glass = false
}) => {
    const baseClasses = 'rounded-2xl p-6 will-change-transform';
    const glassClasses = glass
        ? 'glass border border-white/20 shadow-[0_24px_72px_rgba(0,0,0,0.24)]'
        : 'bg-white shadow-[0_24px_68px_rgba(0,0,0,0.14)]';
    const hoverClass = hover ? 'card-hover' : '';

    return (
        <motion.div
            className={`${baseClasses} ${glassClasses} ${hoverClass} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            animate={{ y: [0, -3, 0] }}
            whileHover={hover ? {
                scale: 1.03,
                borderColor: glass ? 'rgba(6, 214, 160, 0.42)' : 'rgba(230, 57, 70, 0.4)',
                boxShadow: glass
                    ? '0 0 0 1px rgba(6,214,160,0.28), 0 26px 80px rgba(6,214,160,0.18)'
                    : '0 24px 70px rgba(0, 0, 0, 0.2)',
                transition: { duration: 0.35, ease: "easeOut" }
            } : {}}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
};

export default Card;
