'use client'

import { motion } from 'framer-motion'
import { Star, Lock, Check } from 'lucide-react'
import clsx from 'clsx'

interface LevelNodeProps {
    level: number
    status: 'locked' | 'available' | 'completed' | 'perfect'
    position: { x: number; y: number } // Percentage 0-100
    onClick?: () => void
}

export default function LevelNode({ level, status, position, onClick }: LevelNodeProps) {
    const isLocked = status === 'locked'

    return (
        <motion.button
            whileHover={!isLocked ? { scale: 1.1 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
            onClick={!isLocked ? onClick : undefined}
            className={clsx(
                "absolute w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg transition-colors z-10",
                {
                    'bg-bg-tertiary border-bg-secondary text-text-muted cursor-not-allowed': status === 'locked',
                    'bg-accent-primary border-white text-bg-primary cursor-pointer animate-pulse': status === 'available',
                    'bg-accent-blue border-accent-primary text-white cursor-pointer': status === 'completed',
                    'bg-accent-gold border-white text-bg-primary cursor-pointer': status === 'perfect',
                }
            )}
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)'
            }}
        >
            {status === 'locked' && <Lock className="w-6 h-6" />}
            {status === 'available' && <span className="text-xl font-bold">{level}</span>}
            {status === 'completed' && <Check className="w-8 h-8" />}
            {status === 'perfect' && <Star className="w-8 h-8 fill-current" />}

            {/* Level Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold bg-bg-secondary px-2 py-1 rounded-md border border-bg-tertiary">
                Level {level}
            </div>
        </motion.button>
    )
}
