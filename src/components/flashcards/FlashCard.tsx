'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface FlashCardProps {
    front: string
    back: string
    category: string
    onFlip?: () => void
}

export default function FlashCard({ front, back, category, onFlip }: FlashCardProps) {
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
        if (!isFlipped && onFlip) onFlip()
    }

    return (
        <div className="perspective-1000 w-full max-w-xl mx-auto h-80 cursor-pointer" onClick={handleFlip}>
            <motion.div
                className="relative w-full h-full transition-all duration-500 preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
                {/* Front */}
                <div className="absolute inset-0 w-full h-full bg-bg-secondary border-2 border-bg-tertiary rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden shadow-xl">
                    <span className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider text-text-muted bg-bg-primary px-2 py-1 rounded">
                        {category}
                    </span>
                    <h3 className="text-2xl font-bold text-center text-text-primary">{front}</h3>
                    <p className="absolute bottom-6 text-sm text-text-muted animate-pulse">
                        Clique para virar
                    </p>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 w-full h-full bg-bg-tertiary border-2 border-accent-primary rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden shadow-xl"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <h3 className="text-xl text-center text-white leading-relaxed">{back}</h3>
                </div>
            </motion.div>
        </div>
    )
}
