'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';
import '@/lib/i18n'; // Ensure i18n is initialized

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const activeLanguageCode = (i18n.resolvedLanguage || i18n.language || 'en').toLowerCase().split('-')[0];
    const currentLanguage = languages.find((lang) => lang.code === activeLanguageCode) || languages[0];

    const handleLanguageChange = (code: string) => {
        void i18n.changeLanguage(code);
        window.localStorage.setItem('roadchalLng', code);
        window.localStorage.setItem('i18nextLng', code);
        setIsOpen(false);
    };

    return (
        <div className="relative z-50">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
                <FiGlobe className="text-metro-teal" />
                <span className="font-medium">{currentLanguage.name}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <FiChevronDown />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 glass-dark rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    >
                        <div className="py-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 ${activeLanguageCode === lang.code
                                            ? 'bg-metro-teal/20 text-metro-teal'
                                            : 'text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className="text-xl">{lang.flag}</span>
                                    <span className="font-medium">{lang.name}</span>
                                    {activeLanguageCode === lang.code && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="ml-auto w-2 h-2 rounded-full bg-metro-teal shadow-[0_0_8px_rgba(45,212,191,0.6)]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;
