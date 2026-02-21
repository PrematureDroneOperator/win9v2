'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMetro from '@/components/FloatingMetro';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ParticlesBackground from '@/components/ParticlesBackground';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        // Prevent logged in users from hitting /register
        const user = localStorage.getItem('user');
        if (user) {
            router.push('/dashboard');
        }
    }, [router]);

    const validateForm = () => {
        const newErrors: string[] = [];

        if (!formData.fullName) newErrors.push(t('register.errors.fullNameRequired'));
        if (!formData.email) newErrors.push(t('register.errors.emailRequired'));
        if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
            newErrors.push(t('register.errors.mobileRequired'));
        }
        if (!formData.password || formData.password.length < 6) {
            newErrors.push(t('register.errors.passwordLength'));
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.push(t('register.errors.passwordMismatch'));
        }
        if (!formData.acceptTerms) {
            newErrors.push(t('register.errors.acceptTerms'));
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        const validationErrors = validateForm();

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch('http://localhost:9090/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.fullName, // Using fullName as username for now as per controller schema
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const fallback = t('register.errors.registrationFailed');
                const detail = data.detail || (data.error && data.error.message) || fallback;
                throw new Error(detail);
            }

            // Successfully registered, usually Supabase sends a confirmation email
            // or we might already have a session if auto-confirm is on.
            alert(t('register.successMessage'));
            router.push('/login');
        } catch (err: unknown) {
            setErrors([err instanceof Error ? err.message : t('register.errors.general')]);
        }
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData({ ...formData, mobile: value });
    };

    return (
        <div className="min-h-screen relative">
            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-metro-dark via-gray-800 to-metro-dark">
                <ParticlesBackground id="particles-register" />
                {/* Global Gradient Overlays */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-metro-red opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-metro-teal opacity-10 rounded-full blur-3xl"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex items-center justify-center py-20 overflow-hidden min-h-screen">
                <FloatingMetro type="train" size="lg" className="top-10 right-10" delay={0} />
                <FloatingMetro type="station" size="md" className="bottom-20 left-10" delay={1} />
                <FloatingMetro type="icon" size="sm" className="top-1/2 left-1/4" delay={1.5} />

                <div className="max-w-md w-full mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-display font-bold text-white mb-2">{t('register.title')}</h1>
                            <p className="text-gray-300">{t('register.subtitle')}</p>
                        </div>

                        {/* Registration Card */}
                        <Card glass className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-white font-medium mb-2">{t('register.fullName')}</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-metro-teal transition-all"
                                        placeholder={t('register.fullNamePlaceholder')}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-white font-medium mb-2">{t('register.email')}</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-metro-teal transition-all"
                                        placeholder={t('register.emailPlaceholder')}
                                    />
                                </div>

                                {/* Mobile */}
                                <div>
                                    <label className="block text-white font-medium mb-2">{t('register.mobileNumber')}</label>
                                    <input
                                        type="tel"
                                        value={formData.mobile}
                                        onChange={handleMobileChange}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-metro-teal transition-all"
                                        placeholder={t('register.mobilePlaceholder')}
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-white font-medium mb-2">{t('register.password')}</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-metro-teal transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-white font-medium mb-2">{t('register.confirmPassword')}</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-metro-teal transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {/* Terms */}
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        checked={formData.acceptTerms}
                                        onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                                        className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10"
                                    />
                                    <label className="ml-2 text-sm text-gray-300">
                                        {t('register.acceptPrefix')}{' '}
                                        <a href="#" className="text-metro-teal hover:underline">
                                            {t('register.termsAndConditions')}
                                        </a>
                                    </label>
                                </div>

                                {/* Errors */}
                                {errors.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg"
                                    >
                                        <ul className="list-disc list-inside text-sm space-y-1">
                                            {errors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                {/* Submit */}
                                <Button type="submit" variant="primary" className="w-full">
                                    {t('register.createAccount')}
                                </Button>
                            </form>

                            {/* Login Link */}
                            <div className="mt-6 text-center text-gray-300">
                                {t('register.alreadyHaveAccount')}{' '}
                                <Link href="/login" className="text-metro-teal hover:underline font-semibold">
                                    {t('register.signIn')}
                                </Link>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
