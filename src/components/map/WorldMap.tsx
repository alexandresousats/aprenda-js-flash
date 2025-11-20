'use client'

import LevelNode from './LevelNode'

// Mock data for World 1
const LEVELS = [
    { id: 1, status: 'completed', x: 50, y: 10 },
    { id: 2, status: 'completed', x: 35, y: 20 },
    { id: 3, status: 'available', x: 65, y: 30 },
    { id: 4, status: 'locked', x: 50, y: 40 },
    { id: 5, status: 'locked', x: 25, y: 50 },
    { id: 6, status: 'locked', x: 40, y: 60 },
    { id: 7, status: 'locked', x: 75, y: 70 },
    { id: 8, status: 'locked', x: 60, y: 80 },
    { id: 9, status: 'locked', x: 50, y: 90 },
] as const

export default function WorldMap() {
    return (


        <div className="relative w-full max-w-2xl mx-auto h-[1000px] bg-bg-secondary/30 rounded-3xl border border-bg-tertiary overflow-hidden my-8">
            {/* World Title (Moved to Top) */}
            <div className="absolute top-8 left-0 w-full text-center z-10 pointer-events-none">
                <h2 className="text-2xl font-bold text-text-primary drop-shadow-lg">
                    MUNDO 1: FUNDAMENTOS
                </h2>
                <p className="text-text-secondary">A Ilha do Início</p>
            </div>

            {/* Decorative Background Grid */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(#4A5568 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />



            {/* Path SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                <path
                    d="M 50% 10% Q 35% 15% 35% 20% T 65% 30% T 50% 40% T 25% 50% T 40% 60% T 75% 70% T 60% 80% T 50% 90%"
                    fill="none"
                    stroke="var(--color-bg-tertiary)"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                {/* Active Path Progress (Mocked) */}
                <path
                    d="M 50% 10% Q 35% 15% 35% 20% T 65% 30%"
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
        </div>
    )
}
