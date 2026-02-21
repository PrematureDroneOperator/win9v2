'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FloatingMetro from '@/components/FloatingMetro';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { features, testimonials } from '@/lib/mockData';
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';
import { FaStar } from 'react-icons/fa';
import ParticlesBackground from '@/components/ParticlesBackground';
import CTA from '@/components/CTA';
import { useTranslation } from 'react-i18next';

const fadeUpOnScroll = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, ease: 'easeOut' as const },
};

const staggerGridContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const staggerGridItem = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: 'easeOut' as const },
    },
};

export default function Home() {
    const { t } = useTranslation();

    const translatedFeatures = features.map((feature, index) => ({
        ...feature,
        title: t(`benefits.feature${index + 1}.title`),
        description: t(`benefits.feature${index + 1}.desc`)
    }));

    const translatedTestimonials = testimonials.map((testimonial, index) => ({
        ...testimonial,
        role: t(`testimonials.user${index + 1}.role`),
        text: t(`testimonials.user${index + 1}.text`)
    }));

    return (
        <motion.main
            className="min-h-screen relative"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
        >
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-metro-dark via-gray-800 to-metro-dark">
                <ParticlesBackground id="particles-global" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(6,214,160,0.10),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(230,57,70,0.11),transparent_36%)]" />
                <motion.div
                    className="absolute top-0 left-0 w-96 h-96 bg-metro-red opacity-15 rounded-full blur-3xl will-change-transform"
                    animate={{ y: [0, 10, 0], x: [0, 8, 0] }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-96 h-96 bg-metro-teal opacity-15 rounded-full blur-3xl will-change-transform"
                    animate={{ y: [0, -10, 0], x: [0, -8, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <div className="relative z-10">
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_22%_28%,rgba(230,57,70,0.14),transparent_42%),radial-gradient(circle_at_78%_76%,rgba(6,214,160,0.14),transparent_44%)] blur-2xl will-change-transform"
                        animate={{ y: [0, -6, 0], x: [0, 6, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <FloatingMetro type="train" size="lg" className="top-20 left-10" delay={0} />
                    <FloatingMetro type="station" size="md" className="top-40 right-20" delay={1} />
                    <FloatingMetro type="train" size="md" className="bottom-32 left-1/4" delay={2} />
                    <FloatingMetro type="icon" size="sm" className="top-1/3 right-1/3" delay={1.5} />
                    <FloatingMetro type="station" size="sm" className="bottom-20 right-10" delay={0.5} />

                    <div className="absolute top-0 left-0 w-96 h-96 bg-metro-red opacity-20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-metro-teal opacity-20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                            <motion.h1
                                variants={fadeIn}
                                className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-[1.25] md:leading-[1.15] pt-1 drop-shadow-[0_8px_28px_rgba(6,214,160,0.16)]"
                            >
                                {t('hero.title')}
                            </motion.h1>
                            <motion.h2
                                variants={slideUp}
                                className="text-3xl md:text-5xl font-display font-bold text-gradient mb-6 leading-[1.25] md:leading-[1.2] pt-1"
                            >
                                {t('hero.subtitle')}
                            </motion.h2>
                            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                                {t('hero.description')}
                            </motion.p>
                            <motion.div variants={slideUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link href="/register">
                                    <Button variant="primary" size="lg">
                                        {t('hero.getStarted')}
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="secondary" size="lg">
                                        {t('hero.login')}
                                    </Button>
                                </Link>
                                <Link href="/landing">
                                    <Button variant="outline" size="lg">
                                        {t('hero.learnMore')}
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                <section className="py-20 relative overflow-hidden">
                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_18%_32%,rgba(6,214,160,0.12),transparent_40%),radial-gradient(circle_at_88%_70%,rgba(230,57,70,0.10),transparent_45%)] blur-2xl will-change-transform"
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <FloatingMetro type="train" size="md" className="top-10 right-5" delay={0} />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUpOnScroll} className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">{t('howItWorks.title')}</h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t('howItWorks.subtitle')}</p>
                        </motion.div>

                        <motion.div
                            className="stagger-grid grid grid-cols-1 md:grid-cols-3 gap-8"
                            variants={staggerGridContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            {[
                                { step: 1, icon: '📱', title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc') },
                                { step: 2, icon: '🚗', title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc') },
                                { step: 3, icon: '🚇', title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc') }
                            ].map((item) => (
                                <motion.div key={item.step} variants={staggerGridItem}>
                                    <Card glass className="text-center">
                                        <div className="text-6xl mb-4">{item.icon}</div>
                                        <div className="text-metro-red font-bold text-lg mb-2">{t('howItWorks.stepLabel')} {item.step}</div>
                                        <h3 className="text-2xl font-display font-bold text-white mb-3">{item.title}</h3>
                                        <p className="text-gray-300">{item.desc}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <section className="py-20 relative overflow-hidden">
                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_14%_24%,rgba(230,57,70,0.11),transparent_42%),radial-gradient(circle_at_84%_74%,rgba(6,214,160,0.11),transparent_46%)] blur-2xl will-change-transform"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <FloatingMetro type="station" size="lg" className="bottom-10 left-5" delay={1} />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUpOnScroll} className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">{t('benefits.title')}</h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t('benefits.subtitle')}</p>
                        </motion.div>

                        <motion.div
                            className="stagger-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={staggerGridContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            {translatedFeatures.map((feature) => (
                                <motion.div key={feature.id} variants={staggerGridItem}>
                                    <Card glass className="text-center">
                                        <div className="text-5xl mb-4">{feature.icon}</div>
                                        <h3 className="text-xl font-display font-bold text-white mb-3">{feature.title}</h3>
                                        <p className="text-gray-300">{feature.description}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <section className="py-20 text-white relative overflow-hidden">
                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_16%_76%,rgba(6,214,160,0.12),transparent_44%),radial-gradient(circle_at_86%_26%,rgba(230,57,70,0.1),transparent_42%)] blur-2xl will-change-transform"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <FloatingMetro type="train" size="lg" className="top-20 right-10" delay={0.5} />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUpOnScroll} className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{t('experience.title')}</h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t('experience.subtitle')}</p>
                        </motion.div>

                        <motion.div
                            className="stagger-grid grid grid-cols-1 md:grid-cols-3 gap-8"
                            variants={staggerGridContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            {[
                                { icon: '📱', label: t('experience.tracking') },
                                { icon: '🗺️', label: t('experience.mapView') },
                                { icon: '📊', label: t('experience.dashboard') }
                            ].map((screen, index) => (
                                <motion.div key={index} variants={staggerGridItem}>
                                    <Card glass className="text-center h-80 flex items-center justify-center">
                                        <div>
                                            <div className="text-6xl mb-4">{screen.icon}</div>
                                            <p className="text-2xl font-display font-bold">{screen.label}</p>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <section className="py-20 relative overflow-hidden">
                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_22%,rgba(230,57,70,0.12),transparent_44%),radial-gradient(circle_at_78%_78%,rgba(6,214,160,0.12),transparent_45%)] blur-2xl will-change-transform"
                        animate={{ y: [0, -4, 0], x: [0, -4, 0] }}
                        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <FloatingMetro type="icon" size="md" className="top-20 left-10" delay={1} />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUpOnScroll} className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">{t('testimonials.title')}</h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t('testimonials.subtitle')}</p>
                        </motion.div>

                        <motion.div
                            className="stagger-grid grid grid-cols-1 md:grid-cols-3 gap-8"
                            variants={staggerGridContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            {translatedTestimonials.map((testimonial) => (
                                <motion.div key={testimonial.id} variants={staggerGridItem}>
                                    <Card glass className="text-center">
                                        <div className="text-6xl mb-4">{testimonial.image}</div>
                                        <div className="flex justify-center mb-3">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <FaStar key={i} className="text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-gray-300 italic mb-4">&quot;{testimonial.text}&quot;</p>
                                        <h4 className="font-bold text-white">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <CTA />
            </div>
        </motion.main>
    );
}
