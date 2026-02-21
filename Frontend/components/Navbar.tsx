'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = user
        ? [
            { href: '/', label: t('nav.home') },
            { href: '/landing', label: t('nav.about') },
            { href: '/metro-details', label: t('nav.metro') },
            { href: '/tracking', label: t('nav.track') },
            { href: '/chatbot', label: t('nav.chat') },
            { href: '/contact', label: t('nav.contact') },
            { href: '/dashboard', label: t('nav.dashboard') }
        ]
        : [
            { href: '/', label: t('nav.home') },
            { href: '/landing', label: t('nav.about') },
            { href: '/login', label: t('nav.login') }
        ];

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'py-3'
                : 'py-5'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0, scale: scrolled ? 0.985 : 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`flex items-center justify-between rounded-2xl px-4 md:px-5 border transition-all duration-300 ${scrolled
                        ? 'bg-[rgba(43,45,66,0.72)] backdrop-blur-xl border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.32)]'
                        : 'bg-[rgba(43,45,66,0.35)] backdrop-blur-md border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.2)]'
                        }`}
                >
                    {/* Logo */}
                    <Link href="/">
                        <motion.div
                            className="flex items-center space-x-2 cursor-pointer py-3"
                            whileHover={{ scale: 1.03 }}
                        >
                            <span className="text-3xl">🚇</span>
                            <span className="text-2xl font-display font-bold text-gradient">
                                Roadचल
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8 py-3">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <motion.span
                                    className="text-white/95 font-medium hover:text-metro-teal transition-colors cursor-pointer"
                                    whileHover={{ y: -2, textShadow: '0 0 18px rgba(6,214,160,0.45)' }}
                                >
                                    {link.label}
                                </motion.span>
                            </Link>
                        ))}
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                            {user && (
                                <Link href="/account">
                                    <motion.div
                                        className="w-10 h-10 rounded-full bg-metro-teal/20 border border-metro-teal/50 flex items-center justify-center text-metro-teal cursor-pointer hover:bg-metro-teal/30 transition-all shadow-[0_0_15px_rgba(6,214,160,0.3)]"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiUser size={20} />
                                    </motion.div>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4 py-3">
                        <LanguageSwitcher />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white text-2xl"
                        >
                            {mobileMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>
                </div>


                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        className="md:hidden mt-4 bg-[rgba(43,45,66,0.78)] backdrop-blur-xl border border-white/15 rounded-xl p-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <div
                                    className="block py-3 text-white font-medium hover:text-metro-teal transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </div>
                            </Link>
                        ))}
                        {user && (
                            <Link href="/account">
                                <button
                                    className="flex items-center justify-center space-x-2 w-full mt-2 py-3 px-4 rounded-xl bg-metro-teal/20 border border-metro-teal/40 text-metro-teal font-medium hover:bg-metro-teal/30 transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <FiUser />
                                    <span>{t('nav.account') || 'Account'}</span>
                                </button>
                            </Link>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
