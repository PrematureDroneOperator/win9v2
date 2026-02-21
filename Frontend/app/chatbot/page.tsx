'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Chatbot from '@/components/Chatbot';
import ParticlesBackground from '@/components/ParticlesBackground';
import FloatingMetro from '@/components/FloatingMetro';
import CTA from '@/components/CTA';
import { staggerContainer, fadeIn } from '@/lib/animations';
import { useTranslation } from 'react-i18next';

export default function ChatbotPage() {
    const { t } = useTranslation();
    return (
        <main className="min-h-screen relative flex flex-col pt-24 pb-12 overflow-hidden">
            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-metro-dark via-gray-800 to-metro-dark">
                <ParticlesBackground id="particles-chat" />
                {/* Global Gradient Overlays */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-metro-red opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-metro-teal opacity-10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
                <FloatingMetro type="train" size="md" className="top-20 left-10" delay={0} />
                <FloatingMetro type="icon" size="sm" className="top-40 right-20" delay={1} />
                <FloatingMetro type="station" size="sm" className="bottom-20 left-1/4" delay={0.5} />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center h-full"
                >
                    <motion.div variants={fadeIn} className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            {t('chatbotPage.titlePrefix')} <span className="text-gradient">Roadचल</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            {t('chatbotPage.subtitle')}
                        </p>
                    </motion.div>

                    <motion.div variants={fadeIn} className="w-full">
                        <Chatbot />
                    </motion.div>
                </motion.div>
            </div>

            <div className="relative z-10 mt-20">
                <CTA />
            </div>
        </main>
    );
}
