'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    useEffect(() => {
        const completeOAuthLogin = async () => {
            if (!isSupabaseConfigured || !supabase) {
                setError('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
                return;
            }

            const { data, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                setError(sessionError.message);
                return;
            }

            if (!data.session) {
                setError('No active session found. Please try signing in again.');
                return;
            }

            localStorage.setItem('user', JSON.stringify(data.session.user));
            localStorage.setItem('session', JSON.stringify(data.session));
            router.replace('/dashboard');
        };

        completeOAuthLogin();
    }, [router]);

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-metro-dark px-4">
                <div className="max-w-md w-full bg-white/10 border border-white/20 rounded-lg p-6 text-center text-white">
                    <h1 className="text-2xl font-semibold mb-3">Google sign-in failed</h1>
                    <p className="text-sm text-red-300 mb-5">{error}</p>
                    <Link href="/login" className="text-metro-teal hover:underline">
                        Back to login
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-metro-dark text-white">
            <p>Completing Google sign-in...</p>
        </main>
    );
}
