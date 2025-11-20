'use client'

import LevelNode from './LevelNode'

// Mock data for World 1
const LEVELS = [
    { id: 1, status: 'completed', x: 50, y: 90 },
    { id: 2, status: 'completed', x: 35, y: 80 },
    { id: 3, status: 'available', x: 65, y: 70 },
    { id: 4, status: 'locked', x: 50, y: 60 },
    { id: 5, status: 'locked', x: 25, y: 50 },
    { id: 6, status: 'locked', x: 40, y: 40 },
    { id: 7, status: 'locked', x: 75, y: 30 },
    { id: 8, status: 'locked', x: 60, y: 20 },
    { id: 9, status: 'locked', x: 50, y: 10 },
] as const

export default function WorldMap() {
    return (
        <div className="relative w-full max-w-2xl mx-auto h-[1000px] bg-bg-secondary/30 rounded-3xl border border-bg-tertiary overflow-hidden my-8">
            {/* Decorative Background Grid */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(#4A5568 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            {/* Path SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                <path
                    d="M 50% 90% Q 35% 85% 35% 80% T 65% 70% T 50% 60% T 25% 50% T 40% 40% T 75% 30% T 60% 20% T 50% 10%"
                    fill="none"
                    stroke="var(--color-bg-tertiary)"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                {/* Active Path Progress (Mocked) */}
                <path
                    d="M 50% 90% Q 35% 85% 35% 80% T 65% 70%"
                    fill="none"
                    stroke="var(--color-accent-primary)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="10 10"
                    className="animate-pulse"
                />
            </svg>

            {/* Level Nodes */}
            {LEVELS.map((level) => (
                <LevelNode
                    key={level.id}
                    level={level.id}
                    status={level.status}
                    position={{ x: level.x, y: level.y }}
                    onClick={() => console.log(`Start Level ${level.id}`)}
                />
            ))}

            {/* World Title */}
            <div className="absolute bottom-4 left-0 w-full text-center">
                <h2 className="text-3xl font-bold text-text-primary drop-shadow-lg">
                    MUNDO 1: FUNDAMENTOS
                </h2>
                <p className="text-text-secondary">A Ilha do Início</p>
            </div>
        </div>
    )
}
