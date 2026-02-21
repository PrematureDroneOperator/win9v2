'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ParticlesBackground from '@/components/ParticlesBackground';
import FloatingMetro from '@/components/FloatingMetro';
import Card from '@/components/Card';
import CTA from '@/components/CTA';
import { metroStations } from '@/lib/mockData';
import { staggerContainer, fadeIn, slideUp } from '@/lib/animations';
import { FaTrain, FaClock, FaRupeeSign, FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function MetroDetailsPage() {
    const { t } = useTranslation();
    const purpleLineStations = metroStations.filter(s => s.line === "Purple");

    const infoCards = [
        {
            icon: <FaClock />,
            title: t('metroDetails.info.operatingHours.title'),
            details: t('metroDetails.info.operatingHours.details'),
            color: "text-metro-teal"
        },
        {
            icon: <FaRupeeSign />,
            title: t('metroDetails.info.fareStructure.title'),
            details: t('metroDetails.info.fareStructure.details'),
            color: "text-metro-red"
        },
        {
            icon: <FaTrain />,
            title: t('metroDetails.info.frequency.title'),
            details: t('metroDetails.info.frequency.details'),
            color: "text-metro-teal"
        }
    ];

    return (
        <main className="min-h-screen relative pt-24 pb-12 overflow-hidden flex flex-col">
            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-metro-dark via-gray-800 to-metro-dark">
                <ParticlesBackground id="particles-metro-details" />
                {/* Global Gradient Overlays */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-metro-teal opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-metro-red opacity-10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
                <FloatingMetro type="train" size="lg" className="top-20 left-10" delay={0} />
                <FloatingMetro type="station" size="md" className="top-40 right-20" delay={1} />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="text-center mb-16"
                >
                    <motion.h1
                        variants={fadeIn}
                        className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
                    >
                        {t('metroDetails.titlePrefix')} <span className="text-gradient">{t('metroDetails.titleHighlight')}</span>
                    </motion.h1>
                    <motion.p
                        variants={fadeIn}
                        className="text-xl text-gray-300 max-w-3xl mx-auto"
                    >
                        {t('metroDetails.subtitle')}
                    </motion.p>
                </motion.div>

                {/* Info Grid */}
                <div className="stagger-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {infoCards.map((card, index) => (
                        <motion.div key={index} variants={slideUp}>
                            <Card glass className="p-8 text-center border-white/10 hover:scale-105 transition-transform">
                                <div className={`${card.color} text-4xl mb-4 flex justify-center`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                                <p className="text-2xl font-display font-bold text-gradient">{card.details}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Metro Line Section */}
                <div className="mb-20">
                    <motion.div
                        variants={fadeIn}
                        className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
                            <FaTrain />
                        </div>
                        <div>
                            <h2 className="text-3xl font-display font-bold text-white">{t('metroDetails.purpleLine')}</h2>
                            <p className="text-gray-400">{t('metroDetails.purpleLineRoute')}</p>
                        </div>
                    </motion.div>

                    <div className="stagger-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {purpleLineStations.map((station) => (
                            <motion.div key={station.id} variants={slideUp}>
                                <Card glass className="p-6 border-white/5 hover:border-metro-teal/50 transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl">🚇</span>
                                        <FaInfoCircle className="text-gray-500 group-hover:text-metro-teal transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">{station.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{t('metroDetails.stationSuffix')}</p>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                                        <span>{t('metroDetails.lat')}: {station.lat.toFixed(4)}</span>
                                        <span>{t('metroDetails.lng')}: {station.lng.toFixed(4)}</span>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Service Map Visualization (Mock) */}
                <motion.div variants={fadeIn} className="mb-20">
                    <Card glass className="p-12 text-center border-white/10">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-white mb-6">{t('metroDetails.routeMapTitle')}</h2>
                            <div className="aspect-video bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mb-6 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-metro-red/10 to-metro-teal/10 group-hover:opacity-100 transition-opacity"></div>
                                <div className="text-center z-10">
                                    <div className="text-8xl mb-4 animate-pulse-glow text-metro-teal">🗺️</div>
                                    <p className="text-xl font-bold text-white">{t('metroDetails.comingSoonTitle')}</p>
                                    <p className="text-gray-400 mt-2">{t('metroDetails.comingSoonSubtitle')}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            <div className="relative z-10">
                <CTA />
            </div>
        </main>
    );
}
