'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useUserStore } from '@/store/useUserStore'
import ReactMarkdown from 'react-markdown'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css' // Dark theme
import { Loader2, Play, CheckCircle, ArrowRight, Heart } from 'lucide-react'
import confetti from 'canvas-confetti'
import GameOverModal from '@/components/modals/GameOverModal'

interface LessonPlayerProps {
    levelId: number
}

export default function LessonPlayer({ levelId }: LessonPlayerProps) {
    const router = useRouter()
    const { addCoins, addXp, lives, loseLife } = useUserStore()

    const [loading, setLoading] = useState(true)
    const [lesson, setLesson] = useState<any>(null)
    const [code, setCode] = useState('')
    const [output, setOutput] = useState<string[]>([])
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const fetchLesson = async () => {
            const { data, error } = await supabase
                .from('lessons')
                .select('*, levels(*)')
                .eq('level_id', levelId)
                .single()

            if (error) {
                console.error('Error fetching lesson:', error)
                return
            }

            setLesson(data)
            setCode(data.initial_code || '')
            setLoading(false)
        }

        fetchLesson()
    }, [levelId])

    const runCode = async () => {
        if (lives <= 0) return

        setStatus('running')
        setOutput([])
        setErrorMessage('')

        try {
            // Capture console.log
            const logs: string[] = []
            const mockConsole = {
                log: (...args: any[]) => {
                    logs.push(args.map(a => String(a)).join(' '))
                }
            }

            // Safe-ish eval wrapper
            // Note: In a real prod app, use a sandboxed iframe or web worker
            const runUserCode = new Function('console', 'output', `
        try {
          ${code}
          ${lesson.test_case}
        } catch (e) {
          throw e;
        }
      `)

            runUserCode(mockConsole, logs.join('\n')) // Pass logs as 'output' for test case check

            setOutput(logs)
            setStatus('success')
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })

            // Save progress
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase.from('user_progress').upsert({
                    user_id: user.id,
                    level_id: levelId,
                    status: 'completed',
                    score: 100,
                    completed_at: new Date().toISOString()
                }, { onConflict: 'user_id, level_id' })

                addCoins(lesson.levels.coins_reward)
                addXp(lesson.levels.xp_reward)
            }

        } catch (err: any) {
            setStatus('error')
            setErrorMessage(err.message)
            loseLife()
        }
    }

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-accent-primary" /></div>

    return (
        <div className="flex flex-col md:flex-row h-screen bg-bg-primary text-text-primary overflow-hidden relative">
            {lives <= 0 && <GameOverModal />}

            {/* Left Panel: Content */}
            <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r border-bg-tertiary bg-bg-secondary/50">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-2"
                    >
                        ← Voltar
                    </button>
                    <div className="flex items-center gap-1 text-accent-secondary font-bold bg-bg-primary px-3 py-1 rounded-full border border-bg-tertiary">
                        <Heart className="w-4 h-4 fill-current" />
                        <span>{lives}</span>
                    </div>
                </div>

                <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>{lesson.content_markdown}</ReactMarkdown>
                </div>
            </div>

            {/* Right Panel: Editor & Output */}
            <div className="w-full md:w-2/3 flex flex-col h-full">
                {/* Editor Toolbar */}
                <div className="h-12 bg-bg-secondary border-b border-bg-tertiary flex items-center px-4 justify-between">
                    <span className="text-sm font-mono text-text-muted">main.js</span>
                    <div className="flex gap-2">
                        <button
                            onClick={runCode}
                            disabled={status === 'running' || lives <= 0}
                            className="flex items-center gap-2 px-4 py-1.5 bg-accent-primary text-bg-primary font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'running' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            Executar
                        </button>
                    </div>
                </div>

                {/* Code Editor */}
                <div className="flex-1 bg-[#1d1f21] overflow-y-auto font-mono text-sm relative">
                    <Editor
                        value={code}
                        onValueChange={code => setCode(code)}
                        highlight={code => highlight(code, languages.js, 'js')}
                        padding={20}
                        style={{
                            fontFamily: '"Fira Code", "Fira Mono", monospace',
                            fontSize: 14,
                            minHeight: '100%'
                        }}
                        className="min-h-full"
                    />
                </div>

                {/* Output Console */}
                <div className="h-1/3 bg-bg-primary border-t border-bg-tertiary flex flex-col">
                    <div className="px-4 py-2 bg-bg-secondary/50 text-xs font-bold text-text-muted uppercase tracking-wider">
                        Console Output
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
                        {output.map((line, i) => (
                            <div key={i} className="text-text-secondary mb-1">{line}</div>
                        ))}

                        {status === 'error' && (
                            <div className="text-red-400 mt-2 animate-shake">
                                ❌ {errorMessage}
                                <div className="text-xs text-accent-secondary mt-1 font-bold">-1 Vida</div>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-green-400 font-bold">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Missão Cumprida!</span>
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <span className="text-accent-gold">+{lesson.levels.coins_reward} Coins</span>
                                    <span className="text-accent-blue">+{lesson.levels.xp_reward} XP</span>
                                </div>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="self-start flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors text-sm font-bold"
                                >
                                    Próximo Nível <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
