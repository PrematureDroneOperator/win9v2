'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FloatingMetro from './FloatingMetro';
import { useTranslation } from 'react-i18next';

const CTA = () => {
    const { t } = useTranslation();

    return (
        <section className="py-20 relative overflow-hidden">
            <FloatingMetro type="train" size="lg" className="top-10 left-20" delay={0} />
            <FloatingMetro type="station" size="md" className="bottom-10 right-20" delay={1} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                        {t('cta.title')}
                    </h2>
                    <p className="text-xl text-white mb-8">
                        {t('cta.subtitle')}
                    </p>
                    <Link href="/register">
                        <motion.button
                            className="bg-white text-metro-red px-10 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t('cta.button')}
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
