'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingMetroProps {
    className?: string;
    delay?: number;
    size?: 'sm' | 'md' | 'lg';
    type?: 'train' | 'station' | 'icon';
}

const FloatingMetro: React.FC<FloatingMetroProps> = ({
    className = '',
    delay = 0,
    size = 'md',
    type = 'train'
}) => {
    const sizeClasses = {
        sm: 'text-4xl',
        md: 'text-6xl',
        lg: 'text-8xl'
    };

    const icons = {
        train: '🚇',
        station: '🏢',
        icon: '📍'
    };

    const floatVariants = {
        animate: {
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 8 + delay,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay * 0.5
            }
        }
    };

    return (
        <motion.div
            className={`absolute ${sizeClasses[size]} ${className} opacity-20 select-none pointer-events-none`}
            variants={floatVariants}
            animate="animate"
        >
            {icons[type]}
        </motion.div>
    );
};

export default FloatingMetro;
