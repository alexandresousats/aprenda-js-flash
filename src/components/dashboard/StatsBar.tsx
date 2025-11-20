'use client'

import { useUserStore } from '@/store/useUserStore'
import { Heart, Zap, Coins, Flame } from 'lucide-react'
import { useEffect } from 'react'

export default function StatsBar() {
    const { lives, xp, coins, streak, fetchProfile, loading } = useUserStore()

    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])

    if (loading) return <div className="h-16 w-full bg-bg-secondary animate-pulse rounded-xl" />

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-bg-primary/80 backdrop-blur-md border-b border-bg-tertiary px-4 py-3">
            <div className="max-w-5xl mx-auto flex items-center justify-between">

                {/* Left: Lives & XP */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-accent-secondary font-bold">
                        <Heart className="w-6 h-6 fill-current" />
                        <span>{lives}</span>
                    </div>

                    <div className="flex items-center gap-2 text-accent-blue font-bold">
                        <Zap className="w-6 h-6 fill-current" />
                        <span>{xp} XP</span>
                    </div>
                </div>

                {/* Center: Logo (Mobile hidden) */}
                <div className="hidden md:block font-bold text-xl bg-clip-text text-transparent bg-image-gradient-epic">
                    JS Master Quest
                </div>

                {/* Right: Coins & Streak */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-accent-gold font-bold">
                        <Coins className="w-6 h-6 fill-current" />
                        <span>{coins}</span>
                    </div>

                    <div className="flex items-center gap-2 text-orange-500 font-bold">
                        <Flame className="w-6 h-6 fill-current" />
                        <span>{streak}</span>
                    </div>
                </div>

            </div>
        </div>
    )
}
