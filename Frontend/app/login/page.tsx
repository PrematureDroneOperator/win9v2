'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMetro from '@/components/FloatingMetro';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { FaGoogle, FaApple } from 'react-icons/fa';
import ParticlesBackground from '@/components/ParticlesBackground';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        // Prevent logged in users from hitting /login
        const user = localStorage.getItem('user');
        if (user) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError(t('login.errors.fillAllFields'));
            return;
        }

        try {
            const response = await fetch('http://localhost:9090/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || t('login.errors.loginFailed'));
            }

            // Store session/user in localStorage for now (simplified)
            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.session) {
                localStorage.setItem('session', JSON.stringify(data.session));
                if (supabase) {
                    await supabase.auth.setSession(data.session);
                }
            }

            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('login.errors.general'));
        }
    };

    return (
        <div className="min-h-screen relative">
            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-metro-dark via-gray-800 to-metro-dark">
                <ParticlesBackground id="particles-login" />
                {/* Global Gradient Overlays */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-metro-teal opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-metro-red opacity-10 rounded-full blur-3xl"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex items-center justify-center py-20 overflow-hidden min-h-screen">
                <FloatingMetro type="train" size="md" className="top-20 left-10" delay={0} />
                <FloatingMetro type="station" size="sm" className="top-1/3 right-10" delay={1} />
                <FloatingMetro type="icon" size="sm" className="bottom-20 left-1/4" delay={1.5} />

                <div className="max-w-md w-full mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-display font-bold text-white mb-2">{t('login.title')}</h1>
                            <p className="text-gray-300">{t('login.subtitle')}</p>
                        </div>

                        {/* Login Card */}
                        <Card glass className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email */}
                                <div>
                                    <label className="block text-white font-medium mb-2">{t('login.email')}</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-metro-teal transition-all"
                                        placeholder={t('login.emailPlaceholder')}
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-white font-medium mb-2">{t('login.password')}</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-metro-teal transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-red-500/20 border border-red-500/50 text-white px-4 py-2 rounded-lg"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Forgot Password */}
                                <div className="text-right">
                                    <a href="#" className="text-metro-teal hover:underline text-sm">
                                        {t('login.forgotPassword')}
                                    </a>
                                </div>

                                {/* Submit Button */}
                                <Button type="submit" variant="primary" className="w-full">
                                    {t('login.signIn')}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/20"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-transparent text-gray-400">{t('login.orContinueWith')}</span>
                                </div>
                            </div>

                            {/* Social Login */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
                                >
                                    <FaGoogle /> Google
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
                                >
                                    <FaApple /> Apple
                                </motion.button>
                            </div>

                            {/* Sign Up Link */}
                            <div className="mt-6 text-center text-gray-300">
                                {t('login.noAccount')}{' '}
                                <Link href="/register" className="text-metro-teal hover:underline font-semibold">
                                    {t('login.signUp')}
                                </Link>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
