'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function AuthForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/')
                router.refresh()
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                alert('Check your email for the confirmation link!')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md p-8 bg-bg-secondary rounded-2xl border border-bg-tertiary shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-text-primary">
                {isLogin ? 'Welcome Back' : 'Join the Quest'}
            </h2>

            <form onSubmit={handleAuth} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-bg-primary border border-bg-tertiary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none text-text-primary transition-all"
                        placeholder="hero@codequest.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-bg-primary border border-bg-tertiary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none text-text-primary transition-all"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-accent-primary to-accent-blue text-bg-primary font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        isLogin ? 'Login' : 'Start Adventure'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-text-secondary hover:text-accent-primary transition-colors text-sm"
                >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    )
}
