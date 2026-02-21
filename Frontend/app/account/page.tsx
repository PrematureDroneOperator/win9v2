'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { FiLogOut, FiUser, FiMail, FiCalendar } from 'react-icons/fi';
import ParticlesBackground from '@/components/ParticlesBackground';

export default function AccountPage() {
    const { user, signOut, loading } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-metro-dark">
                <div className="text-white text-xl animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!user) {
        if (typeof window !== 'undefined') {
            router.push('/login');
        }
        return null;
    }

    return (
        <div className="min-h-screen relative pt-32 pb-20">
            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-metro-dark via-gray-800 to-metro-dark">
                <ParticlesBackground id="particles-account" />
                <div className="absolute top-40 right-1/4 w-96 h-96 bg-metro-teal opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 left-1/4 w-96 h-96 bg-metro-red opacity-10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-display font-bold text-white mb-8 border-l-4 border-metro-teal pl-6">
                        My Account
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Profile Info */}
                        <Card glass className="md:col-span-2 p-8 h-full">
                            <div className="flex flex-col space-y-8">
                                <div className="flex items-center space-x-5">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-metro-teal to-blue-500 flex items-center justify-center text-white text-3xl shadow-lg shadow-metro-teal/20">
                                        <FiUser />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">
                                            {user.user_metadata?.username || user.email?.split('@')[0]}
                                        </h2>
                                        <p className="text-metro-teal font-medium">Verified Account</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 pt-4">
                                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <FiMail className="text-metro-teal text-xl" />
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                                            <p className="text-white font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <FiCalendar className="text-metro-teal text-xl" />
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Member Since</p>
                                            <p className="text-white font-medium">
                                                {new Date(user.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Actions */}
                        <div className="space-y-6">
                            <Card glass className="p-6">
                                <h3 className="text-white font-semibold mb-4">Account Settings</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">
                                        Edit Profile
                                    </button>
                                    <button className="w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">
                                        Security
                                    </button>
                                    <button className="w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">
                                        Notifications
                                    </button>
                                </div>
                            </Card>

                            <Button
                                variant="outline"
                                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center justify-center space-x-2 py-4"
                                onClick={handleSignOut}
                            >
                                <FiLogOut />
                                <span>Sign Out</span>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
