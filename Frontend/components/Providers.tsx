'use client';

import React, { ReactNode, useEffect } from 'react';
import '@/lib/i18n'; // Initialize i18n
import { I18nextProvider } from 'react-i18next';
import i18n, { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/lib/i18n';
import { AuthProvider } from '@/context/AuthContext';

const normalizeLanguage = (value: string | null): SupportedLanguage | null => {
    if (!value) return null;
    const baseLanguage = value.toLowerCase().split('-')[0];
    if (SUPPORTED_LANGUAGES.includes(baseLanguage as SupportedLanguage)) {
        return baseLanguage as SupportedLanguage;
    }
    return null;
};

export default function Providers({ children }: { children: ReactNode }) {
    useEffect(() => {
        const savedLanguage = normalizeLanguage(
            window.localStorage.getItem('roadchalLng') ?? window.localStorage.getItem('i18nextLng')
        );

        if (savedLanguage && i18n.resolvedLanguage !== savedLanguage) {
            void i18n.changeLanguage(savedLanguage);
        }
    }, []);

    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </I18nextProvider>
    );
}
