'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import FlashCard from '@/components/flashcards/FlashCard'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Check, X, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// SM-2 Algorithm Constants
const DEFAULT_EASE = 2.5
const MIN_EASE = 1.3

export default function PracticePage() {
    const [cards, setCards] = useState<any[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [showRating, setShowRating] = useState(false)
    const [sessionComplete, setSessionComplete] = useState(false)

    useEffect(() => {
        const fetchCards = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 1. Get cards due for review (or new ones)
            // This is a simplified logic. Ideally, we'd use a more complex query or RPC.
            // For now: Fetch all flashcards and left join user_flashcards to filter in JS (MVP style)

            const { data: allCards, error } = await supabase
                .from('flashcards')
                .select(`
          *,
          user_flashcards (
            *
          )
        `)

            if (error) {
                console.error(error)
                return
            }

            // Filter logic:
            // 1. New cards (no user_flashcards entry)
            // 2. Due cards (next_review_at <= now)
            const now = new Date()

            const dueCards = allCards.filter((card: any) => {
                const userCard = card.user_flashcards?.[0] // Assuming single entry per user due to unique constraint logic (though array returned)

                // If user hasn't seen it, filter by user_id manually if needed, but RLS handles "own" rows.
                // Actually, the left join returns user_flashcards for the current user if RLS is set correctly on user_flashcards.
                // But wait, RLS on user_flashcards filters rows. If no row exists, it's null/empty.

                if (!userCard) return true // New card

                return new Date(userCard.next_review_at) <= now
            }).slice(0, 10) // Limit session to 10 cards

            setCards(dueCards)
            setLoading(false)
        }
        fetchCards()
    }, [])

    const handleRate = async (rating: 'easy' | 'hard') => {
        const card = cards[currentIndex]
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Current state (defaults for new card)
        // Note: We need to handle the array structure from the join
        const userCard = card.user_flashcards?.find((uc: any) => uc.user_id === user.id) || {
            interval_days: 0,
            ease_factor: DEFAULT_EASE,
            streak: 0
        }

        // SM-2 Logic Calculation
        let newInterval = 0
        let newEase = userCard.ease_factor
        let newStreak = userCard.streak

        if (rating === 'hard') {
            newStreak = 0
            newInterval = 1 // Review tomorrow
            newEase = Math.max(MIN_EASE, newEase - 0.2)
        } else {
            // Easy
            newStreak += 1
            if (newStreak === 1) {
                newInterval = 1
            } else if (newStreak === 2) {
                newInterval = 6
            } else {
                newInterval = Math.round(userCard.interval_days * newEase)
            }
            newEase += 0.1 // Slightly increase ease
        }

        const nextReviewDate = new Date()
        nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)

        // Update DB
        await supabase.from('user_flashcards').upsert({
            user_id: user.id,
            flashcard_id: card.id,
            interval_days: newInterval,
            ease_factor: newEase,
            streak: newStreak,
            next_review_at: nextReviewDate.toISOString(),
            last_reviewed_at: new Date().toISOString()
        }, { onConflict: 'user_id, flashcard_id' })

        // Next card
        setShowRating(false)
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            setSessionComplete(true)
        }
    }

    if (loading) return (
        <DashboardLayout>
            <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-accent-primary" /></div>
        </DashboardLayout>
    )

    if (sessionComplete) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Sessão Concluída!</h1>
                    <p className="text-text-secondary mb-8">Você revisou todos os cards pendentes por hoje.</p>
                    <a href="/dashboard" className="px-6 py-3 bg-accent-primary text-bg-primary font-bold rounded-xl hover:opacity-90 transition-opacity">
                        Voltar ao Dashboard
                    </a>
                </div>
            </DashboardLayout>
        )
    }

    if (cards.length === 0) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 bg-accent-blue/20 rounded-full flex items-center justify-center mb-6">
                        <Clock className="w-10 h-10 text-accent-blue" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Tudo em dia!</h1>
                    <p className="text-text-secondary mb-8">Não há cards para revisar agora. Volte mais tarde!</p>
                    <a href="/dashboard" className="px-6 py-3 bg-bg-tertiary text-white font-bold rounded-xl hover:bg-bg-tertiary/80 transition-colors">
                        Voltar ao Dashboard
                    </a>
                </div>
            </DashboardLayout>
        )
    }

    const currentCard = cards[currentIndex]

    return (
        <DashboardLayout>
            <div className="flex flex-col items-center max-w-2xl mx-auto py-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary">Treino Rápido</h1>
                    <p className="text-text-secondary">Card {currentIndex + 1} de {cards.length}</p>
                </div>

                <div className="w-full mb-8">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentCard.id}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                        >
                            <FlashCard
                                front={currentCard.front_content}
                                back={currentCard.back_content}
                                category={currentCard.category}
                                onFlip={() => setShowRating(true)}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {showRating && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4"
                    >
                        <button
                            onClick={() => handleRate('hard')}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/30 transition-colors font-bold"
                        >
                            <X className="w-5 h-5" /> Difícil (1 dia)
                        </button>
                        <button
                            onClick={() => handleRate('easy')}
                            className="flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/50 rounded-xl hover:bg-green-500/30 transition-colors font-bold"
                        >
                            <Check className="w-5 h-5" /> Fácil (Mais dias)
                        </button>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    )
}
