'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticlesBackground from '@/components/ParticlesBackground';
import FloatingMetro from '@/components/FloatingMetro';
import Card from '@/components/Card';
import CTA from '@/components/CTA';
import { staggerContainer, fadeIn, slideUp } from '@/lib/animations';
import { FaSearch, FaChevronDown, FaTicketAlt, FaWallet, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function HelpCenterPage() {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState<number | null>(null);

    const categories = [
        { icon: <FaTicketAlt />, title: t('help.categories.booking.title'), desc: t('help.categories.booking.desc') },
        { icon: <FaWallet />, title: t('help.categories.payments.title'), desc: t('help.categories.payments.desc') },
        { icon: <FaShieldAlt />, title: t('help.categories.safety.title'), desc: t('help.categories.safety.desc') },
        { icon: <FaQuestionCircle />, title: t('help.categories.general.title'), desc: t('help.categories.general.desc') }
    ];

    const faqs = [
        {
            question: t('help.faqs.q1.question'),
            answer: t('help.faqs.q1.answer')
        },
        {
            question: t('help.faqs.q2.question'),
            answer: t('help.faqs.q2.answer')
        },
        {
            question: t('help.faqs.q3.question'),
            answer: t('help.faqs.q3.answer')
        },
        {
            question: t('help.faqs.q4.question'),
            answer: t('help.faqs.q4.answer')
        }
    ];

    return (
        <main className="min-h-screen relative pt-24 pb-12 overflow-hidden flex flex-col">
            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-metro-dark via-gray-800 to-metro-dark">
                <ParticlesBackground id="particles-help" />
                {/* Global Gradient Overlays */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-metro-teal opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-metro-red opacity-10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
                <FloatingMetro type="train" size="lg" className="top-20 right-10" delay={0} />
                <FloatingMetro type="station" size="md" className="bottom-20 left-10" delay={1} />

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
                        {t('help.titlePrefix')} <span className="text-gradient">{t('help.titleHighlight')}</span>
                    </motion.h1>
                    <motion.div
                        variants={fadeIn}
                        className="max-w-2xl mx-auto relative"
                    >
                        <input
                            type="text"
                            placeholder={t('help.searchPlaceholder')}
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 pl-14 text-white placeholder-gray-400 focus:outline-none focus:border-metro-teal transition-all backdrop-blur-md"
                        />
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                    </motion.div>
                </motion.div>

                {/* Categories Grid */}
                <div className="stagger-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={index}
                            variants={slideUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={index}
                        >
                            <Card glass className="h-full hover:scale-105 transition-transform cursor-pointer border-white/10 p-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-metro flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                                    {cat.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{cat.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mb-20">
                    <motion.h2
                        variants={fadeIn}
                        className="text-3xl font-bold text-white mb-8 text-center"
                    >
                        {t('help.faqTitle')}
                    </motion.h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div key={index} variants={slideUp}>
                                <Card glass className="border-white/10 overflow-hidden !p-0">
                                    <button
                                        onClick={() => setActiveSection(activeSection === index ? null : index)}
                                        className="w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition-colors"
                                    >
                                        <span className="text-lg font-semibold text-white">{faq.question}</span>
                                        <FaChevronDown className={`text-metro-teal transition-transform duration-300 ${activeSection === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {activeSection === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <CTA />
            </div>
        </main>
    );
}
