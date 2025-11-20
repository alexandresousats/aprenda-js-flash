'use client'

import { motion } from 'framer-motion'
import { HeartCrack, RefreshCcw, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/useUserStore'

export default function GameOverModal() {
    const router = useRouter()
    const { restoreLife } = useUserStore()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-bg-secondary border-2 border-accent-secondary rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-accent-secondary/20"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-accent-secondary/20 rounded-full flex items-center justify-center animate-pulse">
                        <HeartCrack className="w-10 h-10 text-accent-secondary" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
                <p className="text-text-secondary mb-8">
                    Suas vidas acabaram. Você precisa descansar ou recarregar para continuar aprendendo.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => {
                            restoreLife() // Mock: Restore 1 life instantly for MVP
                            window.location.reload()
                        }}
                        className="w-full py-3 px-4 bg-accent-primary text-bg-primary font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        Tentar Novamente (Recuperar 1 Vida)
                    </button>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full py-3 px-4 bg-bg-tertiary text-text-primary font-bold rounded-xl hover:bg-bg-tertiary/80 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Voltar ao Menu
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
