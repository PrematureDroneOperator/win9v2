'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FloatingMetro from '@/components/FloatingMetro';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { features } from '@/lib/mockData';
import { fadeIn } from '@/lib/animations';
import ParticlesBackground from '@/components/ParticlesBackground';
import CTA from '@/components/CTA';
import { useTranslation } from 'react-i18next';

export default function LandingPage() {
    const { t } = useTranslation();
    const translatedFeatures = features.map((feature, index) => ({
        ...feature,
        title: t(`benefits.feature${index + 1}.title`),
        description: t(`benefits.feature${index + 1}.desc`),
    }));

    return (
        <main className="min-h-screen relative flex flex-col">
            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-metro-dark via-gray-800 to-metro-dark">
                <ParticlesBackground id="particles-global-about" />
                {/* Global Gradient Overlays */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-metro-teal opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-metro-red opacity-10 rounded-full blur-3xl"></div>
            </div>

            {/* Content Container - z-10 to sit above background */}
            <div className="relative z-10 flex-1">

                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    <FloatingMetro type="train" size="lg" className="top-20 left-10" delay={0} />
                    <FloatingMetro type="station" size="md" className="bottom-20 right-20" delay={1} />

                    <div className="absolute top-0 right-0 w-96 h-96 bg-metro-teal opacity-20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                        >
                            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
                                {t('landing.hero.titleLine1')}<br />
                                <span className="text-gradient">{t('landing.hero.titleLine2')}</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                                {t('landing.hero.description')}
                            </p>
                            <Link href="/register">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="primary" size="lg">{t('landing.hero.downloadApp')}</Button>
                                </motion.div>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Feature Highlights */}
                <section className="py-20 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                                {t('landing.features.title')}
                            </h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                {t('landing.features.subtitle')}
                            </p>
                        </div>

                        <div className="stagger-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {translatedFeatures.map((feature) => (
                                <Card key={feature.id} glass className="text-center">
                                    <div className="text-5xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-display font-bold text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-300">{feature.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pune Metro Integration */}
                <section className="py-20 relative overflow-hidden">
                    <FloatingMetro type="train" size="lg" className="top-10 right-10" delay={0} />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="stagger-grid grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                                    {t('landing.integration.title')}
                                </h2>
                                <p className="text-lg text-gray-300 mb-6">
                                    {t('landing.integration.description')}
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        t('landing.integration.points.p1'),
                                        t('landing.integration.points.p2'),
                                        t('landing.integration.points.p3'),
                                        t('landing.integration.points.p4')
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-metro-teal text-xl mr-2">✓</span>
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center justify-center"
                            >
                                <Card glass className="p-12 text-center">
                                    <div className="text-9xl mb-4">🗺️</div>
                                    <h3 className="text-2xl font-bold text-white">{t('landing.integration.mapTitle')}</h3>
                                    <p className="text-gray-300 mt-2">{t('landing.integration.mapSubtitle')}</p>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* App Screenshots */}
                <section className="py-20 text-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                                {t('landing.modern.title')}
                            </h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                {t('landing.modern.subtitle')}
                            </p>
                        </div>

                        <div className="stagger-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { emoji: '📱', title: t('landing.modern.cards.liveTracking.title'), desc: t('landing.modern.cards.liveTracking.desc') },
                                { emoji: '💳', title: t('landing.modern.cards.easyPayments.title'), desc: t('landing.modern.cards.easyPayments.desc') },
                                { emoji: '📊', title: t('landing.modern.cards.tripAnalytics.title'), desc: t('landing.modern.cards.tripAnalytics.desc') }
                            ].map((item, index) => (
                                <Card key={index} glass className="text-center h-72 flex flex-col items-center justify-center">
                                    <div className="text-7xl mb-4">{item.emoji}</div>
                                    <h3 className="text-2xl font-display font-bold mb-2">{item.title}</h3>
                                    <p className="text-gray-300">{item.desc}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

            </div>

            <div className="relative z-10">
                <CTA />
            </div>
        </main>
    );
}
