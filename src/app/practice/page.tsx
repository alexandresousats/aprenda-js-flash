'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import FlashCard from '@/components/flashcards/FlashCard'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PracticePage() {
    const [cards, setCards] = useState<any[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [showRating, setShowRating] = useState(false)

    useEffect(() => {
        const fetchCards = async () => {
            // For MVP, just fetch random 5 cards
            const { data } = await supabase
                .from('flashcards')
                .select('*')
                .limit(5)

            if (data) setCards(data)
            setLoading(false)
        }
        fetchCards()
    }, [])

    const handleNext = () => {
        setShowRating(false)
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            alert('Sessão concluída! +50 XP')
            window.location.href = '/dashboard'
        }
    }

    if (loading) return (
        <DashboardLayout>
            <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-accent-primary" /></div>
        </DashboardLayout>
    )

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
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/30 transition-colors font-bold"
                        >
                            <X className="w-5 h-5" /> Difícil
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/50 rounded-xl hover:bg-green-500/30 transition-colors font-bold"
                        >
                            <Check className="w-5 h-5" /> Fácil
                        </button>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    )
}
