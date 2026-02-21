'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();
    const isHome = ['/', '/landing', '/dashboard', '/tracking', '/login', '/register', '/chatbot', '/contact', '/privacy', '/terms', '/help', '/metro-details'].includes(pathname);

    return (
        <footer className={`${isHome ? 'bg-transparent border-t border-white/10' : 'bg-metro-dark'} text-white py-12 relative z-50`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="stagger-grid grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-3xl">🚇</span>
                            <span className="text-xl font-display font-bold text-gradient">
                                Roadचल
                            </span>
                        </div>
                        <p className="text-gray-300 text-sm">
                            {t('footer.description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">{t('footer.quickLinks')}</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <Link href="/" className="hover:text-metro-teal transition-colors">
                                    {t('footer.home')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/landing" className="hover:text-metro-teal transition-colors">
                                    {t('footer.aboutUs')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/metro-details" className="hover:text-metro-teal transition-colors">
                                    {t('footer.metroDetails')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/tracking" className="hover:text-metro-teal transition-colors">
                                    {t('footer.trackRide')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-metro-teal transition-colors">
                                    {t('footer.dashboard')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">{t('footer.support')}</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <Link href="/help" className="hover:text-metro-teal transition-colors">
                                    {t('footer.helpCenter')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-metro-teal transition-colors">
                                    {t('footer.contactUs')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-metro-teal transition-colors">
                                    {t('footer.privacyPolicy')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-metro-teal transition-colors">
                                    {t('footer.termsOfService')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">{t('footer.connectWithUs')}</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-2xl hover:text-metro-teal transition-colors">
                                <FaTwitter />
                            </a>
                            <a href="#" className="text-2xl hover:text-metro-teal transition-colors">
                                <FaLinkedin />
                            </a>
                            <a href="#" className="text-2xl hover:text-metro-teal transition-colors">
                                <FaInstagram />
                            </a>
                            <a href="#" className="text-2xl hover:text-metro-teal transition-colors">
                                <FaGithub />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>
                        &copy; {currentYear} Roadचल. {t('footer.rightsReserved')} | {t('footer.poweredByPuneMetro')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
