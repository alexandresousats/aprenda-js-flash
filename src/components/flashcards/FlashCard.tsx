'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

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
        <div className="perspective-1000 w-full max-w-xl mx-auto h-96 cursor-pointer" onClick={handleFlip}>
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
                    className="absolute inset-0 w-full h-full bg-bg-tertiary border-2 border-accent-primary rounded-2xl p-6 flex flex-col items-center justify-center backface-hidden shadow-xl overflow-y-auto"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div className="prose prose-invert prose-sm max-w-none w-full text-left">
                        <ReactMarkdown
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={tomorrow}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {back}
                        </ReactMarkdown>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
