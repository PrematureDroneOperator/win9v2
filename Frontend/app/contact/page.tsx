'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ParticlesBackground from '@/components/ParticlesBackground';
import FloatingMetro from '@/components/FloatingMetro';
import Card from '@/components/Card';
import CTA from '@/components/CTA';
import { staggerContainer, fadeIn, slideUp } from '@/lib/animations';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function ContactPage() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submission
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const contactInfo = [
        { icon: <FaEnvelope />, label: t('contact.emailUs'), value: 'support@roadchal.com', color: 'bg-metro-red' },
        { icon: <FaPhone />, label: t('contact.callUs'), value: '+91 98765 43210', color: 'bg-metro-teal' },
        { icon: <FaMapMarkerAlt />, label: t('contact.visitUs'), value: 'Pune Metro HQ, Shivajinagar, Pune', color: 'bg-metro-red' }
    ];

    return (
        <main className="min-h-screen relative pt-24 pb-12 overflow-hidden flex flex-col">
            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-metro-dark via-gray-800 to-metro-dark">
                <ParticlesBackground id="particles-contact" />
                {/* Global Gradient Overlays */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-metro-teal opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-metro-red opacity-10 rounded-full blur-3xl"></div>
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
                        className="text-4xl md:text-6xl font-display font-bold text-white mb-4"
                    >
                        {t('contact.titlePrefix')} <span className="text-gradient">{t('contact.titleHighlight')}</span>
                    </motion.h1>
                    <motion.p
                        variants={fadeIn}
                        className="text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        {t('contact.subtitle')}
                    </motion.p>
                </motion.div>

                <div className="stagger-grid grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Contact Info Cards */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {contactInfo.map((info, index) => (
                            <motion.div key={index} variants={slideUp}>
                                <Card glass className="flex items-center gap-6 p-6 hover:scale-105 transition-transform">
                                    <div className={`${info.color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-${info.color.split('-')[1]}/20`}>
                                        {info.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 font-medium">{info.label}</p>
                                        <p className="text-white font-bold">{info.value}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        className="lg:col-span-2"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                    >
                        <Card glass className="p-8 border-white/10">
                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-20 h-20 bg-metro-teal rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-lg shadow-metro-teal/20">
                                        ✓
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{t('contact.messageSent')}</h2>
                                    <p className="text-gray-300 text-lg">{t('contact.thankYou')}</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-8 text-metro-teal font-bold hover:underline"
                                    >
                                        {t('contact.sendAnother')}
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="stagger-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300 ml-1">{t('contact.yourName')}</label>
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder={t('contact.namePlaceholder')}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-metro-red transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300 ml-1">{t('contact.emailAddress')}</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder={t('contact.emailPlaceholder')}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-metro-teal transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">{t('contact.subject')}</label>
                                        <input
                                            required
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder={t('contact.subjectPlaceholder')}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-metro-red transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">{t('contact.message')}</label>
                                        <textarea
                                            required
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder={t('contact.messagePlaceholder')}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-metro-teal transition-colors resize-none"
                                        ></textarea>
                                    </div>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full gradient-metro text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-metro-red/20"
                                    >
                                        <FaPaperPlane className="text-sm" />
                                        {t('contact.sendMessage')}
                                    </motion.button>
                                </form>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </div>

            <div className="relative z-10">
                <CTA />
            </div>
        </main>
    );
}
