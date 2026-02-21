'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import FloatingMetro from '@/components/FloatingMetro';
import ParticlesBackground from '@/components/ParticlesBackground';
import CTA from '@/components/CTA';
import axios from 'axios';
import { FaClock, FaMapMarkerAlt, FaRupeeSign, FaChartLine } from 'react-icons/fa';
import { staggerContainer, slideUp } from '@/lib/animations';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
    const { t } = useTranslation();
    const [rideHistory, setRideHistory] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalRides: 0,
        totalDistance: '0 km',
        totalTime: '0 h',
        moneySaved: '0'
    });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const sessionStr = localStorage.getItem('session');
                if (!sessionStr) return;
                const session = JSON.parse(sessionStr);
                const token = session.access_token;

                if (!token) return;

                const res = await axios.get('http://localhost:8080/api/bookings/user/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const rides = res.data;
                const formattedRides = rides.map((ride: any) => ({
                    id: ride._id,
                    from: ride.pickupAddress || 'Unknown',
                    to: ride.dropAddress || 'Unknown',
                    date: new Date(ride.pickupDate).toLocaleDateString(),
                    distance: 'N/A',
                    duration: 'N/A',
                    fare: `₹${ride.fare || 0}`
                }));
                setRideHistory(formattedRides);

                setStats({
                    totalRides: rides.length,
                    totalDistance: '120 km', // Placeholder, no actual distance saved in model
                    totalTime: '5 h',
                    moneySaved: '₹350'
                });
            } catch (error) {
                console.error('Error fetching user ride history:', error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <main className="min-h-screen relative flex flex-col">
            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-metro-dark via-gray-800 to-metro-dark">
                <ParticlesBackground id="particles-dashboard" />
                {/* Global Gradient Overlays */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-metro-teal opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-metro-red opacity-10 rounded-full blur-3xl"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 py-20 overflow-hidden flex-1">
                <FloatingMetro type="train" size="md" className="top-20 right-10" delay={0} />
                <FloatingMetro type="station" size="sm" className="bottom-40 left-10" delay={1.5} />

                <motion.div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Welcome Section */}
                    <motion.div
                        variants={slideUp}
                        className="mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                            {t('dashboard.welcomeBack')} 👋
                        </h1>
                        <p className="text-xl text-gray-300">
                            {t('dashboard.overview')}
                        </p>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        className="stagger-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
                        variants={slideUp}
                    >
                        <Link href="/tracking">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Card className="gradient-metro text-white cursor-pointer border-none">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">{t('dashboard.startNewRide')}</h3>
                                            <p className="text-gray-200">{t('dashboard.bookRide')}</p>
                                        </div>
                                        <div className="text-5xl">🚀</div>
                                    </div>
                                </Card>
                            </motion.div>
                        </Link>

                        <Link href="/tracking">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Card className="!bg-metro-teal text-white cursor-pointer border-none">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">{t('dashboard.trackActiveRide')}</h3>
                                            <p className="text-gray-100">{t('dashboard.viewLiveStatus')}</p>
                                        </div>
                                        <div className="text-5xl">📍</div>
                                    </div>
                                </Card>
                            </motion.div>
                        </Link>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        className="stagger-grid grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
                        variants={slideUp}
                    >
                        <Card glass className="text-center text-white">
                            <div className="text-3xl mb-2 text-metro-red">
                                <FaChartLine className="mx-auto" />
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.totalRides}</p>
                            <p className="text-gray-300">{t('dashboard.totalRides')}</p>
                        </Card>

                        <Card glass className="text-center text-white">
                            <div className="text-3xl mb-2 text-metro-teal">
                                <FaMapMarkerAlt className="mx-auto" />
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.totalDistance}</p>
                            <p className="text-gray-300">{t('dashboard.distance')}</p>
                        </Card>

                        <Card glass className="text-center text-white">
                            <div className="text-3xl mb-2 text-metro-red">
                                <FaClock className="mx-auto" />
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.totalTime}</p>
                            <p className="text-gray-300">{t('dashboard.timeSaved')}</p>
                        </Card>

                        <Card glass className="text-center text-white">
                            <div className="text-3xl mb-2 text-metro-teal">
                                <FaRupeeSign className="mx-auto" />
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.moneySaved}</p>
                            <p className="text-gray-300">{t('dashboard.moneySaved')}</p>
                        </Card>
                    </motion.div>

                    <motion.div
                        className="stagger-grid grid grid-cols-1 lg:grid-cols-3 gap-8"
                        variants={slideUp}
                    >
                        {/* Ride History */}
                        <div className="lg:col-span-2">
                            <Card glass className="text-white">
                                <h3 className="text-2xl font-bold text-white mb-6">{t('dashboard.recentRides')}</h3>
                                <div className="space-y-4">
                                    {rideHistory.map((ride) => (
                                        <div
                                            key={ride.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                                        >
                                            <div className="flex items-start flex-1">
                                                <div className="text-3xl mr-4">🚗</div>
                                                <div>
                                                    <p className="font-semibold text-white">
                                                        {ride.from} → {ride.to}
                                                    </p>
                                                    <div className="flex gap-4 mt-1 text-sm text-gray-400">
                                                        <span>📅 {ride.date}</span>
                                                        <span>📏 {ride.distance}</span>
                                                        <span>⏱️ {ride.duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-metro-red text-lg">{ride.fare}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6">
                                    <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                                        {t('dashboard.viewAllRides')}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Upcoming Rides */}
                            <Card glass className="text-white">
                                <h3 className="text-xl font-bold mb-4 text-metro-teal">{t('dashboard.upcomingRides')}</h3>
                                <div className="space-y-3">
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                        <p className="font-semibold mb-1">{t('dashboard.tomorrowRide')}</p>
                                        <p className="text-sm text-gray-300">Kothrud → Vanaz Metro</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                        <p className="font-semibold mb-1">{t('dashboard.mondayRide')}</p>
                                        <p className="text-sm text-gray-300">Office → Civil Court Metro</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Pass Subscription */}
                            <Card glass className="text-white">
                                <h3 className="text-xl font-bold mb-4">{t('dashboard.monthlyPass')}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>{t('dashboard.ridesLeft')}</span>
                                        <span className="font-bold">23/30</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t('dashboard.expires')}</span>
                                        <span className="font-bold">28 Feb 2026</span>
                                    </div>
                                    <Button variant="secondary" className="w-full mt-4 bg-white text-metro-red hover:bg-gray-100 border-none">
                                        {t('dashboard.renewPass')}
                                    </Button>
                                </div>
                            </Card>

                            {/* Analytics */}
                            <Card glass className="text-white">
                                <h3 className="text-xl font-bold text-white mb-4">{t('dashboard.analytics')}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-300">{t('dashboard.ecoScore')}</span>
                                            <span className="text-sm font-bold text-metro-teal">92%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-metro-teal h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-300">{t('dashboard.onTimeRate')}</span>
                                            <span className="text-sm font-bold text-metro-red">88%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-metro-red h-2 rounded-full" style={{ width: '88%' }}></div>
                                        </div>
                                    </div>

                                    <div className="text-center pt-4 border-t border-white/10">
                                        <p className="text-2xl font-bold text-white">🌱</p>
                                        <p className="text-sm text-gray-300 mt-1">
                                            {t('dashboard.co2Saved')}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <div className="relative z-10">
                <CTA />
            </div>
        </main>
    );
}
